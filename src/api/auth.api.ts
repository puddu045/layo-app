import api from "./client";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string; // YYYY-MM-DD
};

export const registerApi = async (payload: RegisterPayload) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};
