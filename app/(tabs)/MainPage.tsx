import React, { useState } from "react";
import { View, Text, ScrollView, Keyboard, Platform } from "react-native";
import { Input, Icon, Chip, SpeedDial } from "react-native-elements";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HUGGINGFACE_KEY = Constants.expoConfig?.extra?.HUGGINGFACE_KEY ?? "";
export default function MainSreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);

  const handleSend = async () => {
    if (message === "") return;
    const prompt = message;
    setChat([...chat, message]);
    setMessage("Thinking...");
    const res = await recieveResponse(prompt);
    setChat([...chat, message, res]);
    setMessage("");
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
              flex: 1, //backgroundColor: "red"
            }}
          >
            <Text style={{ alignSelf: "center" }}>welcome {token}</Text>
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
