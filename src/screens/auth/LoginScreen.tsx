import { View, Text, Button } from "react-native";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen() {
  const login = useAuthStore((s) => s.login);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login</Text>
      <Button title="Fake Login" onPress={login} />
    </View>
  );
}
