import { useNavigation } from "expo-router";
import { Button, View } from "react-native";

export default function SignInPage() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray",
      }}
    >
      <Button
        title="Sign in with google"
        onPress={() => {
          navigation.navigate("blank screen");
        }}
      />
    </View>
  );
}
