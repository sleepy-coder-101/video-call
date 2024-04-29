import { io } from "socket.io-client";
// export const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
export const socket = io("http://localhost:5000");
console.log("Socket.IO client instance created");

socket.on("connect", () => {
  console.log("Connected to Socket.io server");
});

// socket.on("meetingDuration", (data) => {
//   const { duration, meetingId } = data;
//   console.log(`Meeting ${meetingId} duration: ${duration} seconds`);
//   // Update your frontend state or perform any other necessary actions
// });

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.io server");
});

export const fetchToken = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Failed to get an AuthToken from backend", error);
    throw error;
  }
};

export const createMeeting = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/meetings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    const data = await response.json();
    return data.meetingId;
  } catch (error) {
    console.error("Error in creating a meeting", error);
    throw error;
  }
};

// this is called when meeting ends to fetch the meeting duration
export const fetchMeetingDuration = async (meetingId, callback) => {
  console.log("I got called");

  const handleMeetingDuration = (data) => {
    if (data.meetingId === meetingId) {
      callback(data.duration);
    }
  };

  socket.on("meetingDuration", handleMeetingDuration);

  return handleMeetingDuration;
};
