import { View, Text, Button } from "react-native";
import { useAuthStore } from "../../store/auth.store";
import axios from "axios";

export default function HomeScreen() {
  const logout = useAuthStore((s) => s.clearAuth);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
