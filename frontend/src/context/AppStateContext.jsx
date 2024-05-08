import { createContext, useContext, useState, useEffect } from "react";

import { createMeeting, fetchToken } from "../api";
import { decodeToken } from "../utils/tokenUtils";

// Create context
const AppStateContext = createContext({
  authToken: null,
  meetingId: null,
  lastMeetingId: null,
  meetingEnded: null,
  totalFaceTime: null,
  user: null,
  micOn: null,
  webcamOn: null,
  setAuthToken: () => {},
  setMeetingId: () => {},
  setLastMeetingId: () => {},
  setMeetingEnded: () => {},
  setTotalFaceTime: () => {},
  setUser: () => {},
  setMicOn: () => {},
  setWebcamOn: () => {},
});

// Provider component to wrap the app
export const AppStateProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [lastMeetingId, setLastMeetingId] = useState(null);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [totalFaceTime, setTotalFaceTime] = useState(0);
  const [user, setUser] = useState(null);
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

  const checkTokenValidity = () => {
    console.log("This code part is run on refreshes");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUser({ username: decodedToken.username, role: decodedToken.role });
          return true;
        } else {
          console.error("Invalid token");
          localStorage.removeItem("token");
          return false;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        return false;
      }
    }
    return false;
  };

  const setUserData = (token) => {
    try {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        console.log(decodedToken);
        console.log(decodedToken.username);
        console.log(decodedToken.role);
        setUser({ username: decodedToken.username, role: decodedToken.role });
        localStorage.setItem("token", token);
      } else {
        console.error("Invalid token");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const clearUserData = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const getAuthToken = async () => {
    const newAuthToken = await fetchToken();
    setAuthToken(newAuthToken);
  };

  const getMeetingId = async () => {
    const newMeetingId = await createMeeting(authToken);
    setMeetingId(newMeetingId);
  };

  const onMeetingLeave = async () => {
    setLastMeetingId(meetingId);
    setMeetingId(null);
    setMeetingEnded(true);
  };

  return (
    <AppStateContext.Provider
      value={{
        authToken,
        meetingId,
        lastMeetingId,
        meetingEnded,
        totalFaceTime,
        user,
        micOn,
        webcamOn,
        mediaStream,
        setAuthToken,
        setMeetingId,
        setLastMeetingId,
        setMeetingEnded,
        setTotalFaceTime,
        setUser,
        setMicOn,
        setWebcamOn,
        setMediaStream,

        getAuthToken,
        getMeetingId,
        onMeetingLeave,
        setUserData,
        clearUserData,
        checkTokenValidity,
        toggleMic,
        toggleWebcam,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to access the context
export const useAppState = () => useContext(AppStateContext);
