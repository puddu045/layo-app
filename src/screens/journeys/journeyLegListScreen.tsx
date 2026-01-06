import { Text, FlatList, Pressable, View } from "react-native";
import { useJourneyStore } from "../../store/journey.store";
import { useAuthStore } from "../../store/auth.store";
import { logoutApi } from "../../api/auth.api";

export default function JourneyLegListScreen({ navigation }: any) {
  const { activeJourney } = useJourneyStore();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (!activeJourney) return null;

  const legs = [...activeJourney.legs].sort((a, b) => a.sequence - b.sequence);

  async function logout() {
    clearAuth();
    await logoutApi();
  }

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

  function formatLayover(minutes: number | null) {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Journey Legs</Text>

        <Pressable onPress={logout}>
          <Text style={{ color: "#b91c1c", fontWeight: "500" }}>Logout</Text>
        </Pressable>
      </View>

      {/* Centered journey card */}
      <View style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            width: "92%",
            backgroundColor: "#fff",
            borderRadius: 16,
            paddingVertical: 8,
            elevation: 3,
          }}
        >
          <FlatList
            data={legs}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              const isLastLeg = index === legs.length - 1;
              const nextLeg = !isLastLeg ? legs[index + 1] : null;

              const dep = formatDateTime(item.departureTime);
              const arr = formatDateTime(item.arrivalTime);

              return (
                <View>
                  {/* Leg sub-card */}
                  <Pressable
                    onPress={() =>
                      navigation.navigate("JourneyTabs", {
                        journeyLegId: item.id,
                      })
                    }
                    style={{
                      flexDirection: "row",
                      padding: 14,
                      marginHorizontal: 12,
                      marginTop: 12,
                      backgroundColor: "#f9fafb",
                      borderRadius: 12,
                      elevation: 1,
                    }}
                  >
                    {/* Timeline */}
                    <View
                      style={{
                        width: 24,
                        alignItems: "center",
                        marginRight: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#2563eb",
                          marginTop: 6,
                        }}
                      />
                      {!isLastLeg && (
                        <View
                          style={{
                            flex: 1,
                            width: 1,
                            borderStyle: "dotted",
                            borderWidth: 1,
                            borderColor: "#cbd5e1",
                            marginTop: 4,
                          }}
                        />
                      )}
                    </View>

                    {/* Leg content */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: "600" }}>
                        {item.flightNumber}
                      </Text>

                      <Text style={{ marginTop: 4 }}>
                        {item.departureAirport} → {item.arrivalAirport}
                      </Text>

                      <Text
                        style={{ marginTop: 2, color: "#666", fontSize: 13 }}
                      >
                        {dep.date} · {dep.time}
                      </Text>

                      <Text style={{ color: "#666", fontSize: 13 }}>
                        {arr.date} · {arr.time}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Layover sub-card */}
                  {!isLastLeg && nextLeg && (
                    <View
                      style={{
                        marginHorizontal: 32,
                        marginTop: 8,
                        padding: 12,
                        backgroundColor: "#eef2f7",
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "600",
                          color: "#475569",
                        }}
                      >
                        Layover at {item.arrivalAirport}
                      </Text>

                      <Text
                        style={{
                          fontSize: 13,
                          color: "#64748b",
                          marginTop: 2,
                        }}
                      >
                        Duration: {formatLayover(item.layoverMinutes)}
                      </Text>

                      <Text
                        style={{
                          fontSize: 12,
                          color: "#64748b",
                          marginTop: 4,
                        }}
                      >
                        Next flight departs at{" "}
                        {formatDateTime(nextLeg.departureTime).time}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}
