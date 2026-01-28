import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "../screens/chats/ChatListScreen";
import ChatScreen from "../screens/chats/ChatScreen";
import { Image, Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserProfileStore } from "../store/profile.store";
import { URL_Backend } from "../utils/backendURL";
import { colors } from "../theme/colors";

export type StackParamList = {
  Chats: {};
  Chat: {
    chatId: string;
    name: string;
    otherUserId: string;
    matchId: string;
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
                <View
                  style={{
                    width: 38,
                    height: 50, // taller than wide = airplane window feel
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
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => {
          const { name, otherUserId, profilePhotoUrl, matchId } = route.params;

          return {
            headerTitle: () => (
              <Pressable
                onPress={() =>
                  navigation.navigate("UserPreview", {
                    userId: otherUserId,
                    matchId,
                  })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {profilePhotoUrl ? (
                  <View
                    style={{
                      width: 40,
                      height: 52, // taller than wide = airplane window feel
                      borderRadius: 22,
                      backgroundColor: "#e5e7eb", // outer frame
                      padding: 3,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
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
                          uri: profilePhotoUrl,
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
                  // <Image
                  //   source={{
                  //     uri: profilePhotoUrl,
                  //   }}
                  //   style={{
                  //     width: 28,
                  //     height: 28,
                  //     borderRadius: 14,
                  //     marginRight: 8,
                  //   }}
                  // />
                  <Ionicons
                    name="person-circle-outline"
                    size={26}
                    color={colors.primary}
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
              </Pressable>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
}
