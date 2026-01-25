import { getSocket } from "./socket";
import { useChatStore } from "../store/chat.store";

console.log("🧩 registerChatListeners called");
console.log("🟢 chat store used by socket");

export function registerChatListeners() {
  const socket = getSocket();
  if (!socket) return;

  console.log("🧷 registering new_message listener");

  socket.off("new_message");

  socket.on("new_message", (message) => {
    console.log("🔔 new_message (socket)", message);
    useChatStore.getState().applyIncomingMessage(message);
  });
}
