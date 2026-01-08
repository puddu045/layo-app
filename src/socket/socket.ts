import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function connectSocket(token: string) {
  if (socket) return socket;

  socket = io("http://192.168.1.202:3000", {
    transports: ["websocket"],
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log("socket connected", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconnected", reason);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
