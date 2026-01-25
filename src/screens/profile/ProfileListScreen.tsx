import React, { useEffect, useState } from "react";
import { URL_Backend } from "../../utils/backendURL";
import { Modal, TouchableOpacity } from "react-native";

import {
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/client";
import { useUserProfileStore } from "../../store/profile.store";

function formatDateDDMMYYYY(date?: string | null) {
  if (!date) return "—";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function ProfileScreen({ navigation }: any) {
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const { user, profile, loading, fetchMyProfile } = useUserProfileStore();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleChangePhoto = async () => {
    // 1. Ask permission (Android safe)
    if (Platform.OS !== "web") {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo access to update your profile picture.",
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    // 3. Defensive checks
    if (!result || result.canceled || !result.assets?.length) {
      return;
    }

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 4. Refresh profile after upload
      await fetchMyProfile();
    } catch (err) {
      console.error("Profile photo upload failed", err);
      Alert.alert("Upload failed", "Please try again.");
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
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* Profile Photo */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <View>
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
                <Text style={{ color: "#6b7280" }}>Add Photo</Text>
              </View>
            )}
          </Pressable>

          {/* Edit icon */}
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
            <Text style={{ color: "#fff", fontSize: 16 }}>✎</Text>
          </Pressable>

          {uploading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                borderRadius: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>
      </View>

      {/* Name */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
          {user?.firstName} {user?.lastName}
        </Text>
      </View>

      {/* Details */}
      <View style={{ gap: 10 }}>
        <ProfileRow label="Email" value={user?.email} />
        <ProfileRow label="Bio" value={profile?.bio} />
        <ProfileRow
          label="Date of Birth"
          value={formatDateDDMMYYYY(profile?.dateOfBirth)}
        />
        <ProfileRow label="Gender" value={profile?.gender} />
        <ProfileRow label="City" value={profile?.city} />
        <ProfileRow label="Location" value={profile?.location} />
        <ProfileRow label="Nationality" value={profile?.nationality} />
      </View>

      <Pressable
        onPress={() => navigation.navigate("EditProfile")}
        style={{
          marginTop: 30,
          backgroundColor: "#2563eb",
          paddingVertical: 14,
          borderRadius: 28,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Edit Profile
        </Text>
      </Pressable>
      <Modal visible={previewVisible} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setPreviewVisible(false)}
            style={{ position: "absolute", top: 40, right: 20 }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Close</Text>
          </TouchableOpacity>

          {profile?.profilePhotoUrl && (
            <Image
              source={{
                uri: `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`,
              }}
              style={{
                width: "100%",
                height: "80%",
                resizeMode: "contain",
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <View>
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
      <Text style={{ fontSize: 16, color: "#111827" }}>{value || "—"}</Text>
    </View>
  );
}
