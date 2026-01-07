import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/auth.store";

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
      {/* LEFT */}
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
