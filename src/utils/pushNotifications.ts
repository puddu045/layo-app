import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import api from "../api/client";

export async function savePushTokenToBackend(token: string) {
  return api.post("/users/push-token", {
    token,
  });
}

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("❌ Not a physical device");
    return null;
  }

  // REQUIRED on Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Notification permission not granted");
    return null;
  }

  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    console.log("❌ Missing EAS projectId");
    return null;
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  console.log("✅ Expo push token:", tokenResponse.data);

  return tokenResponse.data;
}
