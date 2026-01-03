import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "../store/auth.store";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import axios from "axios";

export default function RootNavigator() {
  const { isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const res = await axios.post(
          "http://192.168.1.202:3000/auth/refresh",
          {},
          { withCredentials: true }
        );
        setAuth(res.data.accessToken, res.data.user);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
