const { setupSocket, activeSockets } = require("./socket");

let existingText = "";
let editingUser = "";
const users = new Set();

function setupQuillSocket(server) {
  const quillNamespace = "quill";
  const quillEventHandlers = (socket, io) => {
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
      console.log(`${quillNamespace} - user disconnected`);
      users.delete(socket.id);
      if (editingUser === socket.id) {
        editingUser = "";
        io.emit("editing", "");
      }
      io.emit("users", Array.from(users));
    });
  };

  setupSocket(server, quillNamespace, quillEventHandlers);
}

module.exports = { setupQuillSocket };
