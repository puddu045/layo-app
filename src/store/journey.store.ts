import { create } from "zustand";

type Journey = {
  id: string;
  name: string;
};

type JourneyState = {
  journeys: Journey[];
  activeJourney: Journey | null;
  setJourneys: (j: Journey[]) => void;
  setActiveJourney: (j: Journey) => void;
  clearActiveJourney: () => void;
};

export const useJourneyStore = create<JourneyState>((set) => ({
  journeys: [],
  activeJourney: null,

  setJourneys: (journeys) => set({ journeys }),
  setActiveJourney: (journey) => set({ activeJourney: journey }),
  clearActiveJourney: () => set({ activeJourney: null }),
}));
