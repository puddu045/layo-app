import { create } from "zustand";

export type JourneyLeg = {
  id: string;
  sequence: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  layoverMinutes: number | null;
};

type Journey = {
  id: string;
  journeyType: "DIRECT" | "LAYOVER";
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  legs: JourneyLeg[];
};

type JourneyState = {
  journeys: Journey[];
  activeJourney: Journey | null;
  loading: boolean;

  setJourneys: (j: Journey[]) => void;
  setActiveJourney: (j: Journey) => void;
  clearActiveJourney: () => void;
  setLoading: (v: boolean) => void;
};

export const useJourneyStore = create<JourneyState>((set) => ({
  journeys: [],
  activeJourney: null,
  loading: false,

  setJourneys: (journeys) => set({ journeys, loading: false }),
  setActiveJourney: (journey) => set({ activeJourney: journey }),
  clearActiveJourney: () => set({ activeJourney: null }),
  setLoading: (loading) => set({ loading }),
}));
