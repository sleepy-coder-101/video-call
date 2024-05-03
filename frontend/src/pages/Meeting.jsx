import { MeetingProvider, MeetingConsumer } from "@videosdk.live/react-sdk";

const Meeting = () => {
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
  </MeetingProvider>;
};

export default Meeting;
