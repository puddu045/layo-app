import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chats/ChatListScreen";

const Stack = createNativeStackNavigator();

export default function ChatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
    </Stack.Navigator>
  );
}
