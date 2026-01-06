import { FlatList, Text, View } from "react-native";
import { fetchPendingRequestsByJourneyLeg } from "../../api/matches.api";
import { useEffect } from "react";
import { useRequestStore } from "../../store/request.store";

export default function RequestListScreen({ navigation, route }: any) {
  const journeyLegId = route?.params?.journeyLegId;
  const requestState = useRequestStore((s) => s.requestsByLegId[journeyLegId]);
  const setRequestsForLeg = useRequestStore((s) => s.setRequestsForLeg);
  const setLoadingForLeg = useRequestStore((s) => s.setLoadingForLeg);

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
              flexDirection: "row",
              padding: 14,
              marginBottom: 12,
              backgroundColor: "#fff",
              borderRadius: 12,
              elevation: 2,
            }}
          >
            {/* Airplane window profile slot */}
            <View
              style={{
                width: 52,
                height: 70,
                borderRadius: 26,
                backgroundColor: "#e6eef7",
                marginRight: 12,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#c9d8eb",
              }}
            >
              <Text style={{ fontSize: 18 }}>✈️</Text>
            </View>

            {/* Request details */}
            <View style={{ flex: 1 }}>
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

              {/* Status */}
              <Text
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: "500",
                  color:
                    item.status === "PENDING"
                      ? "#d97706"
                      : item.status === "ACCEPTED"
                      ? "#15803d"
                      : "#b91c1c",
                }}
              >
                {item.status}
              </Text>
            </View>
          </View>
        );
      }}
    />
  );
}
