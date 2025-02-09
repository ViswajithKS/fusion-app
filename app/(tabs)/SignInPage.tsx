import { View, Button, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { useNavigation, useRouter } from "expo-router";
const jwtDecode = require("jwt-decode");

export default function SignInPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const [token, setToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1019337613483-u82ef3pk43tkglpii7iv4v1r54tjjgar.apps.googleusercontent.com",
    webClientId:
      "1019337613483-fef1mnpeuaugvgs416imgh3577dveliq.apps.googleusercontent.com",
    responseType: "code",
    usePKCE: true,
    redirectUri: AuthSession.makeRedirectUri(),
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response) {
      if (response?.type === "success") {
        console.log("Authentication success:", response);
        const decodedToken = jwtDecode.jwtDecode(
          response?.authentication?.idToken,
        );
        setToken(decodedToken.email);
      } else {
        console.error("❌ Authentication Failed:", response);
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{token ? `Token: ${token}` : "No token"}</Text>

      <Button
        title="Sign in with Google"
        onPress={async () => {
          const result = await promptAsync();
          if (result.type == "success") {
            router.replace("/MainPage");
          }
        }}
      />
    </View>
  );
}
