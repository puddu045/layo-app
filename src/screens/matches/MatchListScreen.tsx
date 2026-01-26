import { Image, FlatList, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import { useMatchStore, User } from "../../store/match.store";
import {
  fetchMatchesByJourney,
  sendMatchRequest,
  dismissPotentialMatch,
} from "../../api/matches.api";
import { UserMatchCard } from "../../components/UserMatchCard";
import { buildFlightText, buildLayoverText } from "../../utils/matchText";

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
    user: User;
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
        (m) => m.otherUser.id !== userId,
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

        const flightTexts = sameFlights.map((m) => {
          const d = formatDateTime(m.otherJourneyLeg.departureTime);
          return `${m.otherJourneyLeg.flightNumber} on ${d.date}`;
        });

        const layoverTexts = layovers.map(
          (m) =>
            `${m.arrivalAirport} airport (${m.overlapMinutes} min overlap)`,
        );

        return (
          <UserMatchCard
            user={user}
            primaryText={buildFlightText(flightTexts)}
            secondaryText={buildLayoverText(layoverTexts)}
            onAccept={() => handleSendRequest(item)}
            onReject={() => handleDismiss(item)}
          />
        );
      }}
    />
  );
}
