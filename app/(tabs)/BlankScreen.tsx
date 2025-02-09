import { useNavigation, useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function BlankScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Blank Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => {
          router.push("./SignInPage");
        }}
      />
    </View>
  );
}
