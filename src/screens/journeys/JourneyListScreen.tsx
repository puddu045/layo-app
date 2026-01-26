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
import airports from "../../../assets/airports_data_new.json";
import { Ionicons } from "@expo/vector-icons";

type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
};

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

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString([], {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function diffMinutes(start: string, end: string) {
    return Math.floor(
      (new Date(end).getTime() - new Date(start).getTime()) / 60000,
    );
  }

  function formatDuration(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}`;
  }

  function getAirportName(iata?: string) {
    if (!iata) return "";
    const airport = (airports as Airport[]).find((a) => a.iata === iata);
    if (!airport) return "";
    return airport.name;
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
          const firstLeg = legs[0];
          const lastLeg = legs[legs.length - 1];
          const totalMinutes = diffMinutes(
            firstLeg.departureTime,
            lastLeg.arrivalTime,
          );
          const stopsCount = legs.length - 1;

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
                  padding: 16,
                  elevation: 3,
                }}
              >
                {/* ===== HEADER ===== */}
                <View style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      {formatTime(firstLeg.departureTime)}
                    </Text>
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ fontSize: 12, color: "#6b7280" }}>
                        {formatDuration(totalMinutes)}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.primary,
                          marginTop: 2,
                        }}
                      >
                        {stopsCount} stop{stopsCount !== 1 ? "s" : ""}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>
                      {formatTime(lastLeg.arrivalTime)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        marginRight: 8,
                      }}
                    >
                      {firstLeg.departureAirport}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          height: 1,
                          backgroundColor: "#cbd5e1",
                        }}
                      />
                      <Ionicons
                        name="airplane"
                        size={20}
                        color={colors.primary}
                        style={{
                          marginHorizontal: 8,
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          height: 1,
                          backgroundColor: "#cbd5e1",
                        }}
                      />
                    </View>
                    <Text
                      style={{ fontSize: 13, fontWeight: "600", marginLeft: 8 }}
                    >
                      {lastLeg.arrivalAirport}
                    </Text>
                  </View>
                </View>

                {/* ===== TIMELINE ===== */}
                {legs.map((leg, index) => {
                  const isLastLeg = index === legs.length - 1;
                  const legDuration = diffMinutes(
                    leg.departureTime,
                    leg.arrivalTime,
                  );

                  return (
                    <View key={leg.id}>
                      {/* Departure Row */}
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ width: 24, alignItems: "center" }}>
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#94a3b8",
                              marginTop: 6,
                            }}
                          />
                          {/* Line starts HERE and goes down to the arrival dot */}
                          <View
                            style={{
                              width: 1,
                              flex: 1,
                              backgroundColor: "#cbd5e1",
                            }}
                          />
                        </View>

                        <View style={{ flex: 1, paddingBottom: 4 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: "600" }}>
                              {formatTime(leg.departureTime)}{" "}
                              {leg.departureAirport}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#6b7280",
                                marginLeft: 6,
                              }}
                            >
                              {getAirportName(leg.departureAirport)}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginVertical: 8,
                            }}
                          >
                            <Ionicons
                              name="time"
                              size={14}
                              color={colors.primary}
                              style={{
                                marginRight: 4,
                                marginTop: 2,
                              }}
                            />
                            <Text style={{ fontSize: 12, color: "#6b7280" }}>
                              {formatDuration(legDuration)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Arrival Row */}
                      <View style={{ flexDirection: "row" }}>
                        <View style={{ width: 24, alignItems: "center" }}>
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#94a3b8",
                              marginTop: 6,
                            }}
                          />
                          {/* Line explicitly STOPPED here. No line below this dot. */}
                        </View>

                        <View style={{ flex: 1, paddingBottom: 10 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: "600" }}>
                              {formatTime(leg.arrivalTime)} {leg.arrivalAirport}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                color: "#6b7280",
                                marginLeft: 6,
                              }}
                            >
                              {getAirportName(leg.arrivalAirport)}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Layover (No vertical lines here) */}
                      {!isLastLeg && leg.layoverMinutes && (
                        <View
                          style={{ alignItems: "center", marginVertical: 12 }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              backgroundColor: "#f1f5f9",
                              paddingHorizontal: 12,
                              paddingVertical: 10,
                              borderRadius: 10,
                            }}
                          >
                            <Ionicons
                              name="time-outline"
                              size={14}
                              color={colors.primary}
                              style={{
                                marginRight: 6,
                                marginTop: 2,
                              }}
                            />
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "600",
                                color:
                                  leg.layoverMinutes > 240
                                    ? colors.primary
                                    : "#475569",
                              }}
                            >
                              {formatDuration(leg.layoverMinutes)} connect
                              {leg.layoverMinutes > 240 ? " · Long wait" : ""}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}

                {/* Footer */}
                <Text style={{ fontSize: 12, color: "#64748b", marginTop: 12 }}>
                  Arrives: {formatDate(lastLeg.arrivalTime)} · Journey duration{" "}
                  {formatDuration(totalMinutes)}
                </Text>
              </Pressable>
            </View>
          );
        }}
      />

      {/* Add Journey */}
      <View style={{ position: "absolute", bottom: 20, alignSelf: "center" }}>
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
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            + Add Journey
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
