"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import io, { Socket } from "socket.io-client";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
  ],
};

const QuillEditor = () => {
  const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
  const [text, setText] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState("");
  const [curUser, setCurUser] = useState("");

  const socketRef = useRef<Socket>();
  useEffect(() => {
    socketRef.current = io("http://localhost:5000/quill");
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

  const handleTextChange = (newText: string) => {
    socketRef.current?.emit("editing", curUser);
    socketRef.current?.emit("text", newText);
  };
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
            placeholder="在这里开始你的远程协作办公吧"
            preserveWhitespace
          />
        </div>
      </div>
    </div>
  );
};

export default QuillEditor;
