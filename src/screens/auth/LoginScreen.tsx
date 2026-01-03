import { View, Text, Button, TextInput } from "react-native";
import { loginApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";

export default function LoginScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const data = await loginApi(email, password);
    setAuth(data.accessToken, data.user);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 12,
          borderRadius: 6,
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: "100%",
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          marginBottom: 16,
          borderRadius: 6,
        }}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
