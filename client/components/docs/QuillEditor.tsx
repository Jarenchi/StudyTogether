"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import type ReactQuillType from "react-quill";
import nookies from "nookies";
import "react-quill/dist/quill.snow.css";
import io, { Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import quillModules from "@/lib/quill-modules";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import { Input } from "../ui/input";

/* eslint-disable @typescript-eslint/indent, prettier/prettier */
type ReactQuillWithRef = React.ForwardRefExoticComponent<
  import("react-quill").ReactQuillProps & React.RefAttributes<ReactQuillType>
>;
/* eslint-enable @typescript-eslint/indent, prettier/prettier */

const QuillEditor = () => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }) as unknown as ReactQuillWithRef,
    [],
  );
  const params = useParams();
  const router = useRouter();
  const targetClubId = params.club as string;
  const targetDocId = params.doc as string;

  async function getDocById(clubId: string, docId: string) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/docs/${docId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      }
      throw error;
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getDocById(targetClubId, targetDocId),
    queryKey: ["doc", targetDocId],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    if (data) setTitle(data.title);
  }, [data]);

  // Yjs + Socket
  // pendingSyncRef / pendingInitContentRef: store server data that arrives before
  // ReactQuill has finished its dynamic import and mounted
  const socketRef = useRef<Socket>();
  const ydocRef = useRef<Y.Doc | null>(null);
  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
  }
  const bindingRef = useRef<QuillBinding | null>(null);
  const quillInstanceRef = useRef<any>(null);
  const pendingSyncRef = useRef<number[] | null>(null);
  const pendingInitContentRef = useRef<string | null>(null);

  // Callback ref — called by ReactQuill when it mounts/unmounts.
  // This is the canonical place to create the QuillBinding because
  // dynamic(() => import("react-quill")) can resolve after socket events fire.
  const quillCallback = useCallback((instance: ReactQuillType | null) => {
    if (!instance) {
      bindingRef.current?.destroy();
      bindingRef.current = null;
      quillInstanceRef.current = null;
      return;
    }
    const quill = instance.getEditor();
    quillInstanceRef.current = quill;
    const ytext = ydocRef.current!.getText("quill");

    // Create binding BEFORE applying pending state so the binding can observe changes
    bindingRef.current = new QuillBinding(ytext, quill);

    // Apply any Yjs state that arrived before the editor mounted
    if (pendingSyncRef.current) {
      Y.applyUpdate(ydocRef.current!, new Uint8Array(pendingSyncRef.current), "remote");
      pendingSyncRef.current = null;
    }

    // Initialize from DB HTML if ydoc was empty when this room was created
    if (pendingInitContentRef.current) {
      const delta = quill.clipboard.convert({ html: pendingInitContentRef.current });
      quill.setContents(delta);
      // setContents → QuillBinding → Y.Text update → ydoc "update" event → y-update sent to server
      pendingInitContentRef.current = null;
    }
  }, []);

  useEffect(() => {
    const userName = nookies.get().user_name;
    const ydoc = ydocRef.current!;

    socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      path: "/quill",
    });

    socketRef.current.on("connect", () => {
      socketRef.current!.emit("y-sync-request", targetDocId);
      socketRef.current!.emit("connectUser", userName, targetDocId);
    });

    // Server sends initial HTML when this is the first user and ydoc was empty
    socketRef.current.on("y-init-content", (html: string) => {
      const quill = quillInstanceRef.current;
      if (quill && bindingRef.current) {
        // Editor already mounted — initialize immediately
        const delta = quill.clipboard.convert({ html });
        quill.setContents(delta);
      } else {
        // Editor not mounted yet — store for quillCallback to apply
        pendingInitContentRef.current = html;
      }
    });

    // Server sends current Yjs state for subsequent users
    socketRef.current.on("y-sync", (state: number[]) => {
      if (bindingRef.current) {
        Y.applyUpdate(ydoc, new Uint8Array(state), "remote");
      } else {
        pendingSyncRef.current = state;
      }
    });

    // Receive remote updates from other users
    socketRef.current.on("y-update", (update: number[]) => {
      Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
    });

    // Send local ydoc updates to server — skip updates that originated remotely
    ydoc.on("update", (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return;
      socketRef.current?.emit("y-update", Array.from(update), targetDocId);
    });

    socketRef.current.on("users", (newUsers: string[]) => {
      setUsers(newUsers);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socketRef.current?.emit("disconnectUser", userName, targetDocId);
      socketRef.current?.disconnect();
      bindingRef.current?.destroy();
      bindingRef.current = null;
      ydoc?.destroy();
    };
  }, [targetDocId]);

  const handleTitleClick = () => setIsEditing(true);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  async function handleTitleBlur() {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${targetClubId}/docs/${targetDocId}/title`,
        { title },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      }
    } finally {
      setIsEditing(false);
    }
  }

  async function handleTitleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") handleTitleBlur();
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center my-2">
        <span className="mr-2">Title:</span>
        {isEditing ? (
          <Input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="max-w-xs"
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
          <h1 onClick={handleTitleClick} className="py-2 px-3 min-w-[320px]">
            {title}
          </h1>
        )}
      </div>
      <div className="flex justify-center items-start flex-col lg:flex-row gap-4 px-4">
        <div className="w-full lg:flex-1">
          <ReactQuill ref={quillCallback} modules={quillModules} preserveWhitespace className="h-[calc(100vh_-_14rem)] w-full" />
        </div>
        <div className="lg:h-[calc(100vh_-_14rem)] lg:ml-3 lg:w-48">
          <p className="text-lg mb-2">Online Users:</p>
          <ul className="flex lg:flex-col gap-2">
            {users.map((user) => (
              <Badge key={user} className="text-lg dark:text-white truncate block">
                {user}
              </Badge>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuillEditor;
