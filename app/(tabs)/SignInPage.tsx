import { View, Text, Platform, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { useFonts } from "expo-font";

const ANDROID_CLIENT_ID = Constants.manifest?.extra?.ANDROID_CLIENT_ID ?? "";
const IOS_CLIENT_ID = Constants.manifest?.extra?.IOS_CLIENT_ID ?? "";
const WEB_CLIENT_ID = Constants.manifest?.extra?.WEB_CLIENT_ID ?? "";
const WEB_CLIENT_SECRET = Constants.manifest?.extra?.WEB_CLIENT_SECRET ?? "";

if (Platform.OS === "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function SignInPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    "PublicSans-Black": require("../../assets/fonts/PublicSans-Black.ttf"),
  });
  const redirectUri =
    Platform.OS === "web"
      ? window.location.origin
      : AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    //webClientId:"1019337613483-fef1mnpeuaugvgs416imgh3577dveliq.apps.googleusercontent.com",
    responseType: "code",
    usePKCE: true,
    redirectUri,
    extraParams: {
      prompt: "select_account",
    },
    scopes: ["openid", "profile", "email"],
    ...(Platform.OS === "web" && {
      clientSecret: WEB_CLIENT_SECRET,
      //clientSecret:"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"
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
      router.replace('/MainPage');
    }
    setLoading(false);
  };

  useEffect(() => {
    const check=async()=>{
    await checkStoredToken();
    }
    check();
  }, [token]);

  useEffect(()=>{
    console.log("TOKEN IS ", token , "AND RESPONSE IS ", response);
  },[response])

  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === "success") {
        const accessToken = response?.authentication?.accessToken;
        const idToken = response?.authentication?.idToken;
        
        if (idToken) {
          if (Platform.OS === 'web') {
            await AsyncStorage.setItem("id_token", idToken);
          } else {
            await SecureStore.setItemAsync("id_token", idToken);
          }
        }
        if (accessToken) {
          setToken(accessToken);
          await storeToken(accessToken);
        }
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
        title="Sign in with Google"
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
        onPress={async () => {
          await promptAsync();
          console.log('KEY IS',ANDROID_CLIENT_ID,WEB_CLIENT_ID);
        }}
      />
    </View>
  );
}
