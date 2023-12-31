"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import nookies from "nookies";
import "react-quill/dist/quill.snow.css";
import io, { Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import debounce from "@/utils/debounce";
import quillModules from "@/lib/quill-modules";
import { Input } from "../ui/input";

const QuillEditor = () => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
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
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        console.log(error);
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
  const [text, setText] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [editingUsers, setEditingUsers] = useState<string[]>([]);
  const [curUser, setCurUser] = useState("");

  useEffect(() => {
    if (data) {
      setText(data.content);
      setTitle(data.title);
    }
  }, [data]);

  // socket.io
  const socketRef = useRef<Socket>();
  useEffect(() => {
    const userName = nookies.get().user_name;
    socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      path: "/quill",
    });
    socketRef.current.emit("connectUser", userName, targetDocId);
    setCurUser(userName);
    socketRef.current.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socketRef.current.on("text", (newText: string) => {
      setText(newText);
    });
    socketRef.current.on("users", (newUsers: string[]) => {
      setUsers(newUsers);
    });
    socketRef.current.on("editing", (newEditingUsers: string[]) => {
      console.log("Editing event received. Users:", newEditingUsers);
      setEditingUsers(newEditingUsers);
    });
    return () => {
      socketRef.current?.emit("disconnectUser", userName, targetDocId);
      socketRef.current?.disconnect();
    };
  }, []);

  const handleTextChange = debounce((newText: string) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${targetClubId}/docs/${targetDocId}`,
        { content: newText },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
    socketRef.current?.emit("editing", curUser, targetDocId);
    socketRef.current?.emit("text", newText, targetDocId);
  });
  const handleBlur = () => {
    const updatedEditingUsers = editingUsers.filter((user) => user !== curUser);
    setEditingUsers(updatedEditingUsers);
    socketRef.current?.emit("stopEditing", curUser, targetDocId);
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  // title改變
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  async function handleTitleBlur() {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${targetClubId}/docs/${targetDocId}/title`,
        { title },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      );
      console.log(response.data);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        console.log(error);
      }
    } finally {
      setIsEditing(false);
    }
  }
  async function handleTitleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleTitleBlur();
    }
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
      <div className="flex justify-center items-start h-[86vh] flex-col-reverse lg:flex-row">
        <div className="h-[82vh]">
          <ReactQuill
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            modules={quillModules}
            preserveWhitespace
            className="h-[75vh] w-[70vw]"
          />
        </div>
        <div className="lg:h-[79vh] lg:ml-3 my-5 lg:my-0">
          <p className="text-lg mb-2">Online Users:</p>
          <ul className="flex lg:flex-col gap-2">
            {users.map((user) => (
              <Badge key={user} className="text-lg dark:text-white truncate block">
                {user} {editingUsers.includes(user) && <span>(Editing)</span>}
              </Badge>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuillEditor;
