import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const storeAccessToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("access_token", token);
  } else {
    await SecureStore.setItemAsync("access_token", token);
  }
};

const getAccessToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("access_token");
  } else {
    return await SecureStore.getItemAsync("access_token");
  }
};

const storeIdToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("id_token", token);
  } else {
    await SecureStore.setItemAsync("id_token", token);
  }
};

const getIdToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("id_token");
  } else {
    return await SecureStore.getItemAsync("id_token");
  }
};

export { storeAccessToken, getAccessToken, storeIdToken, getIdToken };
