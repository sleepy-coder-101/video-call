import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";
import { Outlet } from "react-router-dom";

import { useAppState } from "./context/AppStateContext";

import MeetingView from "./pages/MeetingView";

function App() {
  const { meetingId, authToken } = useAppState();

  // return <Outlet />;

  return !authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: false,
        webcamEnabled: true,
        name: "Monirul",
      }}
      token={authToken}
    >
      <MeetingConsumer>{() => <MeetingView />}</MeetingConsumer>
    </MeetingProvider>
  ) : (
    <Outlet />
  );
}

export default App;
