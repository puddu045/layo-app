import { create } from "zustand";

export type RequestSummary = {
  id: string;

  senderJourneyLegId: string;
  receiverJourneyLegId: string;

  senderId: string;
  receiverId: string;

  flightNumber: string;
  departureTime: string;

  status: "PENDING" | "ACCEPTED" | "REJECTED";

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

  senderJourneyLeg: {
    id: string;
    journeyId: string;
    sequence: number;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    layoverMinutes?: number;
    createdAt: string;
  };

  receiverJourneyLeg: {
    id: string;
    journeyId: string;
    sequence: number;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    layoverMinutes?: number;
    createdAt: string;
  };
};

type RequestState = {
  requestsByLegId: {
    [journeyLegId: string]: {
      data: RequestSummary[];
      loading: boolean;
      error?: string;
    };
  };

  setRequestsForLeg: (journeyLegId: string, requests: RequestSummary[]) => void;

  setLoadingForLeg: (journeyLegId: string, loading: boolean) => void;

  clearRequestsForLeg: (journeyLegId: string) => void;

  clearAllRequests: () => void;
};

export const useRequestStore = create<RequestState>((set) => ({
  requestsByLegId: {},

  setRequestsForLeg: (journeyLegId, requests) =>
    set((state) => ({
      requestsByLegId: {
        ...state.requestsByLegId,
        [journeyLegId]: {
          data: requests,
          loading: false,
          error: undefined,
        },
      },
    })),

  setLoadingForLeg: (journeyLegId, loading) =>
    set((state) => ({
      requestsByLegId: {
        ...state.requestsByLegId,
        [journeyLegId]: {
          data: state.requestsByLegId[journeyLegId]?.data ?? [],
          loading,
          error: state.requestsByLegId[journeyLegId]?.error,
        },
      },
    })),

  clearRequestsForLeg: (journeyLegId) =>
    set((state) => {
      const copy = { ...state.requestsByLegId };
      delete copy[journeyLegId];
      return { requestsByLegId: copy };
    }),

  clearAllRequests: () =>
    set({
      requestsByLegId: {},
    }),
}));
