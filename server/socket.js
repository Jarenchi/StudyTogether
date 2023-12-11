const { Server } = require("socket.io");

let existingText = "";
let editingUser = "";
const users = new Set();

function setupQuillSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    // path: "/quill",
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("connectUser", (userName) => {
      users.add(userName);
      console.log(`${userName} has connected`);
      io.emit("users", Array.from(users));
    });

    socket.on("text", (newText) => {
      existingText = newText;
      io.emit("text", newText);
    });

    socket.on("editing", (userId) => {
      console.log("Editing event received. User:", userId);
      editingUser = userId;
      io.emit("editing", userId);
    });

    socket.on("disconnect", (userName) => {
      console.log(`${userName} has disconnected`);
      users.delete(userName);
      if (editingUser === socket.id) {
        editingUser = "";
        io.emit("editing", "");
      }
      io.emit("users", Array.from(users));
    });
  });
}

module.exports = { setupQuillSocket };
