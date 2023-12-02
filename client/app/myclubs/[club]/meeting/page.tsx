"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { useParams } from "next/navigation";

export default function Page() {
  const [token, setToken] = useState("");
  const params = useParams();
  useEffect(() => {
    (async () => {
      try {
        const room = params.club;
        const name = nookies.get().user_name;
        const resp = await fetch(`/api/get-participant-token?room=${room}&username=${name}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [params]);

  if (token === "") {
    return <div>Getting token...</div>;
  }

  return (
    <LiveKitRoom
      video
      audio
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <VideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      {/* <ControlBar /> */}
    </LiveKitRoom>
  );
}

// function MyVideoConference() {
//   // `useTracks` returns all camera and screen share tracks. If a user
//   // joins without a published camera track, a placeholder track is returned.
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false },
//   );
//   return (
//     <GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
//       {/* The GridLayout accepts zero or one child. The child is used
//       as a template to render all passed in tracks. */}
//       <ParticipantTile />
//     </GridLayout>
//   );
// }
