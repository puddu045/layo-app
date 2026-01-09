import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chats/ChatListScreen";
import ChatScreen from "../screens/chats/ChatScreen";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { resetChatSession } from "../utils/resetChatSession";
import { useAuthStore } from "../store/auth.store";
import { logoutApi } from "../api/auth.api";

export type StackParamList = {
  Chats: {};
  Chat: {
    chatId: string;
    name: string;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function ChatsStack({ route }: any) {
  const { journeyId } = route.params;

  async function logout() {
    resetChatSession();
    useAuthStore.getState().clearAuth();
    await logoutApi();
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerRight: () => (
          <Pressable onPress={logout} hitSlop={10} style={{ marginRight: 16 }}>
            <Ionicons name="log-out-outline" size={22} color="#2563eb" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="Chats"
        component={ChatListScreen}
        initialParams={{ journeyId }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params?.name ?? "Chat",
        })}
      />
    </Stack.Navigator>
  );
}
