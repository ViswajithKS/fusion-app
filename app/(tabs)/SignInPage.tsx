import { View, Platform, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useFonts } from "expo-font";
import config from "../../config";
import {
  storeIdToken,
  storeAccessToken,
} from "../../components/google credentials/token_manager";

if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    "PublicSans-Black": require("../../assets/fonts/PublicSans-Black.ttf"),
  });
  const redirectUri =
    Platform.OS === "web"
      ? window.location.origin
      : AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.ANDROID_CLIENT_ID,
    webClientId: config.WEB_CLIENT_ID,
    responseType: "code",
    usePKCE: true,
    redirectUri,
    extraParams: {
      prompt: "select_account",
    },
    scopes: [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar",
    ],
    ...(Platform.OS === "web" && {
      clientSecret: config.WEB_CLIENT_SECRET,
    }),
  });

  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === "success" && response?.authentication) {
        const storedAccessToken = response?.authentication?.accessToken;
        const storedIdToken = response?.authentication?.idToken;
        if (storedIdToken) {
          await storeIdToken(storedIdToken);
        }
        if (storedAccessToken) {
          await storeAccessToken(storedAccessToken);
        }
        router.replace("/MainPage");
      }
    };
    handleAuth();
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
      <Button
        title="Sign in with Google(ask to add your email to the testers list)"
        buttonStyle={{
          backgroundColor: "black",
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 30,
        }}
        containerStyle={{
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        titleStyle={{ fontFamily: "PublicSans-Black" }}
        onPress={() => promptAsync()}
      />
    </View>
  );
}
