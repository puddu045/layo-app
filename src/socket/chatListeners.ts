import { getSocket } from "./socket";
import { useChatStore } from "../store/chat.store";

let registered = false;

export function registerChatListeners() {
  if (registered) return;
  registered = true;

  const socket = getSocket();
  if (!socket) return;

  socket.on("new_message", (message: any) => {
    console.log("🔔 new_message (global)", message);

    useChatStore.getState().applyIncomingMessage(message);
  });
}
