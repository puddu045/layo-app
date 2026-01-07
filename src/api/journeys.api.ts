import api from "./client";

export const getJourneysForUser = async () => {
  const res = await api.get("/journeys", {});
  return res.data;
};

export const createJourney = async (payload: any) => {
  const res = await api.post("/journeys", payload);
  return res.data;
};
