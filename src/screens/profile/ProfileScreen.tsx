import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import api from "../../api/client";
import { URL_Backend } from "../../utils/backendURL";
import { useUserProfileStore } from "../../store/profile.store";

/* -------------------- Gender Enum Mapping -------------------- */

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Non-binary", value: "NON_BINARY" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
] as const;

function getGenderLabel(value?: string | null) {
  return GENDER_OPTIONS.find((g) => g.value === value)?.label ?? "—";
}

/* -------------------- Helpers -------------------- */

function formatDateDDMMYYYY(date?: string | null) {
  if (!date) return "—";
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}-${d.getFullYear()}`;
}

type ProfileForm = {
  bio: string;
  city: string;
  location: string;
  nationality: string;
  gender: string | null;
  dateOfBirth: string | null;
};

export default function ProfileScreen() {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const { user, profile, loading, fetchMyProfile, updateProfile } =
    useUserProfileStore();

  const [form, setForm] = useState<ProfileForm>({
    bio: "",
    city: "",
    location: "",
    nationality: "",
    gender: null,
    dateOfBirth: null,
  });

  const [initialForm, setInitialForm] = useState<ProfileForm | null>(null);

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      const mapped: ProfileForm = {
        bio: profile.bio ?? "",
        city: profile.city ?? "",
        location: profile.location ?? "",
        nationality: profile.nationality ?? "",
        gender: profile.gender ?? null,
        dateOfBirth: profile.dateOfBirth ?? null,
      };

      setForm(mapped);
      setInitialForm(mapped);
    }
  }, [profile]);

  const dirty = useMemo(() => {
    if (!initialForm) return false;
    const normalizeDate = (d: string | null) => (d ? d.split("T")[0] : null);

    return (
      form.bio !== initialForm.bio ||
      form.city !== initialForm.city ||
      form.location !== initialForm.location ||
      form.nationality !== initialForm.nationality ||
      form.gender !== initialForm.gender ||
      normalizeDate(form.dateOfBirth) !== normalizeDate(initialForm.dateOfBirth)
    );
  }, [form, initialForm]);

  const handleSave = async () => {
    await updateProfile(form);
    setInitialForm(form);
  };

  const handleChangePhoto = async () => {
    if (Platform.OS !== "web") {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    try {
      setUploading(true);
      const image = result.assets[0];

      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      await api.put("/users/me/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchMyProfile();
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Profile Photo */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View style={{ width: 120, height: 120 }}>
          <Pressable onPress={() => setPreviewVisible(true)}>
            {profile?.profilePhotoUrl ? (
              <Image
                source={{
                  uri: `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`,
                }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
              />
            ) : (
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: "#e5e7eb",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Add Photo</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handleChangePhoto}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#2563eb",
              width: 32,
              height: 32,
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#fff",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>✎</Text>
          </Pressable>
        </View>
      </View>

      {/* Name */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {user?.firstName} {user?.lastName}
      </Text>

      <EditableRow
        label="Bio"
        value={form.bio}
        onChange={(v) => setForm((p) => ({ ...p, bio: v }))}
        editable
        multiline
      />

      <EditableRow
        label="Date of Birth"
        value={formatDateDDMMYYYY(form.dateOfBirth)}
        onPress={() => setShowDatePicker(true)}
      />

      <EditableRow
        label="Gender"
        value={getGenderLabel(form.gender)}
        onPress={() => setGenderModalVisible(true)}
      />

      <EditableRow
        label="City"
        value={form.city}
        onChange={(v) => setForm((p) => ({ ...p, city: v }))}
        editable
      />

      <EditableRow
        label="Location"
        value={form.location}
        onChange={(v) => setForm((p) => ({ ...p, location: v }))}
        editable
      />

      <EditableRow
        label="Nationality"
        value={form.nationality}
        onChange={(v) => setForm((p) => ({ ...p, nationality: v }))}
        editable
      />

      {dirty && (
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
      )}

      {showDatePicker && (
        <DateTimePicker
          value={form.dateOfBirth ? new Date(form.dateOfBirth) : new Date()}
          mode="date"
          maximumDate={new Date()}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) {
              setForm((p) => ({
                ...p,
                dateOfBirth: date.toISOString().split("T")[0],
              }));
            }
          }}
        />
      )}

      <Modal visible={genderModalVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setGenderModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 30,
          }}
        >
          <View style={{ backgroundColor: "#fff", borderRadius: 12 }}>
            {GENDER_OPTIONS.map((g) => (
              <Pressable
                key={g.value}
                onPress={() => {
                  setForm((p) => ({ ...p, gender: g.value }));
                  setGenderModalVisible(false);
                }}
                style={{
                  padding: 16,
                  borderBottomWidth: 1,
                  borderColor: "#e5e7eb",
                }}
              >
                <Text style={{ fontSize: 16 }}>{g.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={previewVisible} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setPreviewVisible(false)}
            style={{ position: "absolute", top: 40, right: 20 }}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>

          {profile?.profilePhotoUrl && (
            <Image
              source={{ uri: `${URL_Backend}${profile.profilePhotoUrl}` }}
              style={{ width: "100%", height: "80%", resizeMode: "contain" }}
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

/* -------------------- Editable Row -------------------- */

function EditableRow({
  label,
  value,
  editable,
  onChange,
  onPress,
  multiline,
}: {
  label: string;
  value?: string | null;
  editable?: boolean;
  onChange?: (v: string) => void;
  onPress?: () => void;
  multiline?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  if (!editable) {
    return (
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
        <Pressable onPress={onPress}>
          <Text style={{ fontSize: 16 }}>{value || "—"}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>

      {isEditing ? (
        <TextInput
          ref={inputRef}
          value={value ?? ""}
          onChangeText={onChange}
          multiline={multiline}
          autoFocus
          onBlur={() => setIsEditing(false)}
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 8,
            padding: 8,
            fontSize: 16,
          }}
        />
      ) : (
        <Pressable onPress={() => setIsEditing(true)}>
          <Text
            style={{
              fontSize: 16,
              minHeight: 40,
              textAlignVertical: "center",
            }}
          >
            {value || "—"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
