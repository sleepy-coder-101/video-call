import { Fragment, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

import { useAppState } from "../context/AppStateContext";
import ParticipantView from "./ParticipantView";
import ControlsView from "./ControlsView";

const MeetingView = () => {
  const [joined, setJoined] = useState(null);
  const [totalFaceTime, setTotalFaceTime] = useState(0);

  const { meetingId, onMeetingLeave } = useAppState();

  const { join, participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      onMeetingLeave();
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <Fragment>
        <h3>Meeting Id: {meetingId}</h3>
        {joined && joined == "JOINED" ? (
          <div>
            <ControlsView />

            {[...participants.keys()].map((participantId) => (
              <ParticipantView
                participantId={participantId}
                key={participantId}
                onFaceTimeUpdate={setTotalFaceTime}
              />
            ))}
          </div>
        ) : joined && joined == "JOINING" ? (
          <p>Joining the meeting...</p>
        ) : (
          <button onClick={joinMeeting}>Join</button>
        )}
      </Fragment>
    </div>
  );
};

export default MeetingView;
