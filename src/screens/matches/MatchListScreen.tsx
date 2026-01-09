import { FlatList, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import { useMatchStore } from "../../store/match.store";
import {
  fetchMatchesByJourney,
  sendMatchRequest,
  dismissPotentialMatch,
} from "../../api/matches.api";

export default function MatchListScreen({ route }: any) {
  const journeyId = route?.params?.journeyId;

  const { sameFlightMatches, layoverMatches, loading, setMatches, setLoading } =
    useMatchStore();

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
      setLoading(true);
      const data = await fetchMatchesByJourney(journeyId);
      setMatches(data);
    };

    load();
  }, [journeyId]);

  if (loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        Loading matches...
      </Text>
    );
  }

  /* ---------- Merge matches per user ---------- */

  type UnifiedMatch = {
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
    sameFlights: any[];
    layovers: any[];
  };

  const matchMap = new Map<string, UnifiedMatch>();

  // Same-flight matches → use otherUser
  sameFlightMatches.forEach((m) => {
    const userId = m.otherUser.id;
    const existing = matchMap.get(userId);

    if (existing) {
      existing.sameFlights.push(m);
    } else {
      matchMap.set(userId, {
        user: m.otherUser,
        sameFlights: [m],
        layovers: [],
      });
    }
  });

  // Layover matches → use user (unchanged structure)
  layoverMatches.forEach((m) => {
    const userId = m.user.id;
    const existing = matchMap.get(userId);

    if (existing) {
      existing.layovers.push(m);
    } else {
      matchMap.set(userId, {
        user: m.user,
        sameFlights: [],
        layovers: [m],
      });
    }
  });

  const unifiedMatches = Array.from(matchMap.values());

  if (unifiedMatches.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        No matches found
      </Text>
    );
  }

  const removeUserFromMatches = (userId: string) => {
    useMatchStore.getState().setMatches({
      sameFlightMatches: sameFlightMatches.filter(
        (m) => m.otherUser.id !== userId
      ),
      layoverMatches: layoverMatches.filter((m) => m.user.id !== userId),
    });
  };

  const handleSendRequest = async (item: UnifiedMatch) => {
    const receiverJourneyId =
      item.sameFlights[0]?.otherJourneyLeg.journeyId ??
      item.layovers[0]?.leg.journeyId;

    await sendMatchRequest({
      senderJourneyId: journeyId,
      receiverId: item.user.id,
      receiverJourneyId,
    });

    removeUserFromMatches(item.user.id);
  };

  const handleDismiss = async (item: UnifiedMatch) => {
    const receiverJourneyId =
      item.sameFlights[0]?.otherJourneyLeg.journeyId ??
      item.layovers[0]?.leg.journeyId;

    await dismissPotentialMatch({
      senderJourneyId: journeyId,
      receiverId: item.user.id,
      receiverJourneyId,
    });

    removeUserFromMatches(item.user.id);
  };

  return (
    <FlatList
      data={unifiedMatches}
      keyExtractor={(item) => item.user.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const { user, sameFlights, layovers } = item;

        const flightDescriptions = sameFlights.map((m) => {
          const leg = m.otherJourneyLeg;
          const dep = formatDateTime(leg.departureTime);
          return `${leg.flightNumber} on ${dep.date}`;
        });

        const flightsText =
          flightDescriptions.length === 1
            ? flightDescriptions[0]
            : flightDescriptions.slice(0, -1).join(", ") +
              " and " +
              flightDescriptions[flightDescriptions.length - 1];

        const layoverDescriptions = layovers.map(
          (m) => `${m.arrivalAirport} airport (${m.overlapMinutes} min overlap)`
        );
        const layoverLabel =
          layovers.length === 1
            ? "Has a layover with you at"
            : "Has layovers with you at";

        const layoversText =
          layoverDescriptions.length === 1
            ? layoverDescriptions[0]
            : layoverDescriptions.slice(0, -1).join(", ") +
              " and " +
              layoverDescriptions[layoverDescriptions.length - 1];

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
              {user.firstName} {user.lastName}
            </Text>

            {/* Same flight matches */}
            {sameFlights.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "500", color: "#333" }}>
                  Flying with you on {flightsText}
                </Text>
              </View>
            )}

            {/* Layover matches */}
            {layovers.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "500", color: "#333" }}>
                  {layoverLabel} {layoversText}
                </Text>
              </View>
            )}

            {/* Actions */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 14,
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
