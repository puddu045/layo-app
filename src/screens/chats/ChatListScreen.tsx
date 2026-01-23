import React, { useCallback, useEffect } from "react";
import { Text, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchChatsByJourney } from "../../api/chats.api";
import { useChatStore } from "../../store/chat.store";
import ChatRow from "../../components/ChatRow";

export default function ChatListScreen({ navigation, route }: any) {
  const journeyId: string | undefined = route?.params?.journeyId;

  // 🔑 Read scoped state
  const chats = useChatStore((s) => s.chatsByJourneyId[journeyId ?? ""]) ?? [];

  const loading =
    useChatStore((s) => s.loadingByJourneyId[journeyId ?? ""]) ?? false;

  const setChatsForJourney = useChatStore((s) => s.setChatsForJourney);
  const setLoadingForJourney = useChatStore((s) => s.setLoadingForJourney);

  const loadChats = async () => {
    if (!journeyId) return;

    try {
      setLoadingForJourney(journeyId, true);
      const data = await fetchChatsByJourney(journeyId);
      setChatsForJourney(journeyId, data);
    } finally {
      setLoadingForJourney(journeyId, false);
    }
  };

  // Initial load
  useEffect(() => {
    loadChats();
  }, [journeyId]);

  // Reload on focus (safe to keep)
  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [journeyId]),
  );

  if (!journeyId) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        Select a journey first
      </Text>
    );
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
        />
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 40 }}>No chats yet</Text>
      }
    />
  );
}
