import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import { useAuthStore } from "../store/auth.store";
import { URL_Backend } from "../utils/backendURL";
import { useRef } from "react";

export default function ChatRow({
  chat,
  onPress,
  onSelectUser,
  onImagePress,
}: any) {
  const user = useAuthStore((s) => s.user);
  const avatarRef = useRef<View>(null);

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
    ? `${URL_Backend}${chat.otherUserProfilePhotoUrl}?v=${chat.otherUserProfileUpdatedAt}`
    : null;

  const matchId = chat.matchId;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          onSelectUser?.(showUser.firstName, showUser.id, matchId);
          onPress?.();
        }}
        style={{
          margin: 5,
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderRadius: 15,
          backgroundColor: "#ffffff",
          elevation: 5,
        }}
      >
        {/* AVATAR */}
        <Pressable
          ref={avatarRef}
          onPress={(e) => {
            e.stopPropagation();
            if (!profilePhotoUrl) return;

            avatarRef.current?.measureInWindow((x, y, width, height) => {
              onImagePress?.({
                uri: profilePhotoUrl,
                x,
                y,
                width,
                height,
              });
            });
          }}
          style={{ marginRight: 12 }}
        >
          {profilePhotoUrl ? (
            <View
              style={{
                width: 48,
                height: 60, // taller than wide = airplane window feel
                borderRadius: 22,
                backgroundColor: "#e5e7eb", // outer frame
                padding: 3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 18,
                  backgroundColor: "#fff",
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                }}
              >
                <Image
                  source={{
                    uri: profilePhotoUrl,
                  }}
                  resizeMode="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
          ) : (
            // <Image
            //   source={{ uri: profilePhotoUrl }}
            //   style={{
            //     width: 44,
            //     height: 44,
            //     borderRadius: 22,
            //     backgroundColor: "#e5e7eb",
            //   }}
            // />
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
        </Pressable>

        {/* CENTER */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>{fullName}</Text>

          <Text
            numberOfLines={1}
            style={{
              color: chat.unreadCount > 0 ? "#111" : "#666",
              marginTop: 4,
              fontWeight: chat.unreadCount > 0 ? "500" : "400",
            }}
          >
            {chat.lastMessage
              ? chat.lastMessage.senderId === user.id
                ? `You: ${chat.lastMessage.content}`
                : chat.lastMessage.content
              : "No messages yet"}
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
        <View />
      </TouchableOpacity>
    </>
  );
}
