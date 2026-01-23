import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import { useAuthStore } from "../store/auth.store";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import axios from "axios";
import api from "../api/client";
import { URL_Backend } from "../utils/backendURL";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  registerForPushNotifications,
  savePushTokenToBackend,
} from "../utils/pushNotifications";
import * as Notifications from "expo-notifications";
import { NotificationData } from "../notifications/types";
import { flushPendingNavigation, navigateWhenReady } from "./navigationService";

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
      let token: string | null = null;

      try {
        token = await registerForPushNotifications();
      } catch (e) {
        console.log("❌ Push token registration failed", e);
        return;
      }

      if (!token) return;

      try {
        console.log("📤 Saving push token:", token);
        await savePushTokenToBackend(token);
      } catch (e) {
        console.log("❌ Saving push token failed", e);
      }
    })();
  }, [isAuthenticated]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {},
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as Partial<NotificationData>;

        if (data?.type === "NEW_MESSAGE" && typeof data.chatId === "string") {
          console.log("navigation reached");
          navigateWhenReady("JourneyTabs", {
            screen: "ChatStack",
            params: {
              screen: "Chat",
              params: {
                chatId: data.chatId,
                name: data.senderName,
              },
            },
          });
        }
      },
    );

    return () => sub.remove();
  }, []);

  if (!isBootstrapped) {
    return null; // or a Splash screen
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        flushPendingNavigation();
      }}
    >
      <SafeAreaProvider>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
