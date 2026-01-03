import { Text } from "react-native";
import { useJourneyStore } from "../../store/journey.store";

export default function MatchListScreen() {
  const journey = useJourneyStore((s) => s.activeJourney);

  if (!journey) {
    return <Text>Select a journey first</Text>;
  }

  return <Text>Matches for {journey.name}</Text>;
}
