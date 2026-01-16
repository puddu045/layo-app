import { View, Text, Button, TextInput, ImageBackground } from "react-native";
import { loginApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { connectSocket } from "../../socket/socket";
import {
  registerForPushNotifications,
  savePushTokenToBackend,
} from "../../utils/pushNotifications";

export default function LoginScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    try {
      const data = await loginApi(email, password);
      setAuth(data.accessToken, data.user);
      const token = await registerForPushNotifications();

      if (token) {
        await savePushTokenToBackend(token);
      }
      connectSocket(data.accessToken);
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Login</Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
      ) : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#9ca3af" // light gray
        style={inputStyle}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9ca3af"
        style={inputStyle}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text
        style={{ marginTop: 16, color: "blue", textAlign: "center" }}
        onPress={() => navigation.navigate("Register")}
      >
        Don’t have an account? Register
      </Text>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  // backgroundColor: "#111827",
  color: "#333",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
};
