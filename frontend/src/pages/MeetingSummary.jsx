import React, { useState, Fragment } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

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

  const isAttendanceGranted = attendanceScore > 50 ? true : false;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ textAlign: "center", mb: "4rem" }}>
        <Typography variant="h3" sx={{ mb: "3rem" }}>
          Meeting Summary
        </Typography>
        <Typography variant="h4" sx={{ mb: "2rem" }}>
          Meeting Id: {lastMeetingId}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Face Detection Time: {faceTime} seconds
        </Typography>

        {meetingDuration !== null ? (
          <Fragment>
            <Typography variant="h5" gutterBottom>
              Total Meeting Duration: {meetingDuration} seconds
            </Typography>
            <Typography variant="h5" gutterBottom>
              Your Attendance Score: {attendanceScore}%
            </Typography>
            {isAttendanceGranted ? (
              <Typography variant="h6" sx={{ mt: "2rem", maxWidth: "500px" }}>
                Well done! Your participation earned you attendance for this
                session. Your attendance was accepted.
              </Typography>
            ) : (
              <Typography variant="h6" sx={{ mt: "2rem", maxWidth: "550px" }}>
                You haven't met the minimum attendance requirements for today's
                session. Please be more attentive during classes.
              </Typography>
            )}
          </Fragment>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              mt: "2rem",
            }}
          >
            <Typography variant="h6" sx={{ p: "1rem" }}>
              Fetching Meeting Details
            </Typography>
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Box>
        <Button size="large" variant="contained" fullWidth onClick={onGoHome}>
          Go to Home Page
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingSummary;
