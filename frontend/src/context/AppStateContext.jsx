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
  isAuthenticated: null,
  user: null,
  setAuthToken: () => {},
  setMeetingId: () => {},
  setLastMeetingId: () => {},
  setMeetingEnded: () => {},
  setTotalFaceTime: () => {},
  setIsAuthenticated: () => {},
  setUser: () => {},
});

// Provider component to wrap the app
export const AppStateProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [meetingId, setMeetingId] = useState(null);
  const [lastMeetingId, setLastMeetingId] = useState(null);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [totalFaceTime, setTotalFaceTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const checkTokenValidity = () => {
    console.log("This code part is run on refreshes");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUser({ username: decodedToken.username, role: decodedToken.role });
          return true; // Token is valid
        } else {
          // Clear the token from local storage if it's invalid
          console.error("Invalid token");
          localStorage.removeItem("token");
          return false; // Token is invalid
        }
      } catch (error) {
        // Handle error while decoding token
        // Clear the token from local storage if there's an error
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        return false; // Token is invalid
      }
    }
    return false; // No token found
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
        // Handle invalid token
        console.error("Invalid token");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Handle error while decoding token
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
        isAuthenticated,
        user,
        setAuthToken,
        setMeetingId,
        setLastMeetingId,
        setMeetingEnded,
        setTotalFaceTime,
        setIsAuthenticated,
        setUser,

        getAuthToken,
        getMeetingId,
        onMeetingLeave,
        setUserData,
        clearUserData,
        checkTokenValidity,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook to access the context
export const useAppState = () => useContext(AppStateContext);
