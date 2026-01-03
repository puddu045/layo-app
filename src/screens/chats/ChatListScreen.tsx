import { View, Text } from "react-native";
import { useJourneyStore } from "../../store/journey.store";

export default function ChatListScreen() {
  const activeJourney = useJourneyStore((s) => s.activeJourney);

  if (!activeJourney) {
    return <Text>Select a journey first</Text>;
  }

  return (
    <View>
      <Text>Chats for journey:</Text>
      <Text>{activeJourney.name}</Text>
    </View>
  );
}
