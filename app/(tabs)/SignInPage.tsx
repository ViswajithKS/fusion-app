import { View, Button, Text, Platform, ActivityIndicator } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignInPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const redirectUri =
    Platform.OS === "web"
      ? window.location.origin
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

  const storeToken = async (token: string) => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem("auth_token", token);
    } else {
      await SecureStore.setItemAsync("auth_token", token);
    }
  };

  const getToken = async () => {
    if (Platform.OS === "web") {
      return await AsyncStorage.getItem("auth_token");
    } else {
      return await SecureStore.getItemAsync("auth_token");
    }
  };

  const checkStoredToken = async () => {
    const storedToken = await getToken();
    if (storedToken) {
      setToken(storedToken);
      router.replace("/MainPage");
    }
    setLoading(false);
  };

  useEffect(() => {
    checkStoredToken();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication?.accessToken;
      if (accessToken) {
        setToken(accessToken);
        storeToken(accessToken);
        router.replace("/MainPage");
      }
    }
  }, [response]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{token ? `Logged in` : "Sign in with Google"}</Text>

      <Button
        title="Sign in with Google"
        onPress={async () => {
          await promptAsync();
        }}
      />
    </View>
  );
}
