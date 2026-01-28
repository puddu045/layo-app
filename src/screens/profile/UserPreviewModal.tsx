import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { URL_Backend } from "../../utils/backendURL";
import api from "../../api/client";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

type Props = {
  route: {
    params: {
      userId: string;
      matchId?: string;
    };
  };
  navigation: any;
};

type ImagePreviewData = {
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function UserPreviewModal({ route, navigation }: Props) {
  const { userId, matchId } = route.params;
  const avatarRef = useRef<View>(null);
  const [imagePreview, setImagePreview] = useState<ImagePreviewData | null>(
    null,
  );
  const { width: screenWidth } = useWindowDimensions();
  const CARD_SIZE = Math.min(screenWidth * 0.9, 600);

  const [user, setUser] = useState<any>(null);
  const [matchInfo, setMatchInfo] = useState<any>(null);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  }

  useEffect(() => {
    loadProfile();
    if (matchId) loadMatchContext();
  }, []);

  const loadProfile = async () => {
    const res = await api.get(`/users/${userId}/profile`);
    setUser(res.data);
  };

  const loadMatchContext = async () => {
    const res = await api.get(`/matches/${matchId}`);

    setMatchInfo(res.data);
  };

  if (!user) {
    return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  }

  const profile = user.profile;
  //   console.log(profile);

  const age = profile?.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(profile.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      )
    : null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Avatar */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          {profile?.profilePhotoUrl ? (
            <Pressable
              ref={avatarRef}
              onPress={() => {
                const uri = `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`;

                avatarRef.current?.measureInWindow((x, y, width, height) => {
                  setImagePreview({
                    uri,
                    x,
                    y,
                    width,
                    height,
                  });
                });
              }}
            >
              <View
                style={{
                  width: 110,
                  height: 140, // taller than wide = airplane window feel
                  borderRadius: 50,
                  backgroundColor: "#e5e7eb", // outer frame
                  padding: 6,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 48,
                    backgroundColor: "#fff",
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 3,
                  }}
                >
                  <Image
                    source={{
                      uri: `${URL_Backend}${profile.profilePhotoUrl}?v=${profile.updatedAt}`,
                    }}
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </View>
              </View>
            </Pressable>
          ) : (
            <Ionicons name="person-circle-outline" size={120} color="#ccc" />
          )}
        </View>

        {/* Name */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {user.firstName} {user.lastName}
        </Text>

        {/* Meta */}
        {(age || profile?.gender || profile?.city) && (
          <Text
            style={{
              marginTop: 6,
              color: "#666",
              textAlign: "center",
            }}
          >
            {[
              age && `${age}`,
              profile?.gender,
              profile?.city && profile?.nationality
                ? `${profile.city}, ${profile.nationality}`
                : profile?.city,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        )}

        {/* Match context */}
        {matchInfo && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontWeight: "600", marginBottom: 8 }}>
              How you matched
            </Text>

            {matchInfo.sameFlights.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="airplane"
                  size={14}
                  color="#555"
                  style={{ marginRight: 6, transform: [{ rotate: "-45deg" }] }}
                />

                <Text>
                  Travels with you on{" "}
                  {matchInfo.sameFlights
                    .map((f: any) => {
                      const d = new Date(f.departureTime);
                      const date = d.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      });
                      return `${f.flightNumber} (${date})`;
                    })
                    .join(" and ")}
                </Text>
              </View>
            )}

            {matchInfo.layovers.length > 0 && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="airplane"
                    size={14}
                    color="#555"
                    style={{ marginRight: 6 }}
                  />
                  {matchInfo.layovers.map((l: any, i: number) => (
                    <Text key={`layover-${i}`}>
                      Shares Layover with you at {l.airport} for{" "}
                      {l.overlapMinutes} min
                    </Text>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Actions */}
        <View style={{ marginTop: 32 }}>
          <Pressable
            style={{
              padding: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
              marginBottom: 12,
            }}
          >
            <Text style={{ textAlign: "center", color: "red" }}>
              Block user
            </Text>
          </Pressable>

          <Pressable
            style={{
              padding: 14,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <Text style={{ textAlign: "center" }}>Report user</Text>
          </Pressable>
        </View>
      </ScrollView>
      {imagePreview && (
        <>
          {/* Backdrop */}
          <Pressable
            onPress={() => setImagePreview(null)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
            }}
          >
            <BlurView
              intensity={85}
              tint="dark"
              style={{
                flex: 1,
              }}
            />
          </Pressable>

          {/* Pop-out card */}
          <View
            style={{
              position: "absolute",
              top: imagePreview.y + imagePreview.height + 24,
              left: (screenWidth - CARD_SIZE) / 2,
              width: CARD_SIZE,
              height: CARD_SIZE,
              backgroundColor: "#fff",
              borderRadius: 14,
              overflow: "hidden",
              zIndex: 100,
              elevation: 12, // Android
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 8,
            }}
          >
            <Image
              source={{ uri: imagePreview.uri }}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
