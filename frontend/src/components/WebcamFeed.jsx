import { Fragment, useRef, useState, useEffect } from "react";

import { useMediaDevice } from "@videosdk.live/react-sdk";

import { Box, Button, IconButton } from "@mui/material";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";

import DeviceList from "../components/DeviceList";
import { useAppState } from "../context/AppStateContext";

const WebcamFeed = () => {
  const { requestPermission } = useMediaDevice();
  const {
    mediaStream,
    setMediaStream,
    toggleMic,
    toggleWebcam,
    micOn,
    webcamOn,
  } = useAppState();

  const videoRef = useRef(null);
  // const [micOn, setMicOn] = useState(false);
  // const [webcamOn, setWebcamOn] = useState(false);
  // const [mediaStream, setMediaStream] = useState(null);

  // const toggleMic = () => {
  //   if (mediaStream) {
  //     const audioTracks = mediaStream.getAudioTracks();
  //     audioTracks.forEach((track) => {
  //       track.enabled = !micOn;
  //     });
  //     setMicOn(!micOn);
  //   }
  // };

  // const toggleWebcam = () => {
  //   if (mediaStream) {
  //     const videoTracks = mediaStream.getVideoTracks();
  //     videoTracks.forEach((track) => {
  //       track.enabled = !webcamOn;
  //     });
  //     setWebcamOn(!webcamOn);
  //   }
  // };

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
    <Fragment>
      {/* Contains the video box element */}
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          flexBasis: { xs: "90%", md: "100%" },
          // maxWidth: "50%",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          style={{
            transform: "scaleX(-1)",
            borderRadius: "1rem",
            width: "100%",
            // height: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <IconButton
            sx={{
              backgroundColor: micOn ? "#808080" : "#808080",
              color: "white",
              "&:hover": {
                backgroundColor: micOn ? "#ff7b7b" : "#40e56b",
              },
            }}
            size="large"
            onClick={toggleMic}
          >
            {micOn ? (
              <MicIcon sx={{ color: "inherit" }} />
            ) : (
              <MicOffIcon sx={{ color: "inherit" }} />
            )}
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: webcamOn ? "#808080" : "#808080",
              color: "white",
              "&:hover": {
                backgroundColor: webcamOn ? "#ff7b7b" : "#40e56b",
              },
            }}
            size="large"
            onClick={toggleWebcam}
          >
            {webcamOn ? (
              <VideocamIcon sx={{ color: "inherit" }} />
            ) : (
              <VideocamOffIcon sx={{ color: "inherit" }} />
            )}
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          mt: { xs: "0.5rem", md: "1rem" },
          flexBasis: { xs: "90%", md: "100%" },
        }}
      >
        <DeviceList />
      </Box>
    </Fragment>
  );
};

export default WebcamFeed;
