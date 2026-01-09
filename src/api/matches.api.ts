import api from "./client";

export const fetchMatchesByJourneyLeg = async (journeyLegId: string) => {
  const res = await api.get(`/matches/potential/${journeyLegId}`, {
    params: { journeyLegId },
  });
  return res.data;
};
export const fetchMatchesByJourney = async (journeyId: string) => {
  const res = await api.get(`/matches/journey/${journeyId}`, {
    params: { journeyId },
  });
  return res.data;
};

export const fetchPendingRequestsByJourney = async (journeyId: string) => {
  const res = await api.get(`/matches/pending/${journeyId}`, {
    params: { journeyId },
  });
  return res.data;
};

export const sendMatchRequest = async ({
  senderJourneyId,
  receiverId,
  receiverJourneyId,
}: {
  senderJourneyId: string;
  receiverId: string;
  receiverJourneyId: string;
}) => {
  const res = await api.post("/matches", {
    senderJourneyId,
    receiverId,
    receiverJourneyId,
  });

  return res.data;
};

export const dismissPotentialMatch = async ({
  senderJourneyId,
  receiverId,
  receiverJourneyId,
}: {
  senderJourneyId: string;
  receiverId: string;
  receiverJourneyId: string;
}) => {
  const res = await api.post("/matches/dismiss", {
    senderJourneyId,
    receiverId,
    receiverJourneyId,
  });

  return res.data;
};

export const acceptMatch = async (matchId: string) => {
  const res = await api.post(`/matches/${matchId}/accept`);
  return res.data;
};

export const rejectMatch = async (matchId: string) => {
  const res = await api.post(`/matches/${matchId}/reject`);
  return res.data;
};
