import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Keyboard, Platform } from "react-native";
import { Input, Icon, Chip, SpeedDial, Dialog } from "react-native-elements";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
const jwtDecode = require("jwt-decode");

interface DecodedToken {
  email: string;
  name: string;
}

const HUGGINGFACE_KEY = Constants.manifest?.extra?.HUGGINGFACE_KEY ?? "";
export default function MainSreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchIdToken = async () => {
      let token;
      if (Platform.OS == "web") {
        token = await AsyncStorage.getItem("id_token");
      } else {
        token = await SecureStore.getItemAsync("id_token");
      }
      if (token) {
        const decodedToken = jwtDecode.jwtDecode(token);
        setDecoded(decodedToken);
      }
    };

    fetchIdToken();
  }, []);

  const handleSend = async () => {
    console.log('KEY IS ',HUGGINGFACE_KEY);
    if (message === "") return;
    const prompt = message;
    setChat([...chat, message]);
    setMessage("Thinking...");
    const res = await recieveResponse(prompt);
    setChat([...chat, message, res]);
    setMessage("");
  };

  const logout = async () => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("id_token");
    } else {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("id_token");
    }
    router.replace("/SignInPage");
  };

  async function recieveResponse(prompt: string) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-alpha",
      {
        method: "POST",
        headers: {
          Authorization: HUGGINGFACE_KEY,
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
        <Dialog
          overlayStyle={{ borderRadius: 10, paddingRight: 50, maxWidth: 500 }}
          isVisible={visible}
          onBackdropPress={() => setVisible(false)}
        >
          <Dialog.Title title="Are you sure you want to logout?" />
          <Dialog.Actions>
            <Dialog.Button title="Cancel" onPress={() => setVisible(false)} />
            <Dialog.Button
              title="Yes"
              onPress={async () => {
                setVisible(false);
                logout();
              }}
            />
          </Dialog.Actions>
        </Dialog>

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
            <Icon
              containerStyle={{ alignSelf: "flex-end", marginRight: 10 }}
              name="logout"
              onPress={() => {
                setVisible(true);
              }}
            ></Icon>
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
              <ScrollView>
                {chat.map((message, index) => {
                  const alignment = index % 2 === 0 ? "flex-end" : "flex-start";
                  return (
                    <Chip
                      key={index}
                      buttonStyle={{
                        backgroundColor: index % 2 ? "darkgray" : "gray",
                      }}
                      containerStyle={{
                        alignSelf: alignment,
                        maxWidth: "80%",
                        marginVertical: 5,
                        marginRight: 15,
                      }}
                      title={message}
                    />
                  );
                })}
              </ScrollView>
              <SpeedDial
                style={{ direction: "rtl" }}
                containerStyle={{
                  alignSelf: "flex-start",
                  backgroundColor: "gray",
                }}
                isOpen={open}
                icon={{ name: "edit", color: "#fff" }}
                iconContainerStyle={{ backgroundColor: "black" }}
                openIcon={{ name: "close", color: "#fff" }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
              >
                <SpeedDial.Action
                  icon={{ name: "add", color: "#fff" }}
                  iconContainerStyle={{ backgroundColor: "black" }}
                  title="add"
                  onPress={() => console.log("Add Something")}
                />
                <SpeedDial.Action
                  icon={{ name: "delete", color: "#fff" }}
                  iconContainerStyle={{ backgroundColor: "black" }}
                  title="delete"
                  onPress={() => console.log("Delete Something")}
                />
              </SpeedDial>
            </View>
            <View
              style={{
                //backgroundColor: "pink",
                justifyContent: "center",
                alignContent: "center",
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 3, padding: 1 }}>
                <Input
                  multiline={true}
                  numberOfLines={3}
                  value={message}
                  rightIcon={
                    <Icon
                      containerStyle={{
                        //backgroundColor: "white",
                        borderRadius: 50,
                        padding: 5,
                        borderWidth: 2,
                        alignSelf: "center",
                      }}
                      name="send"
                      onPress={handleSend}
                    />
                  }
                  placeholder="Type a message..."
                  inputContainerStyle={{
                    backgroundColor: "white",
                    width: "100%",
                    minHeight: 80,
                    alignSelf: "flex-end",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    elevation: 5,
                    padding: 5,
                    borderBottomWidth: 0,
                    borderRadius: 10,
                  }}
                  inputStyle={{
                    //backgroundColor: "white",
                    borderWidth: 0,
                    padding: 10,
                    outline: "none",
                    borderBottomWidth: 0,
                    borderRadius: 10,
                    //margin: 10,
                  }}
                  onChangeText={(text) => {
                    if (message !== "Thinking...") {
                      setMessage(text);
                    }
                  }}
                  onKeyPress={async (e) => {
                    if (e.nativeEvent.key == "Enter" && Platform.OS === "web") {
                      Keyboard.dismiss();
                      handleSend();
                      console.log("key is ",HUGGINGFACE_KEY);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
