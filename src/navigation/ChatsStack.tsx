import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chats/ChatListScreen";
import ChatScreen from "../screens/chats/ChatScreen";

export type ChatStackParamList = {
  ChatList: { journeyLegId: string };
  Chat: {
    chatId: string;
    name: string;
  };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatsStack({ route }: any) {
  const { journeyLegId } = route.params;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: "Chats" }}
        initialParams={{ journeyLegId }}
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
