/* eslint-disable no-undef */
import { io } from "socket.io-client";

let socket = null;

export function initSocket(apiUrl, token, userId, role) {
  if (socket) return socket;
  socket = io(
    apiUrl || process.env.REACT_APP_API_URL || "http://localhost:5000",
    {
      auth: { token },
    }
  );
  socket.on("connect", () => {
    socket.emit("join", { userId, role });
  });
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
