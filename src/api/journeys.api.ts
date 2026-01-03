import api from "./client";

export const getJourneysForUser = async () => {
  const res = await api.get("/journeys", {});
  return res.data;
};
