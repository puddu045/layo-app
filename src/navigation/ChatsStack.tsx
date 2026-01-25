import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chats/ChatListScreen";
import ChatScreen from "../screens/chats/ChatScreen";
import { Image, Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfileStore } from "../store/profile.store";
import { URL_Backend } from "../utils/backendURL";

export type StackParamList = {
  Chats: {};
  Chat: {
    chatId: string;
    name: string;
    profilePhotoUrl: string | null;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

export default function ChatsStack({ navigation, route }: any) {
  const journeyId = route?.params?.journeyId;
  const profile = useUserProfileStore((s) => s.profile);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Chats"
        component={ChatListScreen}
        initialParams={{ journeyId }}
        options={{
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
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => {
          const { name, profilePhotoUrl } = route.params;

          return {
            headerTitle: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {profilePhotoUrl ? (
                  <Image
                    source={{
                      uri: `${URL_Backend}${profilePhotoUrl}`,
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      marginRight: 8,
                    }}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={26}
                    color="#2563eb"
                    style={{ marginRight: 8 }}
                  />
                )}

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
}
