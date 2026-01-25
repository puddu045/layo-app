import { View, Text, Image, Pressable } from "react-native";
import { URL_Backend } from "../utils/backendURL";

type Props = {
  user: any;
  primaryText?: string;
  secondaryText?: string;
  onAccept: () => void;
  onReject: () => void;
};

export function UserMatchCard({
  user,
  primaryText,
  secondaryText,
  onAccept,
  onReject,
}: Props) {
  return (
    <View
      style={{
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Avatar + name */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {user.profile?.profilePhotoUrl ? (
            <Image
              source={{
                uri: `${URL_Backend}${user.profile.profilePhotoUrl}?v=${user.profile.updatedAt}`,
              }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#e5e7eb",
                marginRight: 12,
              }}
            />
          ) : (
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#e5e7eb",
                marginRight: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "600", color: "#555" }}>
                {user.firstName[0]}
                {user.lastName?.[0] ?? ""}
              </Text>
            </View>
          )}

          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        {/* Actions */}
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={onReject}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#fee2e2",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "#dc2626", fontSize: 18, fontWeight: "700" }}>
              ✕
            </Text>
          </Pressable>

          <Pressable
            onPress={onAccept}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#dcfce7",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#16a34a", fontSize: 18, fontWeight: "700" }}>
              ✓
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Text */}
      {primaryText && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "500", color: "#333" }}>
            {primaryText}
          </Text>
        </View>
      )}

      {secondaryText && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ fontWeight: "500", color: "#333" }}>
            {secondaryText}
          </Text>
        </View>
      )}
    </View>
  );
}
