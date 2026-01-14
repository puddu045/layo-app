import { logoutApi } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { resetChatSession } from "./resetChatSession";

export async function logout() {
  resetChatSession();
  useAuthStore.getState().clearAuth();
  await logoutApi();
}
