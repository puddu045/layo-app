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
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Register</Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
      ) : null}

      <TextInput
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
        style={inputStyle}
      />

      <TextInput
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
        style={inputStyle}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />

      {/* Date of Birth Picker
      <Pressable onPress={() => setShowPicker(true)} style={inputStyle}>
        <Text style={{ color: dateOfBirth ? "#000" : "#999" }}>
          {dateOfBirth ? formatForDisplay(dateOfBirth) : "Date of birth"}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={dateOfBirth ?? new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDateOfBirth(selectedDate);
          }}
        />
      )}
         */}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={inputStyle}
      />

      <TextInput
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={inputStyle}
      />

      <Button title="Register" onPress={handleRegister} />

      <Text
        style={{ marginTop: 16, color: "blue", textAlign: "center" }}
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
};
