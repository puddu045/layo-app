import api from "./client";

export const fetchChatsByJourneyLeg = async (journeyLegId: string) => {
  const res = await api.get(`/chats/by-leg/${journeyLegId}`, {
    params: { journeyLegId },
  });

  return res.data;
};
