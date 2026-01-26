import { useState } from "react";
import { View, TextInput, FlatList, Pressable, Text } from "react-native";
import airports from "../../assets/airports_data_new.json";

type Airport = {
  iata: string;
  name: string;
  city: string;
  country?: string;
};

type Props = {
  value?: string;
  onSelect: (airport: Airport) => void;
  placeholder: string;
};

export default function AirportAutocomplete({ onSelect, placeholder }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Airport[]>([]);

  function onChange(text: string) {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    const q = text.toLowerCase();

    const cityMatches: Airport[] = [];
    const iataMatches: Airport[] = [];
    const nameMatches: Airport[] = [];

    airports.forEach((a: Airport) => {
      if (!a.iata) return;

      const city = a.city.toLowerCase() || "";
      const iata = a.iata.toLowerCase();
      const name = a.name.toLowerCase();

      if (city.includes(q)) {
        cityMatches.push(a);
      } else if (iata.includes(q)) {
        iataMatches.push(a);
      } else if (name.includes(q)) {
        nameMatches.push(a);
      }
    });

    setResults([...cityMatches, ...iataMatches, ...nameMatches].slice(0, 10));
  }

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={query}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          backgroundColor: "#fff",
        }}
      />

      {results.length > 0 && (
        <FlatList
          data={results}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item, index) => `${item.iata}-${index}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setQuery(`${item.iata} - ${item.name}, ${item.city ?? ""}`);
                setResults([]);
                onSelect(item);
              }}
              style={{ paddingVertical: 10, paddingHorizontal: 8 }}
            >
              <Text style={{ fontWeight: "600" }}>
                {item.iata} · {item.name}
              </Text>
              <Text style={{ color: "#666", fontSize: 12 }}>
                {item.city}
                {item.city && item.country ? ", " : ""}
                {item.country}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
