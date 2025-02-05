import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BlankScreen from "../../components/ui/BlankScreen";
import SignInPage from "@/components/ui/SignInPage";
import MainPage from "@/components/ui/MainPage";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="sign in page" component={SignInPage} />
      <Stack.Screen name="main page" component={MainPage} />
    </Stack.Navigator>
  );
}
