import React, { useEffect, useState } from "react";

import { useMeeting } from "@videosdk.live/react-sdk";

import { Box, Button } from "@mui/material";

import MeetingControls from "../components/MeetingControls";
import MeetingView from "./MeetingView";

const Meeting = () => {
  const { join, meetingId } = useMeeting({});

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* <Button onClick={joinMeet}>Join Meet</Button> */}
      <MeetingView />
      <MeetingControls />
    </Box>
  );
};

export default Meeting;
