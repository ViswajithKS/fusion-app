import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
const jwtDecode = require("jwt-decode");
import config from "../../config";
import { storeIdToken, storeAccessToken, getIdToken } from "./tokenManager";
import { ChatBoxOptions } from "@/components/ChatBoxOptions";
import { LogoutDialog, LogoutButton } from "@/components/Logout";
import { ChatScrollView } from "@/components/ChatScrollView";
import { InputBox } from "@/components/InputBox";

interface DecodedToken {
  email: string;
  name: string;
}

export default function MainSreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [logoutVisible, setLogoutVisible] = useState(false);

  useEffect(() => {
    const fetchIdToken = async () => {
      const token = await getIdToken();
      if (token) {
        const decodedToken = jwtDecode.jwtDecode(token);
        setDecoded(decodedToken);
      }
    };

    fetchIdToken();
  }, []);

  const handleSend = async () => {
    if (message === "") return;
    const prompt = message;
    setChat([...chat, message]);
    setMessage("Thinking...");
    const res = await recieveResponse(prompt);
    setChat([...chat, message, res]);
    setMessage("");
  };

  const logout = async () => {
    await storeAccessToken("");
    await storeIdToken("");
    router.replace("/SignInPage");
  };

  async function recieveResponse(prompt: string) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha",
      {
        method: "POST",
        headers: {
          Authorization: config.HUGGINGFACE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      },
    );

    const data = await response.json();
    return data[0]?.generated_text || "No response.";
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <LogoutDialog
          visible={logoutVisible}
          setVisible={setLogoutVisible}
          logout={logout}
        />
        <View
          style={{
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
            //backgroundColor: "gray",
            alignSelf: "center",
          }}
        >
          <View
            style={{
              minHeight: 20, //backgroundColor: "red"
            }}
          >
            <Text style={{ alignSelf: "center" }}>welcome {decoded?.name}</Text>
            <LogoutButton setVisible={setLogoutVisible} />
          </View>
          <View
            style={{
              flex: 40,
              //backgroundColor: "blue",
            }}
          >
            <View
              style={{
                flex: 9,
                alignContent: "center",
                //backgroundColor: "gray",
                //paddingRight: 20,
                //paddingLeft: 20,
                padding: 3,
                borderWidth: 2,
                margin: 10,
              }}
            >
              <ChatScrollView chat={chat} message={message} />
              <ChatBoxOptions />
            </View>
            <InputBox
              message={message}
              setMessage={setMessage}
              handleSend={handleSend}
            />
          </View>
        </View>
      </View>
    </>
  );
}
