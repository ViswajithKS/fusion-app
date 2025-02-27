import { router } from "expo-router";
import { useState } from "react";
import { SpeedDial } from "react-native-elements";
function ChatBoxOptions() {
  const [open, setOpen] = useState(false);
  return (
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
        onPress={() => router.replace("/CalendarEventForm")}
      />
      <SpeedDial.Action
        icon={{ name: "delete", color: "#fff" }}
        iconContainerStyle={{ backgroundColor: "black" }}
        title="delete"
        onPress={() => console.log("Delete Something")}
      />
    </SpeedDial>
  );
}
export { ChatBoxOptions };
