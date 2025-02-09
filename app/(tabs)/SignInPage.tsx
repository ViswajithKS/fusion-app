import { View, Button, Text, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
const jwtDecode = require("jwt-decode");
if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignInPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const redirectUri =
    Platform.OS === "web"
      ? window.location.origin // Web should redirect to the app
      : AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1019337613483-u82ef3pk43tkglpii7iv4v1r54tjjgar.apps.googleusercontent.com",
    webClientId:
      "1019337613483-fef1mnpeuaugvgs416imgh3577dveliq.apps.googleusercontent.com",
    responseType: "code",
    usePKCE: true,
    redirectUri,
    scopes: ["openid", "profile", "email"],
    ...(Platform.OS === "web" && {
      clientSecret: "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",
    }),
  });

  useEffect(() => {
    if (response) {
      if (response?.type === "success") {
        console.log("Authentication success:");
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
          if (result.type === "success") {
            //router.replace("/MainPage");
          }
        }}
      />
    </View>
  );
}
