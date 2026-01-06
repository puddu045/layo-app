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
