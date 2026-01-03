import { View, Text, Button, FlatList } from "react-native";
import { useJourneyStore } from "../../store/journey.store";

export default function JourneyListScreen({ navigation }: any) {
  const { journeys, setActiveJourney } = useJourneyStore();

  const data = journeys.length
    ? journeys
    : [
        { id: "1", name: "London → New York" },
        { id: "2", name: "London → NewCastle" },
      ];

  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <Button
          title={item.name}
          onPress={() => {
            setActiveJourney(item);
            navigation.navigate("JourneyTabs");
          }}
        />
      )}
    />
  );
}
