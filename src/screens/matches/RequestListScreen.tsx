import { Image, FlatList, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import { useRequestStore, RequestSummary } from "../../store/request.store";
import {
  fetchPendingRequestsByJourney,
  acceptMatch,
  rejectMatch,
} from "../../api/matches.api";
import { useAuthStore } from "../../store/auth.store";
import { UserMatchCard } from "../../components/UserMatchCard";
import { buildFlightText, buildLayoverText } from "../../utils/matchText";

/* ---------- Helpers ---------- */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLayoverMatches(senderLegs: any[], myLegs: any[]) {
  const layovers: {
    airport: string;
    overlapMinutes: number;
  }[] = [];

  for (let i = 0; i < senderLegs.length - 1; i++) {
    const sArriveLeg = senderLegs[i];
    const sNextLeg = senderLegs[i + 1];

    for (let j = 0; j < myLegs.length - 1; j++) {
      const mArriveLeg = myLegs[j];
      const mNextLeg = myLegs[j + 1];

      // Same layover airport
      if (
        sArriveLeg.arrivalAirport !== mArriveLeg.arrivalAirport ||
        sArriveLeg.arrivalAirport !== sNextLeg.departureAirport ||
        mArriveLeg.arrivalAirport !== mNextLeg.departureAirport
      ) {
        continue;
      }

      const senderArrive = new Date(sArriveLeg.arrivalTime).getTime();
      const senderDepart = new Date(sNextLeg.departureTime).getTime();

      const myArrive = new Date(mArriveLeg.arrivalTime).getTime();
      const myDepart = new Date(mNextLeg.departureTime).getTime();

      const overlapMs =
        Math.min(senderDepart, myDepart) - Math.max(senderArrive, myArrive);

      const overlapMinutes = Math.floor(overlapMs / 60000);

      if (overlapMinutes > 0) {
        layovers.push({
          airport: sArriveLeg.arrivalAirport,
          overlapMinutes,
        });
      }
    }
  }

  return layovers;
}

/* ---------- Screen ---------- */

export default function RequestListScreen({ route }: any) {
  const journeyId = route?.params?.journeyId;
  const currentUser = useAuthStore((s) => s.user);

  const requestState = useRequestStore((s) => s.requestsByJourneyId[journeyId]);

  const setRequestsForJourney = useRequestStore((s) => s.setRequestsForJourney);
  const setLoadingForJourney = useRequestStore((s) => s.setLoadingForJourney);
  const clearRequestsForJourney = useRequestStore(
    (s) => s.clearRequestsForJourney,
  );

  useEffect(() => {
    const load = async () => {
      setLoadingForJourney(journeyId, true);
      const data = await fetchPendingRequestsByJourney(journeyId);
      setRequestsForJourney(journeyId, data);
    };

    load();

    return () => {
      clearRequestsForJourney(journeyId);
    };
  }, [journeyId]);

  if (!requestState || requestState.loading) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        Loading requests...
      </Text>
    );
  }

  if (requestState.data.length === 0) {
    return (
      <Text style={{ textAlign: "center", marginTop: 40 }}>
        No pending requests
      </Text>
    );
  }

  /* ---------- Group requests per sender ---------- */

  type GroupedRequest = {
    user: RequestSummary["sender"];
    requests: RequestSummary[];
  };

  const requestMap = new Map<string, GroupedRequest>();

  requestState.data.forEach((req) => {
    const userId = req.sender.id;
    const existing = requestMap.get(userId);

    if (existing) {
      existing.requests.push(req);
    } else {
      requestMap.set(userId, {
        user: req.sender,
        requests: [req],
      });
    }
  });

  const groupedRequests = Array.from(requestMap.values());

  return (
    <FlatList
      data={groupedRequests}
      keyExtractor={(item) => item.user.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const { user, requests } = item;

        const senderLegs = requests.flatMap((r) => r.senderJourney.legs ?? []);
        const myLegs = requests[0].receiverJourney.legs ?? [];

        const flightTexts = senderLegs.map(
          (leg) => `${leg.flightNumber} on ${formatDate(leg.departureTime)}`,
        );

        const layovers = getLayoverMatches(senderLegs, myLegs);
        const layoverTexts = layovers.map(
          (l) => `${l.airport} airport (${l.overlapMinutes} min overlap)`,
        );

        return (
          <UserMatchCard
            user={user}
            primaryText={buildFlightText(flightTexts)}
            secondaryText={buildLayoverText(layoverTexts)}
            onAccept={async () => {
              await acceptMatch(requests[0].id);
              setRequestsForJourney(
                journeyId,
                requestState.data.filter((r) => r.sender.id !== user.id),
              );
            }}
            onReject={async () => {
              await rejectMatch(requests[0].id);
              setRequestsForJourney(
                journeyId,
                requestState.data.filter((r) => r.sender.id !== user.id),
              );
            }}
          />
        );
      }}
    />
  );
}
