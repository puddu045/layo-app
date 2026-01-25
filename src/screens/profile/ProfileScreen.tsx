import React, { useEffect, useMemo, useState } from "react";
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
  gender: string;
  dateOfBirth: string | null;
};

export default function ProfileScreen() {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { user, profile, loading, fetchMyProfile, updateProfile } =
    useUserProfileStore();

  const [form, setForm] = useState<ProfileForm>({
    bio: "",
    city: "",
    location: "",
    nationality: "",
    gender: "",
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
        gender: profile.gender ?? "",
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
    setEditingField(null);
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
            bottom: 4,
            right: 4,
            backgroundColor: "#2563eb",
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff" }}>✎</Text>
        </Pressable>
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
        editing={editingField === "bio"}
        multiline
        onEdit={() => setEditingField("bio")}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            bio: v,
          }))
        }
      />

      <EditableRow
        label="Date of Birth"
        value={formatDateDDMMYYYY(form.dateOfBirth)}
        editing={false}
        onEdit={() => setShowDatePicker(true)}
      />

      <EditableRow
        label="Gender"
        value={form.gender}
        editing={editingField === "gender"}
        onEdit={() => setEditingField("gender")}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            gender: v,
          }))
        }
      />

      <EditableRow
        label="City"
        value={form.city}
        editing={editingField === "city"}
        onEdit={() => setEditingField("city")}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            city: v,
          }))
        }
      />

      <EditableRow
        label="Location"
        value={form.location}
        editing={editingField === "location"}
        onEdit={() => setEditingField("location")}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            location: v,
          }))
        }
      />

      <EditableRow
        label="Nationality"
        value={form.nationality}
        editing={editingField === "nationality"}
        onEdit={() => setEditingField("nationality")}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            nationality: v,
          }))
        }
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
              setForm((prev) => ({
                ...prev,
                dateOfBirth: date.toISOString().split("T")[0],
              }));
            }
          }}
        />
      )}

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

function EditableRow({
  label,
  value,
  editing,
  onEdit,
  onChange,
  multiline,
}: {
  label: string;
  value?: string | null;
  editing: boolean;
  onEdit: () => void;
  onChange?: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {editing ? (
          <TextInput
            value={value ?? ""}
            onChangeText={onChange}
            multiline={multiline}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 8,
              padding: 8,
              fontSize: 16,
            }}
          />
        ) : (
          <Text style={{ flex: 1, fontSize: 16 }}>{value || "—"}</Text>
        )}

        <Pressable onPress={onEdit}>
          <Text style={{ fontSize: 16, marginLeft: 8 }}>✎</Text>
        </Pressable>
      </View>
    </View>
  );
}
