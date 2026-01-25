import { getSocket } from "./socket";
import { useChatStore } from "../store/chat.store";

export function registerChatListeners() {
  const socket = getSocket();
  if (!socket) return;

  socket.off("new_message");

  socket.on("new_message", (message) => {
    useChatStore.getState().applyIncomingMessage(message);
  });
}
