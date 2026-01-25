import { View, Text, TextInput, Pressable } from "react-native";
import { loginApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { connectSocket } from "../../socket/socket";
import { colors } from "../../theme/colors";

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

      <Pressable
        onPress={handleLogin}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Text
          style={{
            color: colors.buttonText,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Login
        </Text>
      </Pressable>

      <Text
        style={{ marginTop: 16, color: colors.primary, textAlign: "center" }}
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
