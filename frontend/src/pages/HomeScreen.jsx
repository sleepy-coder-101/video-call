import { useState, Fragment, useEffect } from "react";
import { useMediaDevice } from "@videosdk.live/react-sdk";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";

import { Button } from "@mui/material";

import { useAppState } from "../context/AppStateContext";
import JoinScreen from "./JoinScreen";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [hasClickedStart, setHasClickedStart] = useState(null);

  const { requestPermission } = useMediaDevice();
  const { getAuthToken } = useAppState();

  const checkCompatibility = () => {
    setHasClickedStart(true);

    const requestMediaPermission = async () => {
      try {
        const requestAudioVideoPermission = await requestPermission(
          "audio_video"
        );
        console.log("Permission requested for: ", requestAudioVideoPermission);
      } catch (error) {
        console.error("Error in requesting Audio Video Permission", error);
      }
    };

    requestMediaPermission();
    navigate("/meeting");
  };

  useEffect(() => {
    const loadModels = async () => {
      const model_url = import.meta.env.VITE_MODEL_URL;
      const newModel = await faceapi.loadTinyFaceDetectorModel(model_url);

      console.log("Model details: ", faceapi.nets.tinyFaceDetector);
    };

    loadModels();
    getAuthToken();
  }, []);

  return hasClickedStart ? (
    <JoinScreen />
  ) : (
    <Fragment>
      <h1>Welcome to VistaVoice</h1>
      <Button variant="contained" onClick={checkCompatibility}>
        Start Now
      </Button>
    </Fragment>
  );
};

export default HomeScreen;
