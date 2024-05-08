import React, { useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useAppState } from "../context/AppStateContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import ParticipantView from "./ParticipantView";

const MeetingView = () => {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(null);
  const { meetingId, onMeetingLeave } = useAppState();

  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      onMeetingLeave();
      navigate("/summary");
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Meeting ID: {meetingId}
      </Typography>
      {joined && joined === "JOINED" ? (
        <Box>
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </Box>
      ) : joined && joined === "JOINING" ? (
        <Typography variant="body1">Joining the meeting...</Typography>
      ) : (
        <Button variant="contained" onClick={joinMeeting}>
          Join
        </Button>
      )}
    </Box>
  );
};

export default MeetingView;
