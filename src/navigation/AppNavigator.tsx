import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JourneysListScreen from "../screens/journeys/JourneyListScreen";
import JourneyTabsScreen from "./JourneyTabsScreen";
import AddJourneyScreen from "../screens/journeys/AddJourneyScreen";
import ProfileListScreen from "../screens/profile/ProfileScreen";
import { Image, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../utils/logout";
import { useUserProfileStore } from "../store/profile.store";
import { URL_Backend } from "../utils/backendURL";
import { colors } from "../theme/colors";
import UserPreviewModal from "../screens/profile/UserPreviewModal";

export type AppStackParamList = {
  Journeys: undefined;
  AddJourney: undefined;
  JourneyTabs: undefined;
  Profile: undefined;

  UserPreview: {
    userId: string;
    matchId?: string;
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

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
                // <Image
                //   source={{
                //     uri: `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`,
                //   }}
                //   style={{
                //     width: 28,
                //     height: 28,
                //     borderRadius: 14,
                //   }}
                // />
                <View
                  style={{
                    width: 44,
                    height: 56, // taller than wide = airplane window feel
                    borderRadius: 22,
                    backgroundColor: "#e5e7eb", // outer frame
                    padding: 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 18,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      shadowColor: "#000",
                      shadowOpacity: 0.15,
                      shadowRadius: 3,
                    }}
                  >
                    <Image
                      source={{
                        uri: `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`,
                      }}
                      resizeMode="cover"
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </View>
                </View>
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={26}
                  color={colors.primary}
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
              <Ionicons
                name="log-out-outline"
                size={22}
                color={colors.primary}
              />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="UserPreview"
        component={UserPreviewModal}
        options={{
          headerShown: false,
          presentation: "transparentModal",
          animation: "fade",
        }}
      />
    </Stack.Navigator>
  );
}
