import api from "./client";

export const fetchChatsByJourney = async (journeyId: string) => {
  const res = await api.get(`/chats/journey/${journeyId}`, {
    params: { journeyId },
  });
  return res.data;
};
