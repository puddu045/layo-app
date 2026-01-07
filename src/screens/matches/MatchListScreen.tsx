import { FlatList, Text, View, Pressable } from "react-native";
import { useMatchStore } from "../../store/match.store";
import { fetchMatchesByJourneyLeg } from "../../api/matches.api";
import { sendMatchRequest, dismissPotentialMatch } from "../../api/matches.api";
import { useEffect } from "react";

export default function MatchListScreen({ route }: any) {
  const journeyLegId = route?.params?.journeyLegId;

  const matchState = useMatchStore((s) => s.matchesByLegId[journeyLegId]);
  const setMatchesForLeg = useMatchStore((s) => s.setMatchesForLeg);
  const setLoadingForLeg = useMatchStore((s) => s.setLoadingForLeg);

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
      setLoadingForLeg(journeyLegId, true);
      const data = await fetchMatchesByJourneyLeg(journeyLegId);
      setMatchesForLeg(journeyLegId, data);
    };
    load();
  }, [journeyLegId]);

  if (!matchState || matchState.loading) {
    return <Text>Loading matches...</Text>;
  }

  const removeFromList = (matchId: string) => {
    setMatchesForLeg(
      journeyLegId,
      matchState.data.filter((m) => m.id !== matchId)
    );
  };

  const handleSendRequest = async (item: any) => {
    await sendMatchRequest({
      senderJourneyLegId: journeyLegId,
      receiverId: item.journey.user.id,
      receiverJourneyLegId: item.id,
    });

    removeFromList(item.id);
  };

  const handleDismiss = async (item: any) => {
    await dismissPotentialMatch({
      senderJourneyLegId: journeyLegId,
      receiverId: item.journey.user.id,
      receiverJourneyLegId: item.id,
    });

    removeFromList(item.id);
  };

  return (
    <FlatList
      data={matchState.data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const dep = formatDateTime(item.departureTime);
        const arr = formatDateTime(item.arrivalTime);

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
            {/* Header */}
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {item.journey.user.firstName} {item.journey.user.lastName}
            </Text>

            <Text style={{ color: "#555", marginTop: 4 }}>
              {item.departureAirport} → {item.arrivalAirport}
            </Text>

            <Text style={{ color: "#777", marginTop: 4, fontSize: 13 }}>
              {dep.date} · {dep.time} → {arr.time}
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
                onPress={() => handleDismiss(item)}
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
                <Text style={{ color: "#555" }}>Not interested</Text>
              </Pressable>

              <Pressable
                onPress={() => handleSendRequest(item)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "#2563eb",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Send request
                </Text>
              </Pressable>
            </View>
          </View>
        );
      }}
    />
  );
}
