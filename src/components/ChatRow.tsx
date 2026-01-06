import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/auth.store";

export default function ChatRow({ chat, onPress }: any) {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    // Render skeleton / placeholder safely
    return (
      <TouchableOpacity onPress={onPress} style={{ padding: 16 }}>
        <Text style={{ fontWeight: "600" }}>Loading...</Text>
      </TouchableOpacity>
    );
  }
  const showUser =
    user.id !== chat.match.senderId ? chat.match.sender : chat.match.receiver;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        padding: 16,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600" }}>{showUser.firstName}</Text>

        <Text numberOfLines={1} style={{ color: "#666" }}>
          {chat.lastMessage?.text ?? "No messages yet"}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        {chat.lastMessage && (
          <Text style={{ fontSize: 12, color: "#888" }}>
            {new Date(chat.lastMessage.createdAt).toLocaleTimeString()}
          </Text>
        )}

        {chat.unreadCount > 0 && (
          <View
            style={{
              marginTop: 6,
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
      </View>
    </TouchableOpacity>
  );
}
