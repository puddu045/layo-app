import api from "./client";

export const fetchMatchesByJourneyLeg = async (journeyLegId: string) => {
  const res = await api.get(`/matches/potential/${journeyLegId}`, {
    params: { journeyLegId },
  });
  return res.data;
};

export const fetchPendingRequestsByJourneyLeg = async (
  journeyLegId: string
) => {
  const res = await api.get(`/matches/pending/${journeyLegId}`, {
    params: { journeyLegId },
  });
  return res.data;
};

export const sendMatchRequest = async ({
  senderJourneyLegId,
  receiverId,
  receiverJourneyLegId,
}: {
  senderJourneyLegId: string;
  receiverId: string;
  receiverJourneyLegId: string;
}) => {
  const res = await api.post("/matches", {
    senderJourneyLegId,
    receiverId,
    receiverJourneyLegId,
  });

  return res.data;
};

export const dismissPotentialMatch = async ({
  senderJourneyLegId,
  receiverId,
  receiverJourneyLegId,
}: {
  senderJourneyLegId: string;
  receiverId: string;
  receiverJourneyLegId: string;
}) => {
  const res = await api.post("/matches/dismiss", {
    senderJourneyLegId,
    receiverId,
    receiverJourneyLegId,
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
