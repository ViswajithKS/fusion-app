import { View, Button, Text, Platform, ActivityIndicator } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import Constants from 'expo-constants';

const ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.ANDROID_CLIENT_ID ?? "";
const IOS_CLIENT_ID = Constants.expoConfig?.extra?.IOS_CLIENT_ID ?? "";
const WEB_CLIENT_ID = Constants.expoConfig?.extra?.WEB_CLIENT_ID ?? "";
const WEB_CLIENT_SECRET = Constants.expoConfig?.extra?.WEB_CLIENT_SECRET ?? "";


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
      ANDROID_CLIENT_ID,
    webClientId:
      WEB_CLIENT_ID,
    responseType: "code",
    usePKCE: true,
    redirectUri,
    scopes: ["openid", "profile", "email"],
    ...(Platform.OS === "web" && {
      clientSecret: WEB_CLIENT_SECRET,
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
