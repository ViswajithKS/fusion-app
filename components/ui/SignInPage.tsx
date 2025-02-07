import { router, useNavigation } from "expo-router";
import { Button, View } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";

export default function SignInPage() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "1019337613483-u82ef3pk43tkglpii7iv4v1r54tjjgar.apps.googleusercontent.com",
    iosClientId: "",
    webClientId:""
  });
  const sendTokenToServer = async (token:string)=>{
    console.log(token);
    router.replace('/')
  }
  useEffect(()=>{
    if(response){
      if(response.type === 'success'){
        sendTokenToServer(response.authentication?.idToken || '')
      }else {
        console.log("error in the authentication:", response);
      }
    }
  });

  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "gray",
      }}
    >
      <Button
        title="Sign in with google"
        onPress={() => {
          promptAsync().catch((e) => {
            console.error("error: ",e);
          });
          //navigation.navigate("main page");
        }}
      />
    </View>
  );
}
