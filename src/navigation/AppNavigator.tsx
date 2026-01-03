import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JourneysListScreen from "../screens/journeys/JourneyListScreen";
import JourneyTabsScreen from "./JourneyTabsScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Journeys"
        component={JourneysListScreen}
        options={{ title: "My Journeys" }}
      />
      <Stack.Screen
        name="JourneyTabs"
        component={JourneyTabsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
