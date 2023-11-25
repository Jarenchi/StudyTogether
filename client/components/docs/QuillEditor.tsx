"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import io, { Socket } from "socket.io-client";
import debounce from "@/utils/debounce";

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      [{ align: [] }],
      [{ background: ["rgb(  0,   0,   0)"] }],
      [{ color: ["rgb( 61,  20,  10)"] }],
      ["clean"],
    ],
  },
};

const QuillEditor = () => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
  const [text, setText] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState("");
  const [curUser, setCurUser] = useState("");

  const socketRef = useRef<Socket>();
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      path: "/quill",
    });
    socketRef.current.on("text", (newText: string) => {
      setText(newText);
    });
    socketRef.current.on("users", (newUsers: string[]) => {
      setUsers(newUsers);
    });
    socketRef.current.on("editing", (userId: string) => {
      setEditingUser(userId);
    });
    socketRef.current.on("connectUser", (userId: string) => {
      setCurUser(userId);
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleTextChange = debounce((newText: string) => {
    socketRef.current?.emit("editing", curUser);
    socketRef.current?.emit("text", newText);
  });
  const handleBlur = () => {
    setEditingUser("");
    socketRef.current?.emit("editing", "");
  };

  return (
    <div className="app">
      <div className="header">
        <h1>共用編輯文件</h1>
      </div>
      <div className="container">
        <div className="user-list">
          <p>線上用戶:</p>
          <ul>
            {users.map((user, index) => (
              <li key={index} className={user === editingUser ? "editing" : ""}>
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className="editor">
          <ReactQuill
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            modules={modules}
            preserveWhitespace
          />
        </div>
      </div>
    </div>
  );
};

export default QuillEditor;
