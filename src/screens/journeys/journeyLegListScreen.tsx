import { Text, FlatList, Pressable } from "react-native";
import { useJourneyStore } from "../../store/journey.store";

export default function JourneyLegListScreen({ navigation }: any) {
  const { activeJourney } = useJourneyStore();
  if (!activeJourney) return;

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

  return (
    <FlatList
      data={[...activeJourney.legs].sort((a, b) => a.sequence - b.sequence)}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            navigation.navigate("JourneyTabs", {
              journeyLegId: item.id,
            });
          }}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}
        >
          {/* Flight number */}
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {item.flightNumber}
          </Text>

          {/* Route */}
          <Text style={{ marginTop: 4 }}>
            {item.departureAirport} → {item.arrivalAirport}
          </Text>

          {/* Times */}
          <Text style={{ marginTop: 2, color: "#666" }}>
            {formatDateTime(item.departureTime).date}{" "}
            {formatDateTime(item.departureTime).time} –{" "}
            {formatDateTime(item.arrivalTime).date}{" "}
            {formatDateTime(item.arrivalTime).time}
          </Text>
        </Pressable>
      )}
    />
  );
}
