import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MatchListScreen from "../screens/matches/MatchListScreen";
import RequestListScreen from "../screens/matches/RequestListScreen";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import ChatsStack from "./ChatsStack";

const Tab = createBottomTabNavigator();

export default function JourneyTabsScreen({ navigation, route }: any) {
  const journeyId = route?.params?.journeyId;

  return (
    <Tab.Navigator
      initialRouteName="ChatStack"
      screenOptions={{
        headerTitleAlign: "center",
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            hitSlop={10}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="person-circle-outline" size={22} color="#2563eb" />
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
