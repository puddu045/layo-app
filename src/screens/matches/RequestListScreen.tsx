import { FlatList, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import { useRequestStore } from "../../store/request.store";
import {
  fetchPendingRequestsByJourney,
  acceptMatch,
  rejectMatch,
} from "../../api/matches.api";
import { useAuthStore } from "../../store/auth.store";

export default function RequestListScreen({ route }: any) {
  const journeyId = route?.params?.journeyId;
  const currentUser = useAuthStore((s) => s.user);

  const requestState = useRequestStore((s) => s.requestsByJourneyId[journeyId]);

  const setRequestsForJourney = useRequestStore((s) => s.setRequestsForJourney);
  const setLoadingForJourney = useRequestStore((s) => s.setLoadingForJourney);
  const clearRequestsForJourney = useRequestStore(
    (s) => s.clearRequestsForJourney
  );

  function formatDateTime(iso: string) {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  useEffect(() => {
    const load = async () => {
      setLoadingForJourney(journeyId, true);
      const data = await fetchPendingRequestsByJourney(journeyId);
      setRequestsForJourney(journeyId, data);
    };

    load();

    return () => {
      clearRequestsForJourney(journeyId);
    };
  }, [journeyId]);

  if (!requestState || requestState.loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        Loading requests...
      </Text>
    );
  }

  if (requestState.data.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        No pending requests
      </Text>
    );
  }

  return (
    <FlatList
      data={requestState.data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const isSender = item.senderId === currentUser?.id;

        const otherUser = isSender ? item.receiver : item.sender;
        const journey = isSender ? item.receiverJourney : item.senderJourney;

        const dep = formatDateTime(journey.departureTime);

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
            {/* Name */}
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {otherUser?.firstName} {otherUser?.lastName}
            </Text>

            {/* Context */}
            <Text style={{ color: "#555", marginTop: 6 }}>
              Wants to connect for flight {journey.flightNumber} on {dep.date}{" "}
              at {dep.time}
            </Text>

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                justifyContent: "space-between",
              }}
            >
              <Pressable
                onPress={async () => {
                  await rejectMatch(item.id);
                  setRequestsForJourney(
                    journeyId,
                    requestState.data.filter((r) => r.id !== item.id)
                  );
                }}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  marginRight: 8,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#555" }}>Reject</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await acceptMatch(item.id);
                  setRequestsForJourney(
                    journeyId,
                    requestState.data.filter((r) => r.id !== item.id)
                  );
                }}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "#16a34a",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Accept</Text>
              </Pressable>
            </View>
          </View>
        );
      }}
    />
  );
}
