import { View, Text, Image, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/auth.store";
import { URL_Backend } from "../utils/backendURL";

export default function ChatRow({ chat, onPress, onSelectUser }: any) {
  const user = useAuthStore((s) => s.user);

  if (!user || !chat?.match) {
    return null;
  }

  // 🔑 Decide who to show
  const showUser =
    user.id === chat.match.senderId ? chat.match.receiver : chat.match.sender;

  if (!showUser) return null;

  const fullName = [showUser.firstName, showUser.lastName]
    .filter(Boolean)
    .join(" ");

  const profilePhotoUrl = chat.otherUserProfilePhotoUrl
    ? `${URL_Backend}${chat.otherUserProfilePhotoUrl}?v=${chat.updatedAt}`
    : null;

  return (
    <TouchableOpacity
      onPress={() => {
        onSelectUser?.(showUser.firstName);
        onPress?.();
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
      }}
    >
      {/* AVATAR */}
      <View style={{ marginRight: 12 }}>
        {profilePhotoUrl ? (
          <Image
            source={{ uri: profilePhotoUrl }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#e5e7eb",
            }}
          />
        ) : (
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#e5e7eb",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#6b7280", fontWeight: "600" }}>
              {showUser.firstName?.[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
        )}
      </View>

      {/* CENTER */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>{fullName}</Text>

        <Text numberOfLines={1} style={{ color: "#666", marginTop: 4 }}>
          {chat.unreadCount > 0 ? "New messages" : "No new messages yet"}
        </Text>
      </View>

      {/* RIGHT */}
      {chat.unreadCount > 0 && (
        <View
          style={{
            backgroundColor: "#2f80ed",
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {chat.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
