import React, { useState, useEffect } from "react";

import { Button } from "@mui/material";

import { fetchMeetingDuration, socket } from "../api";
import { useAppState } from "../context/AppStateContext";

const MeetingSummary = ({ totalFaceTime, meetingId }) => {
  const { setMeetingEnded } = useAppState();
  const [meetingDuration, setMeetingDuration] = useState(null);

  useEffect(() => {
    const handleMeetingDuration = fetchMeetingDuration(
      meetingId,
      (fetchedDuration) => {
        setMeetingDuration(fetchedDuration);
      }
    );

    return () => {
      socket.off("meetingDuration", handleMeetingDuration);
    };
  }, [meetingId]);

  socket.on("meetingDuration", (data) => {
    const { duration, meetingId } = data;
    console.log(`Meeting ${meetingId} duration: ${duration} seconds`);
    // Update your frontend state or perform any other necessary actions
  });
  const onGoHome = () => {
    setMeetingEnded(false);
  };

  return (
    <div>
      <h2>Meeting Summary</h2>
      <p>
        Total Face Detection Time: {Math.floor(totalFaceTime / 1000)} seconds
      </p>
      {meetingDuration !== null ? (
        <p>Total Meeting Duration: {meetingDuration} seconds</p>
      ) : (
        <p>Fetching meeting duration...</p>
      )}
      <Button variant="contained" onClick={onGoHome}>
        Go to Home Page
      </Button>
    </div>
  );
};

export default MeetingSummary;
