import { create } from "zustand";

type ChatSummary = {
  id: string;
  matchId: string;
  createdAt: string;
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

  unreadCount: number;
};

type ChatState = {
  chats: ChatSummary[];
  loading: boolean;
  setChats: (c: ChatSummary[]) => void;
  setLoading: (v: boolean) => void;
  clearChats: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  loading: false,

  setChats: (chats) => set({ chats }),
  setLoading: (loading) => set({ loading }),
  clearChats: () => set({ chats: [] }),
}));
