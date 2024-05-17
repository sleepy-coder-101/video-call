import React, { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useAppState } from "../context/AppStateContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CssBaseline, CircularProgress } from "@mui/material";
import ParticipantView from "./ParticipantView";
import MeetingControls from "../components/MeetingControls";

const Meeting = () => {
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      {joined === "JOINED" ? (
        <>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            {[...participants.keys()].map((participantId) => (
              <Box
                key={participantId}
                sx={{
                  flex: participants.size === 1 ? "0 0 auto" : 1,
                  width: participants.size === 1 ? "auto" : "50%",
                  height: participants.size === 1 ? "auto" : "100%",
                  maxWidth: participants.size === 1 ? "80%" : "100%",
                  maxHeight: participants.size === 1 ? "80%" : "100%",
                  p: 1,
                }}
              >
                <ParticipantView participantId={participantId} />
              </Box>
            ))}
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <MeetingControls />
          </Box>
        </>
      ) : joined === "JOINING" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h4" sx={{ pr: "1.5rem" }}>
            Joining the meeting
          </Typography>
          <CircularProgress />
        </Box>
      ) : null}
    </Box>
  );
};

export default Meeting;
