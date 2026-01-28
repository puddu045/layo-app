import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchChatsByJourney } from "../../api/chats.api";
import { useChatStore } from "../../store/chat.store";
import ChatRow from "../../components/ChatRow";
import { URL_Backend } from "../../utils/backendURL";
import { useAuthStore } from "../../store/auth.store";
import { BlurView } from "expo-blur";

type ImagePreviewData = {
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ChatListScreen({ navigation, route }: any) {
  const journeyId: string | undefined = route?.params?.journeyId;
  const userId = useAuthStore.getState().user?.id;
  const chatsByJourneyId = useChatStore((s) => s.chatsByJourneyId);
  const [imagePreview, setImagePreview] = useState<ImagePreviewData | null>(
    null,
  );
  const { width: screenWidth } = useWindowDimensions();
  const CARD_SIZE = Math.min(screenWidth * 0.9, 600);

  const chats = chatsByJourneyId[journeyId ?? ""] ?? [];

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
    <>
      <FlatList
        data={chats}
        style={{ marginTop: 5 }}
        extraData={chats.map((c) => c.unreadCount).join(",")}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatRow
            chat={item}
            onSelectUser={(
              firstName: string,
              otherUserId: string,
              matchId: string,
            ) => {
              navigation.navigate("Chat", {
                chatId: item.id,
                name: firstName,
                matchId,
                otherUserId: otherUserId,
                profilePhotoUrl: item.otherUserProfilePhotoUrl
                  ? `${URL_Backend}${item.otherUserProfilePhotoUrl}?v=${item.otherUserProfileUpdatedAt}`
                  : null,
              });
            }}
            onImagePress={(data: ImagePreviewData) => {
              setImagePreview(data);
            }}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No chats yet
          </Text>
        }
      />
      {imagePreview && (
        <>
          {/* Backdrop */}
          <Pressable
            onPress={() => setImagePreview(null)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
            }}
          >
            <BlurView
              intensity={85}
              tint="dark"
              style={{
                flex: 1,
              }}
            />
          </Pressable>

          {/* Pop-out card */}
          <View
            style={{
              position: "absolute",
              top: imagePreview.y - 20,
              left: imagePreview.x + 40,
              width: 300,
              height: 300,
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              zIndex: 100,
              elevation: 10, // Android
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Image
              source={{ uri: imagePreview.uri }}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </>
      )}
    </>
  );
}
