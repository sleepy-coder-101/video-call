import { createContext, useContext, useState } from "react";

import { createMeeting, fetchToken } from "../api";

// Create context
const AppStateContext = createContext({
  authToken: null,
  meetingId: null,
  lastMeetingId: null,
  meetingEnded: null,
  totalFaceTime: null,
  isAuthenticated: null,
  setAuthToken: () => {},
  setMeetingId: () => {},
  setLastMeetingId: () => {},
  setMeetingEnded: () => {},
  setTotalFaceTime: () => {},
  setIsAuthenticated: () => {},
});

// Provider component to wrap the app
export const AppStateProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [lastMeetingId, setLastMeetingId] = useState(null);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [totalFaceTime, setTotalFaceTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        isAuthenticated,
        setAuthToken,
        setMeetingId,
        setLastMeetingId,
        setMeetingEnded,
        setTotalFaceTime,
        setIsAuthenticated,

        getAuthToken,
        getMeetingId,
        onMeetingLeave,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to access the context
export const useAppState = () => useContext(AppStateContext);
