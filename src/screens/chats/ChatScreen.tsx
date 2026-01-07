import { useEffect, useRef, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  fetchMessages,
  sendMessage,
  markChatAsRead,
} from "../../api/messages.api";
import { useAuthStore } from "../../store/auth.store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen({ route }: any) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const userId = user.id;

  const { chatId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    markChatAsRead(chatId);
  }, [chatId]);

  function appendMessage(message: any) {
    setMessages((prev) => [...prev, message]);
  }

  async function loadMessages() {
    const res = await fetchMessages(chatId);
    setMessages(res.messages.reverse());
    setCursor(res.nextCursor ?? null);
  }

  async function onSend() {
    if (!text.trim()) return;
    const sent = await sendMessage(chatId, text);
    appendMessage(sent);
    setText("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }

  function renderItem({ item }: any) {
    const isMe = item.senderId === userId;
    return (
      <View
        style={{
          alignSelf: isMe ? "flex-end" : "flex-start",
          backgroundColor: isMe ? "#1e90ff" : "#e5e5ea",
          padding: 10,
          borderRadius: 12,
          marginVertical: 4,
          maxWidth: "75%",
        }}
      >
        <Text style={{ color: isMe ? "#fff" : "#000" }}>{item.content}</Text>
      </View>
    );
  }

  return (
    // 1. KeyboardAvoidingView MUST be the outermost wrapper
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: Platform.OS === "ios" ? 0 : 0,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // If you have a top header, you MUST use this offset (adjust 90 as needed)
      keyboardVerticalOffset={headerHeight - 170}
    >
      {/* 2. FlatList handles its own space */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {/* 3. Wrap ONLY the input bar in a bottom-edged SafeAreaView */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: Platform.OS === "ios" ? 12 : 8,
            backgroundColor: "#f9f9f9",
          }}
        />
        <TouchableOpacity onPress={onSend} style={{ marginLeft: 8 }}>
          <Text
            style={{
              color: "#1e90ff",
              fontWeight: "bold",
              paddingHorizontal: 10,
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
