import React, { useState } from "react";
import { Button, Text, Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, View } from "react-native";
import { createCalendarEvent } from "../../components/google credentials/gapi_calls";
import { router } from "expo-router";

//JUST A PLACEHOLDER FOR FUNCTIONALITY

const DateTimePickerComponent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [mode, setMode] = useState<"date" | "time">("date");

  const makeEvent = async () => {
    const event = {
      summary: name,
      description: description,
      location: location,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };
    await createCalendarEvent(event);
    router.replace("/MainPage");
  };

  const onChange = (event: any, selectedDate?: Date, isStart = true) => {
    if (selectedDate) {
      isStart ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
    isStart ? setShowStartPicker(false) : setShowEndPicker(false);
  };

  const showMode = (currentMode: "date" | "time", isStart = true) => {
    isStart ? setShowStartPicker(true) : setShowEndPicker(true);
    setMode(currentMode);
  };

  const handleWebDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isStart = true,
  ) => {
    const selectedDate = new Date(event.target.value);
    isStart ? setStartDate(selectedDate) : setEndDate(selectedDate);
  };

  if (Platform.OS === "web") {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: "80%" }}
        />
        {/* Description Input */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: "80%", height: 60 }}
        />
        {/* Location Input */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: "80%" }}
        />

        {/* Start Date */}
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Start Date</Text>
        <input
          type="datetime-local"
          value={startDate.toISOString().slice(0, 16)}
          onChange={(e) => handleWebDateChange(e, true)}
          style={{ padding: 10, marginBottom: 10 }}
        />

        {/* End Date */}
        <Text style={{ fontSize: 16, marginBottom: 5 }}>End Date</Text>
        <input
          type="datetime-local"
          value={endDate.toISOString().slice(0, 16)}
          onChange={(e) => handleWebDateChange(e, false)}
          style={{ padding: 10, marginBottom: 10 }}
        />
        <Button title="send" onPress={makeEvent}></Button>
      </View>
    );
  }

  return (
    <View style={{ padding: 20, alignItems: "center", width: "100%" }}>
      {/* Name Input */}
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName}
        containerStyle={{ width: "80%", marginBottom: 10 }}
      />
      {/* Description Input */}
      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        containerStyle={{ width: "80%", marginBottom: 10 }}
        multiline
      />
      {/* Location Input */}
      <Input
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        containerStyle={{ width: "80%", marginBottom: 10 }}
      />

      {/* Start Date Picker */}
      <Text style={{ fontSize: 16, marginBottom: 5 }}>Start Date</Text>
      <Button title="Pick Start Date" onPress={() => showMode("date", true)} />
      <Button title="Pick Start Time" onPress={() => showMode("time", true)} />
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => onChange(event, date, true)}
        />
      )}

      {/* End Date Picker */}
      <Text style={{ fontSize: 16, marginBottom: 5 }}>End Date</Text>
      <Button title="Pick End Date" onPress={() => showMode("date", false)} />
      <Button title="Pick End Time" onPress={() => showMode("time", false)} />
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => onChange(event, date, false)}
        />
      )}
      <Text style={{ fontSize: 12 }}>
        {name},{description},{startDate.toISOString()},{endDate.toISOString()}
      </Text>
      <Button title="create an event" onPress={makeEvent} />
    </View>
  );
};

export default DateTimePickerComponent;
