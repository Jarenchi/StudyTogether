const { Server } = require("socket.io");

let existingText = "";
let editingUser = "";
const users = new Set();

function setupQuillSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    path: "/quill",
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    users.add(socket.id);
    socket.emit("connectUser", socket.id);
    socket.emit("text", existingText);
    io.emit("users", Array.from(users));

    socket.on("text", (newText) => {
      existingText = newText;
      io.emit("text", newText);
    });

    socket.on("editing", (userId) => {
      editingUser = userId;
      io.emit("editing", userId);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      users.delete(socket.id);
      if (editingUser === socket.id) {
        editingUser = "";
        io.emit("editing", "");
      }
      io.emit("users", Array.from(users));
    });
  });
}

module.exports = { setupQuillSocket };
