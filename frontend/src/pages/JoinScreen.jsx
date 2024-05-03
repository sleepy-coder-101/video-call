import { useState, useEffect, useRef } from "react";

import {
  useMediaDevice,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
} from "@videosdk.live/react-sdk";

import { Button, Container, TextField } from "@mui/material";

import DropdownEl from "../components/DropdownEl";
import { useAppState } from "../context/AppStateContext";
import { useNavigate } from "react-router-dom";

const JoinScreen = () => {
  const navigate = useNavigate();

  var onDeviceChanged = (devices) => {
    // console.log("Devices changed", devices);
  };

  const { getCameras, getMicrophones, getPlaybackDevices, encoderConfig } =
    useMediaDevice({ onDeviceChanged });

  const [mics, setMics] = useState([]);
  const [webcams, setWebcams] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  const [selectedMicId, setSelectedMicId] = useState(null);
  const [selectedWebcamId, setSelectedWebcamId] = useState(null);

  const videoRef = useRef(null);
  const meetingIdRef = useRef(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const webcams = await getCameras();
        const mics = await getMicrophones();
        const speakers = await getPlaybackDevices();

        setMics(mics);
        setSpeakers(speakers);
        setWebcams(webcams);
      } catch (error) {
        console.error("Error in getting the media devices", error);
      }
    };

    getMediaDevices();
  }, [onDeviceChanged]);

  useEffect(() => {
    const fetchTokenOnRender = async () => {
      await getAuthToken();
    };

    fetchTokenOnRender();
  }, []);

  const getMediaTracks = async () => {
    // Get the audio track
    try {
      const customAudioStream = await createMicrophoneAudioTrack({
        microphoneId: selectedMicId,
      });
      const audioTracks = customAudioStream?.getAudioTracks();
      const audioTrack = audioTracks.length ? audioTracks[0] : null;
      console.log("Audio track: ", audioTrack);
    } catch (err) {
      console.error("Error in getting audio track", err);
    }

    // Get the video track
    try {
      const customVideoStream = await createCameraVideoTrack({
        cameraId: selectedWebcamId,
        encoderConfig: encoderConfig ? encoderConfig : "h540p_w960p",
        optimizationMode: "motion",
        multiStream: false,
      });
      const videoTracks = customVideoStream?.getVideoTracks();
      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      console.log("Video track: ", videoTrack);
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([videoTrack]);
      }
    } catch (err) {
      console.error("Error in getting video track", err);
    }
  };

  const handleMicChange = (micID) => {
    console.log("MicrophoneID: ", micID);
    setSelectedMicId(micID);
    getMediaTracks();
  };

  const handleWebcamChange = (webcamID) => {
    console.log(webcamID);
    setSelectedWebcamId(webcamID);
    getMediaTracks();
  };

  const handleSpeakerChange = (speakerID) => {
    console.log(speakerID);
  };

  /* From here */
  const { getAuthToken, getMeetingId, setMeetingId, isAuthenticated } =
    useAppState();

  const onCreateMeeting = async () => {
    await getMeetingId();
    // navigate("/prejoin");
  };

  const onJoinMeeting = async () => {
    const inputMeetingId = meetingIdRef.current.value;
    setMeetingId(inputMeetingId);
    // navigate("/prejoin");
  };

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ transform: "scaleX(-1)" }}
        />

        <DropdownEl
          array={mics}
          attribute="Microphone"
          onItemChange={handleMicChange}
        />
        <DropdownEl
          array={speakers}
          attribute="Speaker"
          onItemChange={handleSpeakerChange}
        />
        <DropdownEl
          array={webcams}
          attribute="Camera"
          onItemChange={handleWebcamChange}
        />

        <TextField
          id="outlined-basic"
          variant="outlined"
          type="text"
          placeholder="Enter Meeting ID"
          inputRef={meetingIdRef}
        />
        <Button variant="contained" onClick={onJoinMeeting}>
          Join a Meeting
        </Button>

        <Button variant="outlined" onClick={onCreateMeeting}>
          Create a Meeting
        </Button>
      </Container>
    </Container>
  );
};

export default JoinScreen;
