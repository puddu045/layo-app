import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUserProfileStore } from "../../store/profile.store";
import DateTimePicker from "@react-native-community/datetimepicker";

function formatDateDDMMYYYY(date?: string | null) {
  if (!date) return "Select date";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function EditProfileScreen({ navigation }: any) {
  const { profile, loading, updateProfile } = useUserProfileStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    city: "",
    location: "",
    nationality: "",
    gender: "",
    dateOfBirth: null as string | null,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        bio: profile.bio ?? "",
        city: profile.city ?? "",
        location: profile.location ?? "",
        nationality: profile.nationality ?? "",
        gender: profile.gender ?? "",
        dateOfBirth: profile.dateOfBirth ?? null,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile(form);
    navigation.goBack();
  };

  if (loading && !profile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          backgroundColor: "#fff",
          flexGrow: 1,
        }}
      >
        <FormInput
          label="Bio"
          value={form.bio}
          multiline
          onChangeText={(v) => setForm({ ...form, bio: v })}
        />

        <FormInput
          label="City"
          value={form.city}
          onChangeText={(v) => setForm({ ...form, city: v })}
        />

        <FormInput
          label="Location"
          value={form.location}
          onChangeText={(v) => setForm({ ...form, location: v })}
        />

        <FormInput
          label="Nationality"
          value={form.nationality}
          onChangeText={(v) => setForm({ ...form, nationality: v })}
        />

        <FormInput
          label="Gender"
          value={form.gender}
          onChangeText={(v) => setForm({ ...form, gender: v })}
        />

        {/* Date Picker */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
            Date of Birth
          </Text>

          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {formatDateDDMMYYYY(form.dateOfBirth)}
            </Text>
          </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()}
            mode="date"
            maximumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setForm({
                  ...form,
                  dateOfBirth: selectedDate.toISOString().split("T")[0],
                });
              }
            }}
          />
        )}

        <Pressable
          onPress={handleSave}
          style={{
            marginTop: 30,
            backgroundColor: "#2563eb",
            paddingVertical: 14,
            borderRadius: 28,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Save Changes
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 10 : 8,
          minHeight: multiline ? 80 : 40,
          fontSize: 16,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
    </View>
  );
}
