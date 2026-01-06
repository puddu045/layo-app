import { View, Text, FlatList, Pressable } from "react-native";
import { useJourneyStore } from "../../store/journey.store";
import { getJourneysForUser } from "../../api/journeys.api";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "../../store/auth.store";
import { logoutApi } from "../../api/auth.api";

export default function JourneyListScreen({ navigation }: any) {
  const { journeys, setJourneys, setActiveJourney, setLoading } =
    useJourneyStore();

  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function logout() {
    clearAuth();
    await logoutApi();
  }

  const loadJourneys = async () => {
    try {
      setLoading(true);
      const data = await getJourneysForUser();
      setJourneys(data);
    } finally {
      setLoading(false);
    }
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
    loadJourneys();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadJourneys();
    }, [])
  );

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
        <Text style={{ fontSize: 20, fontWeight: "600" }}>My Journeys</Text>

        <Pressable onPress={logout}>
          <Text style={{ color: "#b91c1c", fontWeight: "500" }}>Logout</Text>
        </Pressable>
      </View>

      {/* Journey list */}
      <FlatList
        data={journeys}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const dep = formatDateTime(item.departureTime);
          const arr = formatDateTime(item.arrivalTime);

          return (
            <Pressable
              onPress={() => {
                setActiveJourney(item);
                navigation.navigate("JourneyLeg");
              }}
              style={{
                flexDirection: "row",
                padding: 14,
                marginBottom: 12,
                backgroundColor: "#fff",
                borderRadius: 12,
                elevation: 2,
              }}
            >
              {/* Airplane window icon */}
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

              {/* Journey details */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {item.departureAirport} → {item.arrivalAirport}
                </Text>

                <Text style={{ color: "#666", marginTop: 4, fontSize: 13 }}>
                  {dep.date} · {dep.time}
                </Text>

                <Text style={{ color: "#666", marginTop: 2, fontSize: 13 }}>
                  {arr.date} · {arr.time}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Add Journey button */}
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
            backgroundColor: "#2563eb",
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
    </View>
  );
}
