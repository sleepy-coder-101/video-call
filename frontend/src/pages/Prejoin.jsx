import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  CssBaseline,
  Box,
  Button,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useAppState } from "../context/AppStateContext";
import WebcamFeed from "../components/WebcamFeed";

const Prejoin = () => {
  const navigate = useNavigate();

  const {
    meetingId,
    getMeetingId,
    getAuthToken,
    setMeetingId,
    clearUserData,
    user,
  } = useAppState();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasClickedJoin, setHasClickedJoin] = useState(false);
  const [enteredMeetingId, setEnteredMeetingId] = useState("");

  const onCreateMeeting = async () => {
    setLoading(true);
    await getMeetingId();
    setLoading(false);
  };

  const onJoinMeeting = async () => {
    setHasClickedJoin(true);
  };

  const onJoinSubmit = () => {
    setMeetingId(enteredMeetingId);
  };

  const handleLogout = () => {
    clearUserData();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingId).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  // useEffect(() => {
  //   const isTokenValid = checkTokenValidity();
  //   if (!isTokenValid) {
  //     navigate("/signin");
  //   }
  // }, []);

  useEffect(() => {
    const fetchTokenOnRender = async () => {
      await getAuthToken();
    };

    fetchTokenOnRender();
  }, []);

  return (
    <Container>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: { xs: "space-around", md: "space-between" },
          height: "100vh",
        }}
      >
        {/* Modified left side */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            flexBasis: { xs: "100%", md: "55%" },
          }}
        >
          <WebcamFeed />
        </Box>

        {/* Right Side Box */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            flexBasis: { xs: "80%", md: "37%" },
          }}
        >
          {loading ? (
            <Box
              sx={{
                flexBasis: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6" sx={{ p: "1rem" }}>
                Fetching Meeting ID
              </Typography>
              <CircularProgress />
            </Box>
          ) : !loading && meetingId ? (
            <Box
              sx={{
                flexBasis: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ py: "1rem", fontSize: "1.1rem" }}
                >
                  Meeting ID: {meetingId}
                </Typography>
                <Tooltip
                  placement="top"
                  title={copied ? "Copied!" : "Copy Meeting ID"}
                >
                  <IconButton onClick={copyToClipboard} sx={{ ml: "0.3rem" }}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Button size="large" variant="contained" fullWidth>
                Join Meeting
              </Button>
            </Box>
          ) : hasClickedJoin ? (
            <Box sx={{ flexBasis: "100%" }}>
              <TextField
                fullWidth
                required
                margin="normal"
                id="meetingId"
                label="Enter Meeting ID"
                name="meetingId"
                autoComplete="false"
                autoFocus
                value={enteredMeetingId}
                onChange={(e) => setEnteredMeetingId(e.target.value)}
              />
              <Button
                size="large"
                variant="contained"
                fullWidth
                sx={{ my: "0.9rem" }}
                onClick={onJoinSubmit}
                disabled={enteredMeetingId.length != 14}
              >
                Submit
              </Button>
            </Box>
          ) : (
            <Box sx={{ flexBasis: "100%", textAlign: "center" }}>
              <Typography variant="h4" sx={{ pb: "3rem" }}>
                Welcome, {user.username}
              </Typography>

              {/* only teachers can create meetings */}
              {/* {user.role === "teacher" && (
                <Box sx={{ flexBasis: "100%", my: "0.9rem" }}>
                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={onCreateMeeting}
                  >
                    Create a Meeting
                  </Button>
                </Box>
              )} */}

              <Box sx={{ flexBasis: "100%", my: "0.9rem" }}>
                <Button
                  size="large"
                  variant="contained"
                  fullWidth
                  onClick={onCreateMeeting}
                >
                  Create a Meeting
                </Button>
              </Box>
              <Box sx={{ flexBasis: "100%", my: "0.9rem" }}>
                <Button
                  size="large"
                  variant="outlined"
                  fullWidth
                  onClick={onJoinMeeting}
                >
                  Join a Meeting
                </Button>
              </Box>

              <Box sx={{ flexBasis: "100%", my: "0.9rem" }}>
                <Button
                  size="large"
                  variant="outlined"
                  fullWidth
                  onClick={handleLogout}
                >
                  Logout User
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Prejoin;
