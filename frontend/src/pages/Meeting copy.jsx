import React, { useState, useEffect, Fragment } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useAppState } from "../context/AppStateContext";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  Container,
  CssBaseline,
  CircularProgress,
} from "@mui/material";

import ParticipantView from "./ParticipantView";
import MeetingControls from "../components/MeetingControls";

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
    <Box>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {joined === "JOINED" ? (
          <Fragment>
            <Box
              sx={{
                flex: 1,
                overflow: "auto",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",

                // display: "grid",
                // gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                // gap: 2,
                // p: 2,
              }}
            >
              {[...participants.keys()].map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                />
              ))}
            </Box>
            <Box>
              <MeetingControls />
            </Box>
          </Fragment>
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
            <Typography variant="h4" sx={{ pr: "2rem" }}>
              Joining the meeting
            </Typography>
            <CircularProgress />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default MeetingView;
