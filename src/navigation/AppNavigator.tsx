import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JourneysListScreen from "../screens/journeys/JourneyListScreen";
import JourneyTabsScreen from "./JourneyTabsScreen";
import AddJourneyScreen from "../screens/journeys/AddJourneyScreen";
import ProfileListScreen from "../screens/profile/ProfileListScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../utils/logout";

const Stack = createNativeStackNavigator();

export default function AppNavigator({ navigation }: any) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Journeys"
        component={JourneysListScreen}
        options={({ navigation }) => ({
          title: "My Journeys",
          headerTitleAlign: "center",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Profile")}
              hitSlop={10}
              style={{ marginRight: 16 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#2563eb"
              />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="AddJourney"
        component={AddJourneyScreen}
        options={{ headerShown: true, headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="JourneyTabs"
        component={JourneyTabsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileListScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerRight: () => (
            <Pressable onPress={logout} style={{ marginRight: 16 }}>
              <Ionicons name="log-out-outline" size={22} color="#2563eb" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}
