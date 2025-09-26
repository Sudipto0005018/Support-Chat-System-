const { Server } = require("socket.io");

let ioInstance;
function initSocket(server) {
  ioInstance = new Server(server, {
    cors: { origin: "*" },
  });

  ioInstance.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("join", ({ userId, role }) => {
      if (role === "admin") socket.join("admins");
      else socket.join(`user:${userId}`);
    });

    socket.on("user_message", (payload) => {
      ioInstance
        .to(`user:${payload.userId}`)
        .emit("user_message_echo", payload);
    });

    socket.on("disconnect", () =>
      console.log("Socket disconnected", socket.id)
    );
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) throw new Error("Socket not initialized");
  return ioInstance;
}

module.exports = { initSocket, getIO };
