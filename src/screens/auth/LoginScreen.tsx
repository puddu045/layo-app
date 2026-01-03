import { View, Text, Button } from "react-native";
import { loginApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    const data = await loginApi("Test1@example.com", "Test@1234");
    setAuth(data.accessToken, data.user);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
