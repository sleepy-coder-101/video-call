import React, { useState, useEffect } from "react";

import { Button } from "@mui/material";

import { socket } from "../socket";
import { useAppState } from "../context/AppStateContext";
import { useNavigate } from "react-router-dom";

const MeetingSummary = () => {
  const navigate = useNavigate();

  const {
    setMeetingEnded,
    setLastMeetingId,
    setTotalFaceTime,
    lastMeetingId,
    totalFaceTime,
  } = useAppState();
  const [meetingDuration, setMeetingDuration] = useState(null);

  socket.on("meetingDuration", (data) => {
    console.log("The Meeting i was in had meeting id: ", lastMeetingId);
    const { duration, meetingId } = data;
    console.log(`Meeting ${meetingId} duration: ${duration} seconds`);
    // Update your frontend state or perform any other necessary actions
    if (lastMeetingId === meetingId) {
      setMeetingDuration(duration);
      // setLastMeetingId(null);
    }
  });

  const onGoHome = () => {
    setMeetingEnded(false);
    setLastMeetingId(null);
    setTotalFaceTime(0);
    navigate("/");
  };

  const faceTime = Math.floor(totalFaceTime / 1000);
  const attendanceScore = Math.round((faceTime / meetingDuration) * 1000) / 10;

  return (
    <div>
      <h1>Meeting Summary</h1>
      <p>Meeting Id: {lastMeetingId}</p>
      <p>Total Face Detection Time: {faceTime} seconds</p>
      {meetingDuration !== null ? (
        <>
          <p>Total Meeting Duration: {meetingDuration} seconds</p>
          <h2>Your Attendance Score: {attendanceScore}%</h2>
        </>
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
