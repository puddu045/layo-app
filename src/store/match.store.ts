import { create } from "zustand";

type MatchSummary = {
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
  journey: {
    id: string;
    userId: string;
    journeyType: "LAYOVER" | "DIRECT";
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
};

type MatchState = {
  matchesByLegId: {
    [journeyLegId: string]: {
      data: MatchSummary[];
      loading: boolean;
      error?: string;
    };
  };

  setMatchesForLeg: (journeyLegId: string, matches: MatchSummary[]) => void;

  setLoadingForLeg: (journeyLegId: string, loading: boolean) => void;

  clearMatchesForLeg: (journeyLegId: string) => void;

  clearAllMatches: () => void;
};

export const useMatchStore = create<MatchState>((set) => ({
  matchesByLegId: {},

  setMatchesForLeg: (journeyLegId, matches) =>
    set((state) => ({
      matchesByLegId: {
        ...state.matchesByLegId,
        [journeyLegId]: {
          data: matches,
          loading: false,
        },
      },
    })),

  setLoadingForLeg: (journeyLegId, loading) =>
    set((state) => ({
      matchesByLegId: {
        ...state.matchesByLegId,
        [journeyLegId]: {
          data: state.matchesByLegId[journeyLegId]?.data ?? [],
          loading,
        },
      },
    })),

  clearMatchesForLeg: (journeyLegId) =>
    set((state) => {
      const copy = { ...state.matchesByLegId };
      delete copy[journeyLegId];
      return { matchesByLegId: copy };
    }),

  clearAllMatches: () =>
    set({
      matchesByLegId: {},
    }),
}));
