import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Platform,
} from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AirportAutocomplete from "../../components/AirportAutocomplete";
import { createJourney } from "../../api/journeys.api";
import { SafeAreaView } from "react-native-safe-area-context";

type Leg = {
  sequence: number;
  flightNumber: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
  arrivalTime?: string;
};

type PickerState = {
  index: number;
  field: "departureTime" | "arrivalTime";
  mode: "date" | "time";
  tempDate: Date;
};

export default function AddJourneyScreen({ navigation }: any) {
  const [legs, setLegs] = useState<Leg[]>([
    {
      sequence: 1,
      flightNumber: "",
    },
  ]);

  const [pickerState, setPickerState] = useState<PickerState | null>(null);

  /* ---------------- helpers ---------------- */

  const addLeg = () => {
    setLegs((prev) => [
      ...prev,
      {
        sequence: prev.length + 1,
        flightNumber: "",
      },
    ]);
  };

  const removeLeg = (index: number) => {
    setLegs((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((l, i) => ({ ...l, sequence: i + 1 }))
    );
  };

  async function submit() {
    const payload = {
      journeyType: legs.length > 1 ? "LAYOVER" : "DIRECT",
      legs: legs.map((l) => ({
        sequence: l.sequence,
        flightNumber: l.flightNumber,
        departureAirport: l.departureAirport,
        arrivalAirport: l.arrivalAirport,
        departureTime: l.departureTime,
        arrivalTime: l.arrivalTime,
      })),
    };

    await createJourney(payload);
    navigation.goBack();
  }

  /* ---------------- styles ---------------- */

  const styles = {
    card: {
      backgroundColor: "#fff",
      borderRadius: 14,
      padding: 16,
      marginTop: 20,
      elevation: 2,
    },
    label: {
      fontSize: 12,
      color: "#555",
      marginTop: 12,
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingVertical: 6,
      fontSize: 14,
    },
    pickerButton: {
      marginTop: 8,
      padding: 12,
      borderRadius: 8,
      backgroundColor: "#f1f5f9",
    },
    pickerText: {
      fontSize: 14,
      color: "#111",
    },
  };

  /* ---------------- render ---------------- */

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6f8" }}>
        <FlatList
          data={legs}
          keyExtractor={(item) => item.sequence.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 160 }}
          ListHeaderComponent={
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                Add Journey
              </Text>
              <Text style={{ color: "#666", marginTop: 4 }}>
                Add each flight leg in order
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {legs.length > 1 && (
                  <Text style={{ fontWeight: "600", fontSize: 16 }}>
                    Leg {item.sequence}
                  </Text>
                )}

                {index > 0 && (
                  <Pressable onPress={() => removeLeg(index)}>
                    <Text style={{ color: "#dc2626", fontSize: 13 }}>
                      Remove
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Flight number */}
              <Text style={styles.label}>Flight number</Text>
              <TextInput
                placeholder="e.g. AI205"
                value={item.flightNumber}
                onChangeText={(v) => {
                  const copy = [...legs];
                  copy[index].flightNumber = v;
                  setLegs(copy);
                }}
                style={styles.input}
              />

              {/* Airports */}
              <Text style={styles.label}>Departure airport</Text>
              <AirportAutocomplete
                placeholder="Search airport"
                onSelect={(a) => {
                  const copy = [...legs];
                  copy[index].departureAirport = a.iata;
                  setLegs(copy);
                }}
              />

              <Text style={styles.label}>Arrival airport</Text>
              <AirportAutocomplete
                placeholder="Search airport"
                onSelect={(a) => {
                  const copy = [...legs];
                  copy[index].arrivalAirport = a.iata;
                  setLegs(copy);
                }}
              />

              {/* Departure time */}
              <Text style={styles.label}>Departure date & time</Text>
              <Pressable
                style={styles.pickerButton}
                onPress={() =>
                  setPickerState({
                    index,
                    field: "departureTime",
                    mode: "date",
                    tempDate: new Date(),
                  })
                }
              >
                <Text style={styles.pickerText}>
                  {item.departureTime
                    ? new Date(item.departureTime).toLocaleString()
                    : "Select date & time"}
                </Text>
              </Pressable>

              {/* Arrival time */}
              <Text style={styles.label}>Arrival date & time</Text>
              <Pressable
                style={styles.pickerButton}
                onPress={() =>
                  setPickerState({
                    index,
                    field: "arrivalTime",
                    mode: "date",
                    tempDate: new Date(),
                  })
                }
              >
                <Text style={styles.pickerText}>
                  {item.arrivalTime
                    ? new Date(item.arrivalTime).toLocaleString()
                    : "Select date & time"}
                </Text>
              </Pressable>
            </View>
          )}
          ListFooterComponent={
            <View style={{ marginTop: 32 }}>
              <Pressable
                onPress={addLeg}
                style={{
                  borderWidth: 1,
                  borderColor: "#2563eb",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: "#2563eb",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  + Add another leg
                </Text>
              </Pressable>

              <Pressable
                onPress={submit}
                style={{
                  backgroundColor: "#2563eb",
                  padding: 14,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Save Journey
                </Text>
              </Pressable>
            </View>
          }
        />

        {/* Date → Time picker (Android-safe) */}
        {pickerState && (
          <DateTimePicker
            value={pickerState.tempDate}
            mode={pickerState.mode}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selected) => {
              if (!selected) {
                setPickerState(null);
                return;
              }

              // Step 1: date selected → open time picker
              if (pickerState.mode === "date") {
                setPickerState({
                  ...pickerState,
                  mode: "time",
                  tempDate: selected,
                });
                return;
              }

              // Step 2: time selected → merge date + time
              const finalDate = new Date(pickerState.tempDate);
              finalDate.setHours(selected.getHours());
              finalDate.setMinutes(selected.getMinutes());

              const copy = [...legs];
              copy[pickerState.index][pickerState.field] =
                finalDate.toISOString();

              setLegs(copy);
              setPickerState(null);
            }}
          />
        )}
      </SafeAreaView>
    </>
  );
}
