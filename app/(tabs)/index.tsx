import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BlankScreen from "../../components/ui/BlankScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={BlankScreen} />
      <Stack.Screen
        name="Home"
        component={BlankScreen}
        options={{ title: "Welcome" }}
      />
      <Stack.Screen name="Profile2" component={BlankScreen} />
    </Stack.Navigator>
  );
}
