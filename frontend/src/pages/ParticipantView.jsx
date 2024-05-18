import { useRef, useMemo, useEffect } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import { Box } from "@mui/material";
import * as faceapi from "face-api.js";
import { useAppState } from "../context/AppStateContext";

const ParticipantView = (props) => {
  const micRef = useRef(null);
  const { totalFaceTime, setTotalFaceTime } = useAppState();
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  useEffect(() => {
    let intervalId;
    const detectFaces = async () => {
      if (webcamOn && isLocal) {
        const videoElement = document.createElement("video");
        videoElement.srcObject = videoStream;
        await videoElement.play();
        const detection = await faceapi.detectAllFaces(
          videoElement,
          new faceapi.TinyFaceDetectorOptions()
        );
        if (detection.length > 0) {
          setTotalFaceTime((prevTime) => {
            const updatedTime = prevTime + 1000;
            return updatedTime;
          });
        }
      }
    };

    if (webcamOn && isLocal) {
      intervalId = setInterval(detectFaces, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [webcamOn, isLocal, videoStream]);

  return (
    <Box
      key={props.participantId}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "1rem",
      }}
    >
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          url={videoStream}
          playing={true}
          muted={true}
          width="100%"
          height="100%"
          style={{
            transform: "scaleX(-1)",
            objectFit: "cover",
          }}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </Box>
  );
};

export default ParticipantView;
