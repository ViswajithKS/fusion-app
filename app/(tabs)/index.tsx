import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInPage from "./SignInPage";
import MainPage from "./MainPage";
import BlankScreen from "./BlankScreen";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    /*
    <Stack.Navigator initialRouteName="sign in page">
      <Stack.Screen name="sign in page" component={SignInPage} />
      <Stack.Screen name="main page" component={MainPage} />
    </Stack.Navigator>
    */
    <SignInPage />
  );
}
