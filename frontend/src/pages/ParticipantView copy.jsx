import { useRef, useMemo, useEffect, useState, Fragment } from "react";

import { useParticipant } from "@videosdk.live/react-sdk";

import ReactPlayer from "react-player";

import * as faceapi from "face-api.js";
import { useAppState } from "../context/AppStateContext";

const ParticipantView = (props) => {
  const micRef = useRef(null);
  const videoRef = useRef(null);

  // const [totalFaceTime, setTotalFaceTime] = useState(0);
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
      if (videoRef.current && webcamOn && isLocal) {
        const videoElement = videoRef.current.getInternalPlayer();
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
  }, [webcamOn, props.onFaceTimeUpdate, isLocal]);

  return (
    <div key={props.participantId}>
      {/* <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p> */}
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn && (
        <Fragment>
          {/* {isLocal && (
            <p>
              Total face detection time: {Math.floor(totalFaceTime / 1000)}{" "}
              seconds
            </p>
          )} */}
          <ReactPlayer
            ref={videoRef}
            // playsinline // very very imp prop
            pip={false}
            light={false}
            controls={false}
            muted={true}
            playing={true}
            //
            url={videoStream}
            // url={videoRef}
            //
            style={{ transform: "scaleX(-1)" }}
            // height={"200px"}
            // width={"300px"}
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        </Fragment>
      )}
    </div>
  );
};

export default ParticipantView;
