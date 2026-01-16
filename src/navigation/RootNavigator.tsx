import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "../store/auth.store";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import axios from "axios";
import api from "../api/client";
import { URL_Backend } from "../utils/backendURL";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerForPushNotifications } from "../utils/pushNotifications";

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const res = await axios.post(
          `${URL_Backend}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const meRes = await api.get("/users/user", {
          headers: {
            Authorization: `Bearer ${res.data.accessToken}`,
          },
        });
        setAuth(res.data.accessToken, meRes.data);
      } catch {
        clearAuth();
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      try {
        await registerForPushNotifications();
      } catch (e) {
        console.log("Push registration failed", e);
      }
    })();
  }, [isAuthenticated]);

  if (!isBootstrapped) {
    return null; // or a Splash screen
  }

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
