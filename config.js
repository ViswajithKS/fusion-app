import Constants from "expo-constants";

const manifest = Constants.expoConfig ?? Constants.manifest;

const config = {
  ANDROID_CLIENT_ID: manifest?.extra?.ANDROID_CLIENT_ID ?? "",
  IOS_CLIENT_ID: manifest?.extra?.IOS_CLIENT_ID ?? "",
  WEB_CLIENT_ID: manifest?.extra?.WEB_CLIENT_ID ?? "",
  WEB_CLIENT_SECRET: manifest?.extra?.WEB_CLIENT_SECRET ?? "",
  HUGGINGFACE_KEY: manifest?.extra?.HUGGINGFACE_KEY ?? "",
};

export default config;
