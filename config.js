import Constants from "expo-constants";

const config = {
  ANDROID_CLIENT_ID: Constants.manifest?.extra?.ANDROID_CLIENT_ID ?? "",
  IOS_CLIENT_ID: Constants.manifest?.extra?.IOS_CLIENT_ID ?? "",
  WEB_CLIENT_ID: Constants.manifest?.extra?.WEB_CLIENT_ID ?? "",
  WEB_CLIENT_SECRET: Constants.manifest?.extra?.WEB_CLIENT_SECRET ?? "",
  HUGGINGFACE_KEY: Constants.manifest?.extra?.HUGGINGFACE_KEY ?? "",
};

export default config;
