import { createContext, useContext, useState } from "react";

import { createMeeting, fetchMeetingDuration, fetchToken } from "../api";

// Create context
const AppStateContext = createContext({
  meetingId: null,
  authToken: null,
  setMeetingId: () => {},
  onMeetingLeave: () => {},
  getAuthToken: () => {},
  getMeetingId: () => {},
});

// Provider component to wrap the app
export const AppStateProvider = ({ children }) => {
  const [meetingId, setMeetingId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [meetingEnded, setMeetingEnded] = useState(false);

  const getAuthToken = async () => {
    const newAuthToken = await fetchToken();
    setAuthToken(newAuthToken);
  };

  const getMeetingId = async () => {
    const newMeetingId = await createMeeting();
    setMeetingId(newMeetingId);
  };

  const onMeetingLeave = async () => {
    setMeetingId(null);
    setMeetingEnded(true);
    // await fetchMeetingDuration();
  };

  return (
    <AppStateContext.Provider
      value={{
        meetingId,
        authToken,
        meetingEnded,
        setMeetingId,
        setMeetingEnded,
        onMeetingLeave,
        getAuthToken,
        getMeetingId,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to access the context
export const useAppState = () => useContext(AppStateContext);
