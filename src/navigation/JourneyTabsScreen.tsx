import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MatchListScreen from "../screens/matches/MatchListScreen";
import RequestListScreen from "../screens/matches/RequestListScreen";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View } from "react-native";
import { useUserProfileStore } from "../store/profile.store";
import { URL_Backend } from "../utils/backendURL";
import { colors } from "../theme/colors";

import ChatsStack from "./ChatsStack";

const Tab = createBottomTabNavigator();

export default function JourneyTabsScreen({ navigation, route }: any) {
  const journeyId = route?.params?.journeyId;
  const profile = useUserProfileStore((s) => s.profile);

  return (
    <Tab.Navigator
      initialRouteName="ChatStack"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        headerTitleAlign: "center",
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            hitSlop={10}
            style={{ marginRight: 16 }}
          >
            {profile?.profilePhotoUrl ? (
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
      }}
    >
      <Tab.Screen
        name="ChatStack"
        component={ChatsStack}
        initialParams={{ journeyId }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchListScreen}
        initialParams={{ journeyId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestListScreen}
        initialParams={{ journeyId }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "mail-unread" : "mail-unread-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function clearAuth() {
  throw new Error("Function not implemented.");
}
