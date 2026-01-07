import { create } from "zustand";

export type ChatSummary = {
  id: string;
  matchId: string;
  createdAt: string;
  unreadCount: number;

  match: {
    id: string;
    journeyLegId: string;
    senderId: string;
    receiverId: string;
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
  // 🔑 Chats scoped per journey leg
  chatsByJourneyLegId: Record<string, ChatSummary[]>;

  // 🔄 Loading scoped per journey leg
  loadingByJourneyLegId: Record<string, boolean>;

  // ✅ Actions
  setChatsForLeg: (journeyLegId: string, chats: ChatSummary[]) => void;
  setLoadingForLeg: (journeyLegId: string, loading: boolean) => void;
  clearChatsForLeg: (journeyLegId: string) => void;
  clearAllChats: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chatsByJourneyLegId: {},
  loadingByJourneyLegId: {},

  setChatsForLeg: (journeyLegId, chats) =>
    set((state) => ({
      chatsByJourneyLegId: {
        ...state.chatsByJourneyLegId,
        [journeyLegId]: chats,
      },
    })),

  setLoadingForLeg: (journeyLegId, loading) =>
    set((state) => ({
      loadingByJourneyLegId: {
        ...state.loadingByJourneyLegId,
        [journeyLegId]: loading,
      },
    })),

  clearChatsForLeg: (journeyLegId) =>
    set((state) => {
      const next = { ...state.chatsByJourneyLegId };
      delete next[journeyLegId];
      return { chatsByJourneyLegId: next };
    }),

  clearAllChats: () =>
    set({
      chatsByJourneyLegId: {},
      loadingByJourneyLegId: {},
    }),
}));
