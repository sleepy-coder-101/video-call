import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      joinMeeting();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Meeting ID: {meetingId}
      </Typography>

      {joined === "JOINED" ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              key={participantId}
              participantId={participantId}
            />
          ))}
        </Box>
      ) : joined === "JOINING" ? (
        <Typography variant="body1" sx={{ mt: 4 }}>
          Joining the meeting...
        </Typography>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          // onClick={joinMeeting}
          sx={{ mt: 4 }}
        >
          Join Meeting
        </Button>
      )}
    </Box>
  );
};

export default MeetingView;
