import { Image, FlatList, Text, View, Pressable } from "react-native";
import { useEffect } from "react";
import { useRequestStore, RequestSummary } from "../../store/request.store";
import {
  fetchPendingRequestsByJourney,
  acceptMatch,
  rejectMatch,
} from "../../api/matches.api";
import { useAuthStore } from "../../store/auth.store";
import { URL_Backend } from "../../utils/backendURL";

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
        console.log("REQUEST ITEM DEBUG", JSON.stringify(item, null, 2));

        const { user, requests } = item;

        /* ---------- Collect legs ---------- */

        const senderLegs = requests.flatMap((r) => r.senderJourney.legs ?? []);

        const myLegs = requests[0].receiverJourney.legs ?? [];

        /* ---------- Same-flight text ---------- */

        const flightDescriptions = senderLegs.map((leg) => {
          return `${leg.flightNumber} on ${formatDate(leg.departureTime)}`;
        });

        const flightsText =
          flightDescriptions.length === 1
            ? flightDescriptions[0]
            : flightDescriptions.slice(0, -1).join(", ") +
              " and " +
              flightDescriptions[flightDescriptions.length - 1];

        /* ---------- Layover matches ---------- */

        const layovers = getLayoverMatches(senderLegs, myLegs);

        const layoverDescriptions = layovers.map(
          (l) => `${l.airport} airport (${l.overlapMinutes} min overlap)`,
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
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Avatar + name */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {user.profile.profilePhotoUrl ? (
                  <Image
                    source={{
                      uri: `${URL_Backend}${user.profile.profilePhotoUrl}`,
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "#e5e7eb",
                      marginRight: 12,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "#e5e7eb",
                      marginRight: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "600", color: "#555" }}>
                      {user.firstName[0]}
                      {user.lastName?.[0] ?? ""}
                    </Text>
                  </View>
                )}

                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {user.firstName} {user.lastName}
                </Text>
              </View>

              {/* Actions */}
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={async () => {
                    await rejectMatch(requests[0].id);
                    setRequestsForJourney(
                      journeyId,
                      requestState.data.filter((r) => r.sender.id !== user.id),
                    );
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#fee2e2",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#dc2626",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    ✕
                  </Text>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    await acceptMatch(requests[0].id);
                    setRequestsForJourney(
                      journeyId,
                      requestState.data.filter((r) => r.sender.id !== user.id),
                    );
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#dcfce7",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#16a34a",
                      fontSize: 18,
                      fontWeight: "700",
                    }}
                  >
                    ✓
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Same-flight info */}
            {senderLegs.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "500", color: "#333" }}>
                  Flying with you on {flightsText}
                </Text>
              </View>
            )}

            {/* Layover info */}
            {layovers.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "500", color: "#333" }}>
                  {layoverLabel} {layoversText}
                </Text>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
