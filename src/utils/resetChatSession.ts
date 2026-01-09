import { disconnectSocket } from "../socket/socket";
import { useChatStore } from "../store/chat.store";

export function resetChatSession() {
  disconnectSocket();
  useChatStore.getState().clearAllChats();
}
