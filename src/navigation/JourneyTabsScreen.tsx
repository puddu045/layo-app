import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/chats/ChatListScreen";
import MatchListScreen from "../screens/matches/MatchListScreen";

const Tab = createBottomTabNavigator();

export default function JourneyTabsScreen() {
  return (
    <Tab.Navigator initialRouteName="Chats">
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Matches" component={MatchListScreen} />
    </Tab.Navigator>
  );
}
