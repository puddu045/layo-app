import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chats/ChatListScreen";

const Stack = createNativeStackNavigator();

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
    </Stack.Navigator>
  );
}
