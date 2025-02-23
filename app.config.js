import 'dotenv/config';
export default {
  expo: {
    name: 'fusion',
    slug: 'fusion',
    extra: {
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
      IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
      WEB_CLIENT_ID: process.env.WEB_CLIENT_ID,
      WEB_CLIENT_SECRET: process.env.WEB_CLIENT_SECRET,
      HUGGINGFACE_KEY: process.env.HUGGINGFACE_KEY,
      "eas":{
        "projectId":"026af6b4-6a0c-4107-8669-b6edf7a35d00",
      }
    },
}
}