"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Page() {
  const [token, setToken] = useState("");
  const params = useParams();
  const [usageTime, setUsageTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsageTime((prevTime) => prevTime + 1);
    }, 60000);

    return () => {
      clearInterval(interval);
      const recordUsage = async () => {
        const userId = nookies.get().user_id;
        try {
          const today = new Date().toISOString().split("T")[0];
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/usages`, {
            headers: { Authorization: `Bearer ${nookies.get().access_token}` },
            params: {
              date: today,
            },
          });
          console.log(response.data);
          if (response.data.exists) {
            await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/usages/${response.data.logId}`,
              {
                minutes: usageTime + response.data.logMinutes,
              },
              { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
            );
          } else {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/usages`,
              {
                minutes: usageTime,
              },
              { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
            );
          }
        } catch (error: any) {
          console.log("Error recording usage:", error.message);
        }
      };
      recordUsage();
    };
  }, []);
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
