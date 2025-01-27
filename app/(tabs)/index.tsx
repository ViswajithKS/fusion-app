import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BlankScreen from "../../components/ui/BlankScreen";
import SignInPage from "@/components/ui/SignInPage";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Sign In" component={SignInPage} />
        <Stack.Screen name="blank screen" component={BlankScreen} />
      </Stack.Navigator>
  );
}