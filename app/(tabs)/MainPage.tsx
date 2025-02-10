import React, { useState } from "react";
import { View, Text, ScrollView, Keyboard, Platform } from "react-native";
import { Input, Icon, Chip, SpeedDial } from "react-native-elements";
import Constants from "expo-constants";

const HUGGINGFACE_KEY = Constants.expoConfig?.extra?.HUGGINGFACE_KEY ?? "";
export default function MainSreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

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
            backgroundColor: "gray",
            alignSelf: "center",
          }}
        >
          <View style={{ flex: 1, backgroundColor: "red" }}>
            <Text style={{ alignSelf: "center" }}>welcome user</Text>
          </View>
          <View
            style={{
              flex: 40,
              backgroundColor: "blue",
              padding: 10,
            }}
          >
            <View
              style={{
                flex: 9,
                alignContent: "center",
                backgroundColor: "green",
                paddingRight: 20,
                paddingLeft: 20,
                padding: 3,
              }}
            >
              <ScrollView>
                {chat.map((message, index) => {
                  const alignment = index % 2 === 0 ? "flex-end" : "flex-start";
                  return (
                    <Chip
                      key={index}
                      containerStyle={{
                        alignSelf: alignment,
                        maxWidth: "80%",
                        marginVertical: 5,
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
                  backgroundColor: "yellow",
                }}
                isOpen={open}
                icon={{ name: "edit", color: "#fff" }}
                openIcon={{ name: "close", color: "#fff" }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}
              >
                <SpeedDial.Action
                  icon={{ name: "add", color: "#fff" }}
                  title="add"
                  onPress={() => console.log("Add Something")}
                />
                <SpeedDial.Action
                  icon={{ name: "delete", color: "#fff" }}
                  title="delete"
                  onPress={() => console.log("Delete Something")}
                />
              </SpeedDial>
            </View>
            <View
              style={{
                backgroundColor: "pink",
                justifyContent: "center",
                alignContent: "center",
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 3 }}>
                <Input
                  multiline={true}
                  numberOfLines={3}
                  value={message}
                  rightIcon={
                    <Icon
                      containerStyle={{
                        backgroundColor: "white",
                        borderRadius: 50,
                        padding: 8,
                      }}
                      name="send"
                      onPress={handleSend}
                    />
                  }
                  placeholder="Type a message..."
                  inputContainerStyle={{
                    marginTop: 10,
                    backgroundColor: "gray",
                    width: "100%",
                    alignSelf: "flex-end",
                  }}
                  inputStyle={{
                    backgroundColor: "white",
                    borderRadius: 30,
                    padding: 10,
                    margin: 10,
                    borderWidth: 2,
                  }}
                  onChangeText={(text) => {
                    if (message !== "Thinking...") {
                      setMessage(text);
                    }
                  }}
                  onKeyPress={(e) => {
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
