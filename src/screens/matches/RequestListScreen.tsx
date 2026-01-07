import { FlatList, Text, View, Pressable } from "react-native";
import { fetchPendingRequestsByJourneyLeg } from "../../api/matches.api";
import { acceptMatch, rejectMatch } from "../../api/matches.api";
import { useEffect } from "react";
import { useRequestStore } from "../../store/request.store";

export default function RequestListScreen({ navigation, route }: any) {
  const journeyLegId = route?.params?.journeyLegId;
  const requestState = useRequestStore((s) => s.requestsByLegId[journeyLegId]);
  const setRequestsForLeg = useRequestStore((s) => s.setRequestsForLeg);
  const setLoadingForLeg = useRequestStore((s) => s.setLoadingForLeg);

  const removeFromList = (matchId: string) => {
    setRequestsForLeg(
      journeyLegId,
      requestState.data.filter((r) => r.id !== matchId)
    );
  };

  const handleAccept = async (item: any) => {
    await acceptMatch(item.id);
    removeFromList(item.id);
  };

  const handleReject = async (item: any) => {
    await rejectMatch(item.id);
    removeFromList(item.id);
  };

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
      const data = await fetchPendingRequestsByJourneyLeg(journeyLegId);
      setRequestsForLeg(journeyLegId, data);
    };

    load();
  }, [journeyLegId]);

  if (!requestState || requestState.loading) {
    return <Text>Loading matches...</Text>;
  }

  return (
    <FlatList
      data={requestState.data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const dep = formatDateTime(item.senderJourneyLeg.departureTime);
        const arr = formatDateTime(item.senderJourneyLeg.arrivalTime);

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
              {item.sender.firstName} {item.sender.lastName}
            </Text>

            <Text style={{ color: "#555", marginTop: 4 }}>
              {item.senderJourneyLeg.departureAirport} →{" "}
              {item.senderJourneyLeg.arrivalAirport}
            </Text>

            <Text style={{ color: "#777", marginTop: 4, fontSize: 13 }}>
              {dep.date} · {dep.time} → {arr.time}
            </Text>

            {/* Actions (only for pending) */}
            {item.status === "PENDING" && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  justifyContent: "space-between",
                }}
              >
                <Pressable
                  onPress={() => handleReject(item)}
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
                  onPress={() => handleAccept(item)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "#16a34a",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Accept
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
