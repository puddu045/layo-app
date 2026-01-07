import { useState } from "react";
import { View, TextInput, FlatList, Pressable, Text } from "react-native";
import airports from "../../assets/airports_data.json.json";

type Props = {
  value?: string;
  onSelect: (airport: { iata: string; name: string }) => void;
  placeholder: string;
};

export default function AirportAutocomplete({ onSelect, placeholder }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  function onChange(text: string) {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    const q = text.toLowerCase();

    const filtered = airports
      .filter(
        (a) =>
          a.iata &&
          (a.iata.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
      )
      .slice(0, 10);

    setResults(filtered);
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
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item, index) =>
            item.iata ? item.iata : `${item.ident}-${index}`
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setQuery(`${item.iata} - ${item.name}`);
                setResults([]);
                onSelect(item);
              }}
              style={{ padding: 10 }}
            >
              <Text>
                {item.iata} · {item.name}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
