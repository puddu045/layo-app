import { create } from "zustand";

/* ---------- Types ---------- */

export type ChatSummary = {
  id: string;
  matchId: string;
  createdAt: string;
  unreadCount: number;

  match: {
    id: string;

    senderJourneyId: string;
    receiverJourneyId: string;

    senderId: string;
    receiverId: string;

    flightNumber: string;
    departureTime: string;

    status: string;
    createdAt: string;
    updatedAt: string;

    sender: {
      id: string;
      firstName: string;
      lastName: string;
    };

    receiver: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

type ChatState = {
  // 🔑 Chats scoped per journey
  chatsByJourneyId: Record<string, ChatSummary[]>;

  // 🔄 Loading scoped per journey
  loadingByJourneyId: Record<string, boolean>;

  // ✅ Actions
  setChatsForJourney: (journeyId: string, chats: ChatSummary[]) => void;
  setLoadingForJourney: (journeyId: string, loading: boolean) => void;
  clearChatsForJourney: (journeyId: string) => void;
  applyIncomingMessage: (message: any) => void;
  markChatAsReadInStore: (chatId: string) => void;

  clearAllChats: () => void;
};

/* ---------- Store ---------- */

export const useChatStore = create<ChatState>((set) => ({
  chatsByJourneyId: {},
  loadingByJourneyId: {},

  setChatsForJourney: (journeyId, chats) =>
    set((state) => ({
      chatsByJourneyId: {
        ...state.chatsByJourneyId,
        [journeyId]: chats,
      },
    })),

  setLoadingForJourney: (journeyId, loading) =>
    set((state) => ({
      loadingByJourneyId: {
        ...state.loadingByJourneyId,
        [journeyId]: loading,
      },
    })),

  clearChatsForJourney: (journeyId) =>
    set((state) => {
      const next = { ...state.chatsByJourneyId };
      delete next[journeyId];
      return { chatsByJourneyId: next };
    }),
  applyIncomingMessage: (message) =>
    set((state) => {
      const { chatId, senderId } = message;

      const updated: typeof state.chatsByJourneyId = {};

      for (const journeyId in state.chatsByJourneyId) {
        const chats = state.chatsByJourneyId[journeyId];
        const index = chats.findIndex((c) => c.id === chatId);

        if (index === -1) {
          updated[journeyId] = chats;
          continue;
        }

        const chat = chats[index];

        const updatedChat = {
          ...chat,
          unreadCount:
            senderId === chat.match.sender.id ||
            senderId === chat.match.receiver.id
              ? chat.unreadCount + 1
              : chat.unreadCount,
          updatedAt: message.createdAt,
          lastMessage: message.content, // if you have this field
        };

        const nextChats = [updatedChat, ...chats.filter((_, i) => i !== index)];

        updated[journeyId] = nextChats;
      }

      return { chatsByJourneyId: updated };
    }),

  markChatAsReadInStore: (chatId) =>
    set((state) => {
      const updated: typeof state.chatsByJourneyId = {};

      for (const journeyId in state.chatsByJourneyId) {
        const chats = state.chatsByJourneyId[journeyId];

        const nextChats = chats.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
        );

        updated[journeyId] = nextChats;
      }

      return { chatsByJourneyId: updated };
    }),

  clearAllChats: () =>
    set({
      chatsByJourneyId: {},
      loadingByJourneyId: {},
    }),
}));
