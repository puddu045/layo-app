import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JourneysListScreen from "../screens/journeys/JourneyListScreen";
import JourneyTabsScreen from "./JourneyTabsScreen";
import AddJourneyScreen from "../screens/journeys/AddJourneyScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Journeys"
        component={JourneysListScreen}
        options={{ title: "My Journeys", headerShown: false }}
      />
      <Stack.Screen
        name="AddJourney"
        component={AddJourneyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JourneyTabs"
        component={JourneyTabsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
