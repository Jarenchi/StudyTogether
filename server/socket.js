const { Server } = require("socket.io");
const Y = require("yjs");
const mongoose = require("mongoose");
const Doc = require("./models/docModel");

const ydocs = new Map(); // docId → { ydoc, saveTimer, loaded }

function getOrCreateRoom(docId) {
  if (!ydocs.has(docId)) {
    ydocs.set(docId, { ydoc: new Y.Doc(), saveTimer: null, loaded: false });
  }
  return ydocs.get(docId);
}

function scheduleSave(docId, ydoc) {
  const room = ydocs.get(docId);
  if (!room) return;
  if (room.saveTimer) clearTimeout(room.saveTimer);
  room.saveTimer = setTimeout(() => {
    const stateBytes = Buffer.from(Y.encodeStateAsUpdate(ydoc));
    Doc.findByIdAndUpdate(docId, { yjsState: stateBytes })
      .catch((err) => console.error(`[socket] DB save failed for ${docId}:`, err));
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

    socket.on("y-sync-request", async (docId) => {
      if (!mongoose.isValidObjectId(docId)) {
        console.warn(`[socket] Invalid docId from ${socket.id}: ${docId}`);
        return;
      }
      socket.join(docId);
      const room = getOrCreateRoom(docId);
      const { ydoc } = room;

      if (!room.loaded) {
        room.loaded = true;
        try {
          const doc = await Doc.findById(docId).select("content yjsState");
          if (doc) {
            if (doc.yjsState) {
              Y.applyUpdate(ydoc, new Uint8Array(doc.yjsState));
            } else if (doc.content) {
              socket.emit("y-init-content", doc.content);
              return;
            }
          }
        } catch (err) {
          console.error(`[socket] Failed to load doc ${docId}:`, err);
          room.loaded = false; // allow retry on next connection
        }
      }

      const state = Y.encodeStateAsUpdate(ydoc);
      socket.emit("y-sync", Array.from(state));
    });

    socket.on("y-update", (update, docId) => {
      if (!mongoose.isValidObjectId(docId)) return;
      const room = ydocs.get(docId);
      if (!room) return;
      const { ydoc } = room;
      const updateBytes = new Uint8Array(update);
      try {
        Y.applyUpdate(ydoc, updateBytes);
      } catch (err) {
        console.error(`[socket] Invalid y-update from ${socket.id} for doc ${docId}:`, err);
        return;
      }
      socket.to(docId).emit("y-update", update);
      scheduleSave(docId, ydoc);
    });

    socket.on("connectUser", (user, docId) => {
      // Support both legacy string format and new { name, picture } object
      const userObj = typeof user === "string" ? { name: user, picture: "" } : user;
      if (!socket.rooms.has(docId)) socket.join(docId);
      socket.data.user = userObj;
      socket.data.docId = docId;
      const usersInRoom = getUsersInRoom(io, docId);
      io.to(docId).emit("users", usersInRoom);
    });

    socket.on("disconnectUser", (user, docId) => {
      const name = typeof user === "string" ? user : user?.name;
      const usersInRoom = getUsersInRoom(io, docId).filter((u) => u.name !== name);
      io.to(docId).emit("users", usersInRoom);
    });

    socket.on("disconnect", () => {
      const { user, docId } = socket.data;
      if (user && docId) {
        const usersInRoom = getUsersInRoom(io, docId).filter((u) => u.name !== user.name);
        io.to(docId).emit("users", usersInRoom);

        if (usersInRoom.length === 0) {
          const room = ydocs.get(docId);
          if (room) {
            if (room.saveTimer) {
              clearTimeout(room.saveTimer);
              room.saveTimer = null;
            }
            const stateBytes = Buffer.from(Y.encodeStateAsUpdate(room.ydoc));
            Doc.findByIdAndUpdate(docId, { yjsState: stateBytes })
              .catch((err) => console.error(`[socket] Final save failed for ${docId}:`, err));
            room.ydoc.destroy();
            ydocs.delete(docId);
          }
        }
      }
    });
  });
}

function getUsersInRoom(io, room) {
  const sockets = io.sockets.adapter.rooms.get(room);
  if (!sockets) return [];
  return Array.from(sockets)
    .map((id) => io.sockets.sockets.get(id)?.data?.user)
    .filter(Boolean);
}

module.exports = { setupQuillSocket };
