import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
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
  const { user, profile, loading, fetchMyProfile } = useUserProfileStore();

  useEffect(() => {
    fetchMyProfile();
  }, []);

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
        {profile?.profilePhotoUrl ? (
          <Image
            source={{ uri: profile.profilePhotoUrl }}
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
            <Text style={{ color: "#6b7280" }}>No Photo</Text>
          </View>
        )}
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
