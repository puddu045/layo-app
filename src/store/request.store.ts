// export type RequestSummary = {
//   id: string;

//   senderJourneyId: string;
//   receiverJourneyId: string;

//   senderId: string;
//   receiverId: string;

//   flightNumber: string;
//   departureTime: string;

//   status: "PENDING" | "ACCEPTED" | "REJECTED";

//   createdAt: string;
//   updatedAt: string;

//   sender: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };

//   receiver?: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   };

//   senderJourney: {
//     id: string;
//     userId: string;
//     journeyType: "DIRECT" | "LAYOVER";
//     flightNumber: string;
//     departureAirport: string;
//     arrivalAirport: string;
//     departureTime: string;
//     arrivalTime: string;
//     createdAt: string;
//     updatedAt: string;
//   };

//   receiverJourney: {
//     id: string;
//     userId: string;
//     journeyType: "DIRECT" | "LAYOVER";
//     flightNumber: string;
//     departureAirport: string;
//     arrivalAirport: string;
//     departureTime: string;
//     arrivalTime: string;
//     createdAt: string;
//     updatedAt: string;
//   };
// };

// type RequestState = {
//   requestsByJourneyId: {
//     [journeyId: string]: {
//       data: RequestSummary[];
//       loading: boolean;
//       error?: string;
//     };
//   };

//   setRequestsForJourney: (
//     journeyId: string,
//     requests: RequestSummary[],
//   ) => void;

//   setLoadingForJourney: (journeyId: string, loading: boolean) => void;

//   clearRequestsForJourney: (journeyId: string) => void;

//   clearAllRequests: () => void;
// };

// import { create } from "zustand";

// export const useRequestStore = create<RequestState>((set) => ({
//   requestsByJourneyId: {},

//   setRequestsForJourney: (journeyId, requests) =>
//     set((state) => ({
//       requestsByJourneyId: {
//         ...state.requestsByJourneyId,
//         [journeyId]: {
//           data: requests,
//           loading: false,
//           error: undefined,
//         },
//       },
//     })),

//   setLoadingForJourney: (journeyId, loading) =>
//     set((state) => ({
//       requestsByJourneyId: {
//         ...state.requestsByJourneyId,
//         [journeyId]: {
//           data: state.requestsByJourneyId[journeyId]?.data ?? [],
//           loading,
//           error: state.requestsByJourneyId[journeyId]?.error,
//         },
//       },
//     })),

//   clearRequestsForJourney: (journeyId) =>
//     set((state) => {
//       const copy = { ...state.requestsByJourneyId };
//       delete copy[journeyId];
//       return { requestsByJourneyId: copy };
//     }),

//   clearAllRequests: () =>
//     set({
//       requestsByJourneyId: {},
//     }),
// }));

import { create } from "zustand";

/* ---------- Types ---------- */

export type UserSummary = {
  id: string;
  firstName: string;
  lastName: string;
  profile: {
    profilePhotoUrl?: string | null;
    updatedAt: string;
  };
};

export type JourneyLegSummary = {
  id: string;
  sequence: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  layoverMinutes?: number | null;
};

export type JourneySummary = {
  id: string;
  userId: string;
  journeyType: "DIRECT" | "LAYOVER";
  legs: JourneyLegSummary[];
  createdAt: string;
  updatedAt: string;
};

export type RequestSummary = {
  id: string;

  senderJourneyId: string;
  receiverJourneyId: string;

  senderId: string;
  receiverId: string;

  status: "PENDING" | "ACCEPTED" | "REJECTED";

  createdAt: string;
  updatedAt: string;

  sender: UserSummary;
  receiver: UserSummary;

  senderJourney: JourneySummary;
  receiverJourney: JourneySummary;
};

type RequestState = {
  requestsByJourneyId: {
    [journeyId: string]: {
      data: RequestSummary[];
      loading: boolean;
      error?: string;
    };
  };

  setRequestsForJourney: (
    journeyId: string,
    requests: RequestSummary[],
  ) => void;

  setLoadingForJourney: (journeyId: string, loading: boolean) => void;

  clearRequestsForJourney: (journeyId: string) => void;

  clearAllRequests: () => void;
};

/* ---------- Store ---------- */

export const useRequestStore = create<RequestState>((set) => ({
  requestsByJourneyId: {},

  setRequestsForJourney: (journeyId, requests) =>
    set((state) => ({
      requestsByJourneyId: {
        ...state.requestsByJourneyId,
        [journeyId]: {
          data: requests,
          loading: false,
          error: undefined,
        },
      },
    })),

  setLoadingForJourney: (journeyId, loading) =>
    set((state) => ({
      requestsByJourneyId: {
        ...state.requestsByJourneyId,
        [journeyId]: {
          data: state.requestsByJourneyId[journeyId]?.data ?? [],
          loading,
          error: state.requestsByJourneyId[journeyId]?.error,
        },
      },
    })),

  clearRequestsForJourney: (journeyId) =>
    set((state) => {
      const copy = { ...state.requestsByJourneyId };
      delete copy[journeyId];
      return { requestsByJourneyId: copy };
    }),

  clearAllRequests: () =>
    set({
      requestsByJourneyId: {},
    }),
}));
