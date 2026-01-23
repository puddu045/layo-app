import { io, Socket } from "socket.io-client";
import { URL_Backend } from "../utils/backendURL";
import { registerChatListeners } from "./chatListeners";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  // Always reset socket on new login
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(`${URL_Backend}/chat`, {
    transports: ["websocket"],
    auth: {
      token,
    },
  });
  registerChatListeners();
  socket.on("connect", () => {});

  socket.on("disconnect", (reason) => {});

  socket.on("connect_error", (err) => {});

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
