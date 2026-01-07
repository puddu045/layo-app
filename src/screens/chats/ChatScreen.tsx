import { Text, View } from "react-native";

export default function ChatScreen({ navigation, route }: any) {
  const { chatId } = route.params;

  return (
    <View style={{ marginTop: 40 }}>
      <Text style={{ textAlign: "center" }}>Chat ID: {chatId}</Text>
    </View>
  );
}
