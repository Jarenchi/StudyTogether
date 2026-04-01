const { Server } = require("socket.io");
const Y = require("yjs");
const Doc = require("./models/docModel");

const ydocs = new Map(); // docId → { ydoc: Y.Doc, saveTimer: NodeJS.Timeout | null }

function getOrCreateRoom(docId) {
  if (!ydocs.has(docId)) {
    ydocs.set(docId, { ydoc: new Y.Doc(), saveTimer: null });
  }
  return ydocs.get(docId);
}

function scheduleSave(docId, ytext) {
  const room = ydocs.get(docId);
  if (!room) return;
  if (room.saveTimer) clearTimeout(room.saveTimer);
  room.saveTimer = setTimeout(async () => {
    const html = ytext.toString();
    await Doc.findByIdAndUpdate(docId, { content: html });
    room.saveTimer = null;
  }, 500);
}

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

    // Client joins a document room and requests current state
    socket.on("y-sync-request", async (docId) => {
      socket.join(docId);
      const room = getOrCreateRoom(docId);
      const { ydoc } = room;
      const ytext = ydoc.getText("quill");

      // If this is the first user, load content from DB
      if (ytext.toString() === "") {
        try {
          const doc = await Doc.findById(docId).select("content");
          if (doc && doc.content) {
            // Send the raw HTML to client so it can initialize Quill
            socket.emit("y-init-content", doc.content);
            return; // client will send back a y-update after initializing
          }
        } catch (err) {
          console.error("Failed to load doc from DB:", err);
        }
      }

      // Send current Yjs state to the newly connected client
      const state = Y.encodeStateAsUpdate(ydoc);
      socket.emit("y-sync", Array.from(state));
    });

    // Relay Yjs update to all other clients; apply to server ydoc; schedule DB save
    socket.on("y-update", (update, docId) => {
      const room = ydocs.get(docId);
      if (!room) return;
      const { ydoc } = room;
      const updateBytes = new Uint8Array(update);
      Y.applyUpdate(ydoc, updateBytes);
      socket.to(docId).emit("y-update", update);
      scheduleSave(docId, ydoc.getText("quill"));
    });

    // Online users list (kept from existing implementation)
    socket.on("connectUser", (userName, docId) => {
      if (!socket.rooms.has(docId)) socket.join(docId);
      socket.data.userName = userName;
      socket.data.docId = docId;
      const usersInRoom = getUsersInRoom(io, docId);
      io.to(docId).emit("users", usersInRoom);
    });

    socket.on("disconnectUser", (userName, docId) => {
      const usersInRoom = getUsersInRoom(io, docId).filter((u) => u !== userName);
      io.to(docId).emit("users", usersInRoom);
    });

    socket.on("disconnect", () => {
      const { userName, docId } = socket.data;
      if (userName && docId) {
        const usersInRoom = getUsersInRoom(io, docId).filter((u) => u !== userName);
        io.to(docId).emit("users", usersInRoom);
      }
    });
  });
}

function getUsersInRoom(io, room) {
  const sockets = io.sockets.adapter.rooms.get(room);
  if (!sockets) return [];
  return Array.from(sockets)
    .map((id) => io.sockets.sockets.get(id)?.data?.userName)
    .filter(Boolean);
}

module.exports = { setupQuillSocket };
