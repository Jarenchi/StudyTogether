const { Server } = require("socket.io");

const rooms = {};

function setupQuillSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    secure: true,
    path: "/quill",
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("connectUser", (userName, room) => {
      socket.join(room);
      if (!rooms[room]) {
        rooms[room] = { existingText: "", editingUsers: [], users: new Set() };
      }
      rooms[room].users.add(userName);
      console.log(`${userName} has connected to room ${room}`);
      io.to(room).emit("users", Array.from(rooms[room].users));
    });

    socket.on("text", (newText, room) => {
      rooms[room].existingText = newText;
      io.to(room).emit("text", newText);
    });

    socket.on("editing", (userId, room) => {
      console.log(`Editing event received in room ${room}. User: ${userId}`);
      if (!rooms[room].editingUsers.includes(userId)) {
        rooms[room].editingUsers.push(userId);
      }
      io.to(room).emit("editing", rooms[room].editingUsers);
    });

    socket.on("stopEditing", (userId, room) => {
      console.log(`Stop Editing event received in room ${room}. User: ${userId}`);
      console.log(rooms[room]);
      if (rooms[room].editingUsers.includes(userId)) {
        rooms[room].editingUsers = rooms[room].editingUsers.filter((user) => user !== userId);
      }
      io.to(room).emit("editing", rooms[room].editingUsers);
    });

    socket.on("disconnectUser", (userName, room) => {
      console.log(`${userName} has disconnected from room ${room}`);
      rooms[room].users.delete(userName);
      if (rooms[room].editingUsers.includes(userName)) {
        rooms[room].editingUsers = rooms[room].editingUsers.filter((user) => user !== userName);
        io.to(room).emit("editing", rooms[room].editingUsers);
      }
      io.to(room).emit("users", Array.from(rooms[room].users));
    });
  });
}

module.exports = { setupQuillSocket };
