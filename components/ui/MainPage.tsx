import React, { useState } from "react";
import { View, Text, ScrollView, Platform, Keyboard } from "react-native";
import { Input, Icon, Button, Chip, SpeedDial } from "react-native-elements";

export default function MainSreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (message === "") return;
    setMessage(message);
    setChat([
      ...chat,
      message,
      Math.floor(
        Math.random() * 10000000000000000000000000000000000000,
      ).toString(),
    ]);
    setMessage("");
  };

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
            <Text style={{ alignSelf: "center" }}>Welcome User!</Text>
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
                  onChangeText={(text) => setMessage(text)}
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key == "Enter") {
                      console.log("hi");
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
