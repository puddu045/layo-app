import {
  View,
  Text,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { useJourneyStore } from "../../store/journey.store";
import { getJourneysForUser } from "../../api/journeys.api";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";

export default function JourneyListScreen({ navigation }: any) {
  const { journeys, setJourneys, setLoading } = useJourneyStore();

  const loadJourneys = async () => {
    try {
      setLoading(true);
      const data = await getJourneysForUser();
      setJourneys(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadJourneys();
    }, []),
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

  function formatLayover(minutes: number | null) {
    if (!minutes) return "";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f6f8", marginTop: 20 }}
    >
      <FlatList
        data={journeys}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const legs = [...item.legs].sort((a, b) => a.sequence - b.sequence);

          return (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Pressable
                onPress={() =>
                  navigation.navigate("JourneyTabs", {
                    journeyId: item.id,
                  })
                }
                style={{
                  width: "92%",
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  paddingVertical: 8,
                  elevation: 3,
                }}
              >
                {legs.map((leg, index) => {
                  const isLastLeg = index === legs.length - 1;
                  const nextLeg = !isLastLeg ? legs[index + 1] : null;

                  const dep = formatDateTime(leg.departureTime);
                  const arr = formatDateTime(leg.arrivalTime);

                  return (
                    <View
                      key={leg.id}
                      style={{
                        margin: 10,
                      }}
                    >
                      {/* Timeline column */}
                      <View
                        style={{
                          width: 28,
                          alignItems: "center",
                        }}
                      ></View>

                      {/* Content column */}
                      <View style={{ flex: 1 }}>
                        {/* Leg card */}
                        <View
                          style={{
                            backgroundColor: "#f9fafb",
                            borderRadius: 12,
                            padding: 14,
                            elevation: 1,
                          }}
                        >
                          <Text style={{ fontSize: 15, fontWeight: "600" }}>
                            Flight Number : {leg.flightNumber}
                          </Text>

                          <Text style={{ marginTop: 4 }}>
                            {leg.departureAirport} → {leg.arrivalAirport}
                          </Text>

                          <Text
                            style={{
                              marginTop: 2,
                              color: "#666",
                              fontSize: 13,
                            }}
                          >
                            {dep.date} · {dep.time}
                          </Text>

                          <Text style={{ color: "#666", fontSize: 13 }}>
                            {arr.date} · {arr.time}
                          </Text>
                        </View>

                        {/* Layover card */}
                        {!isLastLeg && nextLeg && (
                          <View
                            style={{
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
                              Layover at {leg.arrivalAirport}
                            </Text>

                            <Text
                              style={{
                                fontSize: 13,
                                color: "#64748b",
                                marginTop: 2,
                              }}
                            >
                              Duration: {formatLayover(leg.layoverMinutes)}
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
                    </View>
                  );
                })}
              </Pressable>
            </View>
          );
        }}
      />

      {/* Add Journey */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("AddJourney")}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            elevation: 4,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            + Add Journey
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
