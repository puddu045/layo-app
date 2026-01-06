import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/chats/ChatListScreen";
import MatchListScreen from "../screens/matches/MatchListScreen";
import RequestListScreen from "../screens/matches/RequestListScreen";

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
      <Tab.Screen
        name="Requests"
        component={RequestListScreen}
        initialParams={{ journeyLegId }}
      />
    </Tab.Navigator>
  );
}
