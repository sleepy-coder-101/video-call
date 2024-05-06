import { useEffect, useState, Fragment } from "react";

import {
  useMediaDevice,
  createCameraVideoTrack,
  createMicrophoneAudioTrack,
} from "@videosdk.live/react-sdk";

import { Box } from "@mui/material";
import DropdownEl from "./DropdownEl";

const DeviceList = () => {
  var onDeviceChanged = (devices) => {
    // console.log("Devices changed", devices);
  };

  const { getCameras, getMicrophones, getPlaybackDevices, encoderConfig } =
    useMediaDevice({ onDeviceChanged });

  const [webcams, setWebcams] = useState([]);
  const [mics, setMics] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  const [selectedMicId, setSelectedMicId] = useState(null);
  const [selectedWebcamId, setSelectedWebcamId] = useState(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const webcam = await getCameras();
        const mic = await getMicrophones();
        const speaker = await getPlaybackDevices();

        setWebcams(webcam);
        setMics(mic);
        setSpeakers(speaker);
      } catch (error) {
        console.error("Error in fetching devices", error);
      }
    };

    getMediaDevices();
  }, [onDeviceChanged]);

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

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
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
    </Box>
  );
};

export default DeviceList;
