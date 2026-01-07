import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchChatsByJourneyLeg } from "../../api/chats.api";
import { useChatStore } from "../../store/chat.store";
import ChatRow from "../../components/ChatRow";
import { useAuthStore } from "../../store/auth.store";

export default function ChatListScreen({ navigation, route }: any) {
  const journeyLegId = route?.params?.journeyLegId;
  const { chats, setChats, loading, setLoading } = useChatStore();

  const loadChats = async () => {
    if (!journeyLegId) return;

    try {
      setLoading(true);
      const data = await fetchChatsByJourneyLeg(journeyLegId);
      setChats(data);
    } finally {
      setLoading(false);
    }
  };

  // Load when journey changes
  useEffect(() => {
    loadChats();
  }, [journeyLegId]);

  // Reload when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [journeyLegId])
  );

  // Polling (every 15 seconds)
  useEffect(() => {
    if (!journeyLegId) return;

    const interval = setInterval(loadChats, 15000);
    return () => clearInterval(interval);
  }, [journeyLegId]);

  if (!journeyLegId) {
    return <Text>Select a journey first</Text>;
  }

  if (loading && chats.length === 0) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatRow
          chat={item}
          onSelectUser={(firstName: string) => {
            navigation.navigate("Chat", {
              chatId: item.id,
              name: firstName,
            });
          }}
          onPress={() => {}}
        />
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 40 }}>No chats yet</Text>
      }
    />
  );
}
