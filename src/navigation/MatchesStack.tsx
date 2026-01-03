import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MatchListScreen from "../screens/matches/MatchListScreen";

const Stack = createNativeStackNavigator();

export default function MatchesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MatchesList" component={MatchListScreen} />
    </Stack.Navigator>
  );
}
