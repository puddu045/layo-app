import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import * as Notifications from "expo-notifications";

import { navigationRef } from "./navigationRef";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
import { useUserProfileStore } from "../store/profile.store";

import { useAuthStore } from "../store/auth.store";
import api from "../api/client";
import { URL_Backend } from "../utils/backendURL";

import {
  registerForPushNotifications,
  savePushTokenToBackend,
} from "../utils/pushNotifications";

import { NotificationData } from "../notifications/types";
import { flushPendingNavigation, navigateWhenReady } from "./navigationService";

// 🔌 SOCKET IMPORTS (IMPORTANT)
import { connectSocket } from "../socket/socket";
import { registerChatListeners } from "../socket/chatListeners";

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const fetchMyProfile = useUserProfileStore((s) => s.fetchMyProfile);

  /* -----------------------------
     AUTH BOOTSTRAP
  ------------------------------ */
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

    fetchMyProfile();
  }, [isAuthenticated]);

  /* -----------------------------
     SOCKET INITIALISATION (🔥 FIX)
  ------------------------------ */
  useEffect(() => {
    if (!isAuthenticated) return;

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return;

    const socket = connectSocket(accessToken);

    socket.on("connect", () => {
      registerChatListeners();
    });

    socket.on("disconnect", () => {});

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  /* -----------------------------
     PUSH TOKEN REGISTRATION
  ------------------------------ */
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
        await savePushTokenToBackend(token);
      } catch (e) {
        console.log("❌ Saving push token failed", e);
      }
    })();
  }, [isAuthenticated]);

  /* -----------------------------
     FOREGROUND NOTIFICATION LISTENER
  ------------------------------ */
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      () => {},
    );

    return () => subscription.remove();
  }, []);

  /* -----------------------------
     NOTIFICATION TAP HANDLER
  ------------------------------ */
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as Partial<NotificationData>;

        if (data?.type === "NEW_MESSAGE" && typeof data.chatId === "string") {
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

  /* -----------------------------
     RENDER
  ------------------------------ */
  if (!isBootstrapped) {
    return null; // splash screen placeholder
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
