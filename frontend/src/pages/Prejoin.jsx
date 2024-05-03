import { useEffect, useRef, useState } from "react";

import { Container, CssBaseline, Typography, Box, Button } from "@mui/material";

import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";

import { useMediaDevice } from "@videosdk.live/react-sdk";

const Prejoin = () => {
  const { requestPermission } = useMediaDevice();
  const videoRef = useRef(null);
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);

  const toggleMic = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !micOn;
      });
      setMicOn(!micOn);
    }
  };

  const toggleWebcam = () => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !webcamOn;
      });
      setWebcamOn(!webcamOn);
    }
  };

  useEffect(() => {
    const requestMediaPermission = async () => {
      try {
        const reqAudio = await requestPermission("audio");
        const reqVideo = await requestPermission("video");
        console.log("Permission requested for: ", reqAudio, reqVideo);
      } catch (error) {
        console.error("Error in requesting permissions");
      }
    };

    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
        stream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    requestMediaPermission();
    startMedia();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <Container>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100vh",
        }}
      >
        {/* Left Side Box */}
        {/* <Box sx={{}}>
          <video
            ref={videoRef}
            autoPlay
            style={{
              transform: "scaleX(-1)",
              borderRadius: "2rem",
            }}
          />
          <Button
            variant="contained"
            color={micOn ? "primary" : "secondary"}
            onClick={toggleMic}
          >
            {micOn ? "Mute" : "Unmute"}
          </Button>
          <Button
            variant="contained"
            color={webcamOn ? "primary" : "secondary"}
            onClick={toggleWebcam}
          >
            {webcamOn ? "Stop Video" : "Start Video"}
          </Button>
          <Typography>And basic devices here</Typography>
        </Box> */}
        {/* Modified Left box */}
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            // maxWidth: "100%",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            style={{
              transform: "scaleX(-1)",
              borderRadius: "2rem",
              width: "100%",
              height: "auto",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              variant="contained"
              color={micOn ? "primary" : "secondary"}
              onClick={toggleMic}
            >
              {micOn ? <MicIcon /> : <MicOffIcon />}
            </Button>
            <Button
              variant="contained"
              color={webcamOn ? "primary" : "secondary"}
              onClick={toggleWebcam}
            >
              {webcamOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </Button>
          </Box>
        </Box>
        {/* Right Side Box */}
        <Box>
          <Typography>
            And here are buttons to create or join meeting
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Prejoin;
