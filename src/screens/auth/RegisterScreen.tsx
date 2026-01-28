import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { registerApi } from "../../api/auth.api";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  // const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  // const [showPicker, setShowPicker] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // const formatForDisplay = (date: Date) => {
  //   const dd = String(date.getDate()).padStart(2, "0");
  //   const mm = String(date.getMonth() + 1).padStart(2, "0");
  //   const yyyy = date.getFullYear();
  //   return `${dd}-${mm}-${yyyy}`;
  // };

  // const formatForBackend = (date: Date) => {
  //   const yyyy = date.getFullYear();
  //   const mm = String(date.getMonth() + 1).padStart(2, "0");
  //   const dd = String(date.getDate()).padStart(2, "0");
  //   return `${yyyy}-${mm}-${dd}`;
  // };

  const handleRegister = async () => {
    setError("");

    // if (!dateOfBirth) {
    //   setError("Please select your date of birth");
    //   return;
    // }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerApi({
        firstName,
        lastName,
        email,
        password,
        // dateOfBirth: formatForBackend(dateOfBirth),
      });

      navigation.navigate("Login");
    } catch (err: any) {
      const backendMessage = err?.response?.data?.message;

      if (typeof backendMessage === "string") {
        setError(backendMessage);
        return;
      }

      if (Array.isArray(backendMessage)) {
        setError(backendMessage[0]); // show first validation error
        return;
      }

      if (err?.response?.status === 409) {
        setError("Email already registered");
        return;
      }

      setError("Registration failed. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      {error ? (
        <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
      ) : null}

      <TextInput
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#9ca3af"
        style={inputStyle}
      />

      <TextInput
        placeholder="Last name"
        value={lastName}
        placeholderTextColor="#9ca3af"
        onChangeText={setLastName}
        style={inputStyle}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#9ca3af"
        secureTextEntry
        style={inputStyle}
      />

      <TextInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#9ca3af"
        secureTextEntry
        style={inputStyle}
      />

      <Pressable
        onPress={handleRegister}
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
          Register
        </Text>
      </Pressable>

      <Text
        style={{ marginTop: 16, color: colors.primary, textAlign: "center" }}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </Text>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  color: "#000",
};
