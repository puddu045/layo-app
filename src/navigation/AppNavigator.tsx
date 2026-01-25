import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JourneysListScreen from "../screens/journeys/JourneyListScreen";
import JourneyTabsScreen from "./JourneyTabsScreen";
import AddJourneyScreen from "../screens/journeys/AddJourneyScreen";
import ProfileListScreen from "../screens/profile/ProfileListScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import { Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../utils/logout";
import { useUserProfileStore } from "../store/profile.store";
import { URL_Backend } from "../utils/backendURL";

const Stack = createNativeStackNavigator();

export default function AppNavigator({ navigation }: any) {
  const profile = useUserProfileStore((s) => s.profile);

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
              {profile?.profilePhotoUrl ? (
                <Image
                  source={{
                    uri: `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`,
                  }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                  }}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={26}
                  color="#2563eb"
                />
              )}
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
