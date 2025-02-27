import { ScrollView } from "react-native";
import { Chip } from "react-native-elements";

interface ChatScrollViewProps {
  message: string;
  chat: string[];
}

function ChatScrollView({ message, chat }: ChatScrollViewProps) {
  return (
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
  );
}
export { ChatScrollView };
