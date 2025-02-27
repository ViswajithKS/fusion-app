import { Platform, Keyboard, View } from "react-native";
import { Input, Icon } from "react-native-elements";

interface InputBoxProps {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => void;
}

function InputBox({ message, setMessage, handleSend }: InputBoxProps) {
  return (
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
  );
}
export { InputBox };
