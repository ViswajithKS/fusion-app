import 'dotenv/config';

export default {
  expo: {
    name: 'fusion',
    slug: 'fusion',
    owner: 'viswajith777',
    platforms: ['ios', 'android', 'web'],
    version: '1.0.0',
    orientation: 'default',
    scheme: 'com.fusion.app',
    icon: './assets/images/placeholder.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    web: {
      bundler: 'metro',
      output: 'server',
      favicon: './assets/images/placeholder.png',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fusion.app',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.fusion.app',
      adaptiveIcon: {
        foregroundImage: './assets/images/placeholder.png',
        backgroundColor: '#ffffff',
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/placeholder.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-secure-store',
      'expo-font',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
      WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
      WEB_CLIENT_SECRET: process.env.WEB_CLIENT_SECRET,
      HUGGINGFACE_KEY: process.env.HUGGINGFACE_KEY,
      oauth: {
        google: {
          clientId: process.env.WEB_CLIENT_ID,
          redirectUri: 'com.fusion.app://',
        },
      },
      router: {
        origin: false,
      },
      eas: {
        projectId: '026af6b4-6a0c-4107-8669-b6edf7a35d00',
      },
    },
  },
};
