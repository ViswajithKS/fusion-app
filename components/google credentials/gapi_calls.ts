import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

let ACCESS_TOKEN: string | null = null;

const fetchAccessToken = async () => {
  try {
    if (Platform.OS === "web") {
      ACCESS_TOKEN = localStorage.getItem("access_token");
    } else {
      ACCESS_TOKEN = await SecureStore.getItemAsync("access_token");
    }
    return ACCESS_TOKEN;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

async function createCalendarEvent(event: object): Promise<string | null> {
  if (!ACCESS_TOKEN) {
    ACCESS_TOKEN = await fetchAccessToken();
  }
  if (!ACCESS_TOKEN) {
    console.error("No access token found. Please log in.");
    return null;
  }

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Error creating event:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}

async function modifyEvent(eventId: string, fields: JSON): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Error updating event:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
}

async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      const data = await response.json();
      console.error("Error deleting event:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}

async function getEvent(eventId: string, calendarId = "primary"): Promise<any> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Error fetching event:", data);
      return null;
    }

    console.log("Event details:", data);
    return data;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export { createCalendarEvent, modifyEvent, deleteEvent, getEvent };

const dummyEvent = {
  summary: "Project Meeting",
  location: "123 Office St, New York, NY",
  description: "Weekly meeting to discuss project updates",
  start: {
    dateTime: "2025-02-25T10:00:00-07:00",
    timeZone: "America/New_York",
  },
  end: {
    dateTime: "2025-02-25T11:00:00-07:00",
    timeZone: "America/New_York",
  },
  reminders: {
    useDefault: false,
    overrides: [
      {
        method: "email",
        minutes: 1440,
      },
      {
        method: "popup",
        minutes: 30,
      },
    ],
  },
  recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"],
  visibility: "public",
  status: "confirmed",
  transparency: "opaque",
  colorId: "5",
};

const dummyResponse = {
  kind: "calendar#event",
  etag: '"3187221853182000"',
  id: "event123",
  status: "confirmed",
  htmlLink: "https://www.google.com/calendar/event?eid=event123",
  created: "2025-02-20T12:00:00.000Z",
  updated: "2025-02-21T08:00:00.000Z",
  summary: "Doctor's Appointment",
  description: "Checkup with Dr. Smith",
  location: "123 Medical St, NY",
  creator: {
    email: "user@example.com",
    displayName: "John Doe",
    self: true,
  },
  start: {
    dateTime: "2025-02-25T10:00:00-07:00",
    timeZone: "America/New_York",
  },
  end: {
    dateTime: "2025-02-25T11:00:00-07:00",
    timeZone: "America/New_York",
  },
  endTimeUnspecified: false,
  recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"],
  recurringEventId: "eventRecurring123",
  originalStartTime: {
    dateTime: "2025-02-25T10:00:00-07:00",
    timeZone: "America/New_York",
  },
  visibility: "default",
  transparency: "opaque",
  reminders: {
    useDefault: false,
    overrides: [
      {
        method: "email",
        minutes: 1440,
      },
      {
        method: "popup",
        minutes: 30,
      },
    ],
  },
  eventType: "default",
};

/*
const dummyResponse={
    "kind": "calendar#event",
    "etag": "\"3187221853182000\"",
    "id": "event123",
    "status": "confirmed",
    "htmlLink": "https://www.google.com/calendar/event?eid=event123",
    "created": "2025-02-20T12:00:00.000Z",
    "updated": "2025-02-21T08:00:00.000Z",
    "summary": "Doctor's Appointment",
    "description": "Checkup with Dr. Smith",
    "location": "123 Medical St, NY",
    "creator": {
      "email": "user@example.com",
      "displayName": "John Doe",
      "self": true
    },
    "organizer": {
      "email": "user@example.com",
      "displayName": "John Doe",
      "self": true
    },
    "start": {
      "dateTime": "2025-02-25T10:00:00-07:00",
      "timeZone": "America/New_York"
    },
    "end": {
      "dateTime": "2025-02-25T11:00:00-07:00",
      "timeZone": "America/New_York"
    },
    "endTimeUnspecified": false,
    "recurrence": [
      "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
    ],
    "recurringEventId": "eventRecurring123",
    "originalStartTime": {
      "dateTime": "2025-02-25T10:00:00-07:00",
      "timeZone": "America/New_York"
    },
    "visibility": "default",
    "transparency": "opaque",
    "iCalUID": "event123@google.com",
    "sequence": 0,
    "attendees": [
      {
        "email": "attendee1@example.com",
        "displayName": "Jane Doe",
        "organizer": false,
        "self": false,
        "responseStatus": "accepted"
      },
      {
        "email": "attendee2@example.com",
        "displayName": "Mark Smith",
        "organizer": false,
        "self": false,
        "responseStatus": "tentative"
      }
    ],
    "attendeesOmitted": false,
    "reminders": {
      "useDefault": false,
      "overrides": [
        {
          "method": "email",
          "minutes": 1440
        },
        {
          "method": "popup",
          "minutes": 30
        }
      ]
    },
    "eventType": "default",
    "conferenceData": {
      "createRequest": {
        "conferenceSolutionKey": {
          "type": "hangoutsMeet"
        },
        "requestId": "sample123"
      },
      "conferenceId": "abc-def-ghi",
      "entryPoints": [
        {
          "entryPointType": "video",
          "uri": "https://meet.google.com/abc-def-ghi",
          "label": "Join via Google Meet"
        },
        {
          "entryPointType": "phone",
          "uri": "+1-234-567-8901",
          "pin": "12345678"
        }
      ]
    },
    "extendedProperties": {
      "private": {
        "customKey1": "customValue1"
      },
      "shared": {
        "team": "development"
      }
    }
  };
  
const dummyEvent={
    "summary": "Project Meeting",  
    "location": "123 Office St, New York, NY",
    "description": "Weekly meeting to discuss project updates",
    "start": {
      "dateTime": "2025-02-25T10:00:00-07:00",
      "timeZone": "America/New_York"
    },
    "end": {
      "dateTime": "2025-02-25T11:00:00-07:00",
      "timeZone": "America/New_York"
    },
    "reminders": {
      "useDefault": false,
      "overrides": [
        {
          "method": "email",
          "minutes": 1440
        },
        {
          "method": "popup",
          "minutes": 30
        }
      ]
    },
    "recurrence": [
      "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
    ],
    "attendees": [
      {
        "email": "attendee1@example.com",
        "displayName": "Jane Doe",
        "responseStatus": "accepted"
      },
      {
        "email": "attendee2@example.com",
        "displayName": "Mark Smith",
        "responseStatus": "tentative"
      }
    ],
    "visibility": "public",  
    "status": "confirmed",
    "transparency": "opaque",  
    "colorId": "5",  
    "conferenceData": {
      "createRequest": {
        "conferenceSolutionKey": {
          "type": "hangoutsMeet"
        },
        "requestId": "randomRequest123"
      }
    },
    "extendedProperties": {
      "private": {
        "customKey1": "customValue1"
      },
      "shared": {
        "team": "development"
      }
    }
  };

*/
