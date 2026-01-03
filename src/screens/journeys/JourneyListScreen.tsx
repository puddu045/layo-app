import { View, Text, Button, FlatList, Pressable } from "react-native";
import { useJourneyStore } from "../../store/journey.store";
import { getJourneysForUser } from "../../api/journeys.api";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "../../store/auth.store";
import { logoutApi } from "../../api/auth.api";

export default function JourneyListScreen({ navigation }: any) {
  const { journeys, setJourneys, setActiveJourney, loading, setLoading } =
    useJourneyStore();

  const cleartAuth = useAuthStore((s) => s.clearAuth);
  async function logout() {
    cleartAuth();
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
    <View>
      <FlatList
        data={journeys}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              setActiveJourney(item);
              navigation.navigate("JourneyLeg");
            }}
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#e0e0e0",
            }}
          >
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
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
