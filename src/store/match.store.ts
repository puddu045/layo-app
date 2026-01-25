import { create } from "zustand";

/* ---------- Core Types ---------- */

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  profile: { profilePhotoUrl?: string | null };
};

export type Journey = {
  id: string;
  userId: string;
  journeyType: "DIRECT" | "LAYOVER";
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
};

export type JourneyLeg = {
  id: string;
  journeyId: string;
  sequence: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  layoverMinutes: number | null;
};

/* ---------- Match Result Types ---------- */

export type SameFlightMatch = {
  myJourneyLeg: {
    id: string;
    journeyId: string;
    sequence: number;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    layoverMinutes: number | null;
    createdAt: string;
  };

  otherJourneyLeg: {
    id: string;
    journeyId: string;
    sequence: number;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    layoverMinutes: number | null;
    createdAt: string;
  };

  otherUser: User;
};

export type LayoverMatch = {
  matchId?: string;
  user: User;
  arrivalAirport: string;
  overlapMinutes: number;
  leg: JourneyLeg & {
    journey: Journey;
  };
};

/* ---------- API Response Shapes ---------- */

export type MatchDiscoveryResponse = {
  sameFlightMatches: SameFlightMatch[];
  layoverMatches: LayoverMatch[];
};

/* ---------- Store ---------- */

type MatchStore = {
  /* discovery */
  sameFlightMatches: SameFlightMatch[];
  layoverMatches: LayoverMatch[];

  /* incoming requests */

  loading: boolean;

  /* setters */
  setMatches: (data: MatchDiscoveryResponse) => void;
  setLoading: (loading: boolean) => void;

  /* mutations */
  removeDiscoveryUser: (userId: string) => void;

  reset: () => void;
};

export const useMatchStore = create<MatchStore>((set) => ({
  /* state */
  sameFlightMatches: [],
  layoverMatches: [],
  pendingRequests: [],
  loading: false,

  /* setters */
  setMatches: (data) =>
    set({
      sameFlightMatches: data.sameFlightMatches,
      layoverMatches: data.layoverMatches,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  /* mutations */

  removeDiscoveryUser: (userId) =>
    set((state) => ({
      sameFlightMatches: state.sameFlightMatches.filter(
        (m) => m.otherUser.id !== userId,
      ),
      layoverMatches: state.layoverMatches.filter((m) => m.user.id !== userId),
    })),

  /* reset */
  reset: () =>
    set({
      sameFlightMatches: [],
      layoverMatches: [],
      loading: false,
    }),
}));
