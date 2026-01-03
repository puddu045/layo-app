import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/chats/ChatListScreen";
import MatchListScreen from "../screens/matches/MatchListScreen";

const Tab = createBottomTabNavigator();

export default function JourneyTabsScreen({ route }: any) {
  const { journeyLegId } = route.params;

  return (
    <Tab.Navigator initialRouteName="Chats">
      <Tab.Screen
        name="Chats"
        component={ChatListScreen}
        initialParams={{ journeyLegId }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchListScreen}
        initialParams={{ journeyLegId }}
      />
    </Tab.Navigator>
  );
}
