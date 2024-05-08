import { useState, Fragment, useEffect } from "react";
import { useMediaDevice } from "@videosdk.live/react-sdk";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";

import { useAppState } from "../context/AppStateContext";

const HomeScreen = () => {
  const navigate = useNavigate();

  const { requestPermission } = useMediaDevice();
  const { isAuthenticated } = useAppState();

  const checkCompatibility = () => {
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
    navigate("/signin");
  };

  // useEffect(() => {
  //   const loadModels = async () => {
  //     const model_url = import.meta.env.VITE_MODEL_URL;
  //     const newModel = await faceapi.loadTinyFaceDetectorModel(model_url);

  //     console.log("Model details: ", faceapi.nets.tinyFaceDetector);
  //   };

  //   loadModels();
  // }, []);

  return (
    <Fragment>
      <h1>Welcome to VistaVoice</h1>
      <Button variant="contained" onClick={checkCompatibility}>
        Start Now
      </Button>
    </Fragment>
  );
};

export default HomeScreen;
