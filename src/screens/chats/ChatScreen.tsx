import { useCallback, useEffect, useRef, useState } from "react";
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

import { getSocket } from "../../socket/socket";

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

  /* ---------------- message helpers ---------------- */

  const appendMessage = useCallback((message: any) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const replaceMessage = useCallback((tempId: string, realMessage: any) => {
    setMessages((prev) => prev.map((m) => (m.id === tempId ? realMessage : m)));
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  /* ---------------- initial load ---------------- */

  const loadMessages = useCallback(async () => {
    const res = await fetchMessages(chatId);
    setMessages(res.messages.reverse());
    setCursor(res.nextCursor ?? null);
    scrollToBottom();
  }, [chatId, scrollToBottom]);

  useEffect(() => {
    loadMessages();
    markChatAsRead(chatId);
  }, [chatId, loadMessages]);

  /* ---------------- socket: join room ---------------- */

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("join_chat", { chatId });

    return () => {
      socket.emit("leave_chat", { chatId });
    };
  }, [chatId]);

  /* ---------------- socket: receive messages ---------------- */

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (message: any) => {
      if (message.chatId !== chatId) return;
      if (message.senderId === userId && message.tempId) {
        replaceMessage(message.tempId, message);
      } else {
        appendMessage(message);
      }
      scrollToBottom();
    };

    socket.on("new_message", handler);

    return () => {
      socket.off("new_message", handler);
    };
  }, [chatId, appendMessage, scrollToBottom]);

  /* ---------------- send message (SOCKET) ---------------- */

  async function onSend() {
    if (!text.trim()) return;

    const socket = getSocket();
    if (!socket) return;

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      id: tempId,
      tempId,
      chatId,
      senderId: userId,
      content: text,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    // optimistic UI
    appendMessage(optimisticMessage);
    setText("");
    scrollToBottom();

    // 🔑 send via socket (this enables real-time)
    socket.emit("send_message", {
      chatId,
      content: optimisticMessage.content,
      tempId,
    });
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
