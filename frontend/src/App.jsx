import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";

import { useAppState } from "./context/AppStateContext";

import HomeScreen from "./pages/HomeScreen";
import MeetingView from "./pages/MeetingView";
import MeetingSummary from "./pages/MeetingSummary";

function App() {
  const { meetingId, authToken, meetingEnded } = useAppState();
  console.log("Meeting id: ", meetingId);
  console.log("Auth token: ", authToken);

  if (meetingEnded) {
    return <MeetingSummary />;
  }

  return authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Monirul",
      }}
      token={authToken}
    >
      <MeetingConsumer>{() => <MeetingView />}</MeetingConsumer>
    </MeetingProvider>
  ) : (
    <HomeScreen />
  );
}

export default App;
