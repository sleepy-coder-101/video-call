import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";

import { useAppState } from "../context/AppStateContext";
import Meeting from "./Meeting";

const MeetingContainer = () => {
  const { meetingId, authToken, micOn, webcamOn, user } = useAppState();

  return (
    // <MeetingProvider
    //   config={{
    //     meetingId: meetingId,
    //     micEnabled: micOn,
    //     webcamEnabled: webcamOn,
    //     name: user.username,
    //   }}
    //   token={authToken}
    // >
    //   <MeetingConsumer>{() => <Meeting />}</MeetingConsumer>
    // </MeetingProvider>

    <MeetingProvider
      config={{
        meetingId,
        micEnabled: micOn,
        webcamEnabled: webcamOn,
        name: user.username,
      }}
      token={authToken}
    >
      <Meeting />
    </MeetingProvider>
  );
};

export default MeetingContainer;
