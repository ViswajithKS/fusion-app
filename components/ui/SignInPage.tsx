import { View, Button, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from 'expo-auth-session';
const jwtDecode = require('jwt-decode');


export default function SignInPage() {
  const [token, setToken] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1019337613483-u82ef3pk43tkglpii7iv4v1r54tjjgar.apps.googleusercontent.com",
    webClientId:
      "1019337613483-fef1mnpeuaugvgs416imgh3577dveliq.apps.googleusercontent.com",
    responseType: "code",
    usePKCE: true,
    redirectUri:AuthSession.makeRedirectUri(),
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success" && response?.params?.code) {
      console.log("Authentication success:", response);
      const decodedToken = jwtDecode.jwtDecode(response.authentication?.idToken);
      setToken(decodedToken.name);
    } else {
      console.error("❌ Authentication Failed:", response);
    }
  });

  const exchangeCodeForToken = async (authcode: string) => {
    try {
      if (!request?.codeVerifier) {
        console.error("❌ Missing code verifier");
        return;
      }
      const responsefetch = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: authcode,
          client_id:
            "1019337613483-fef1mnpeuaugvgs416imgh3577dveliq.apps.googleusercontent.com",
          client_secret: "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",
          grant_type: "authorization_code",
          redirect_uri: AuthSession.makeRedirectUri(),
          code_verifier: request.codeVerifier,
        }).toString(),
      });
      const data = await responsefetch.json();
      if (data.params.id_Token) {
        setToken(data.params.id_Token);
      } else {
        console.error("No ID token received:", data);
      }
    } catch (error) {
      console.error("Error during token exchange:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{token ? `Token: ${token}` : "No token"}</Text>
      
      <Button
        title="Sign in with Google"
        onPress={async () => {
          try {
            const result = await promptAsync();
            console.log("Sign-In Result:", result);
            if (result?.type === "success" && result?.params?.code) {
              console.log("Authorization Code:", result.params.code);
              await exchangeCodeForToken(result.params.code);
            } else {
              console.error("Google Sign-In Failed:", result);
            }
          } catch (e) {
            console.error("Google Sign-In Error:", e);
          }
        }}
      />
    </View>
  );
}
