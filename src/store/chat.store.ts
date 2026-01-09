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

  clearAllChats: () =>
    set({
      chatsByJourneyId: {},
      loadingByJourneyId: {},
    }),
}));
