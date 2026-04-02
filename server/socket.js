const { Server } = require("socket.io");
const Y = require("yjs");
const mongoose = require("mongoose");
const Doc = require("./models/docModel");

const ydocs = new Map(); // docId → { ydoc, saveTimer, cleanupTimer, loaded }

function getOrCreateRoom(docId) {
  if (!ydocs.has(docId)) {
    ydocs.set(docId, { ydoc: new Y.Doc(), saveTimer: null, cleanupTimer: null, loaded: false });
  } else {
    // Cancel pending cleanup — a user is joining, keep the room alive
    const room = ydocs.get(docId);
    if (room.cleanupTimer) {
      clearTimeout(room.cleanupTimer);
      room.cleanupTimer = null;
    }
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

// Returns unique users in a room (deduplicated by name).
function getUsersInRoom(io, room, excludeSocketId = null) {
  const sockets = io.sockets.adapter.rooms.get(room);
  if (!sockets) return [];
  const seen = new Set();
  return Array.from(sockets)
    .filter((id) => id !== excludeSocketId)
    .map((id) => io.sockets.sockets.get(id)?.data?.user)
    .filter(Boolean)
    .filter((user) => {
      if (seen.has(user.name)) return false;
      seen.add(user.name);
      return true;
    });
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

    // Fired by client cleanup when navigating away — socket is still connected at this point.
    // Exclude this socket.id so we can see if the user has other active sockets.
    socket.on("disconnectUser", (user, docId) => {
      const usersInRoom = getUsersInRoom(io, docId, socket.id);
      io.to(docId).emit("users", usersInRoom);
    });

    socket.on("disconnect", () => {
      const { user, docId } = socket.data;
      if (user && docId) {
        // Socket is already removed from rooms at this point, so getUsersInRoom
        // naturally excludes it — no extra filtering needed.
        const usersInRoom = getUsersInRoom(io, docId);
        io.to(docId).emit("users", usersInRoom);

        if (usersInRoom.length === 0) {
          const room = ydocs.get(docId);
          if (room) {
            // Cancel debounced save and persist immediately
            if (room.saveTimer) {
              clearTimeout(room.saveTimer);
              room.saveTimer = null;
            }
            const stateBytes = Buffer.from(Y.encodeStateAsUpdate(room.ydoc));
            Doc.findByIdAndUpdate(docId, { yjsState: stateBytes })
              .catch((err) => console.error(`[socket] Final save failed for ${docId}:`, err));

            // Delay in-memory cleanup so a rapid reconnect (e.g. page refresh) reuses
            // the already-loaded state instead of racing against the async DB save.
            room.cleanupTimer = setTimeout(() => {
              const r = ydocs.get(docId);
              if (r) {
                r.ydoc.destroy();
                ydocs.delete(docId);
              }
            }, 30000); // 30 seconds
          }
        }
      }
    });
  });
}

module.exports = { setupQuillSocket };
