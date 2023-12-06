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
        const room = params.event;
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
      data-lk-theme="default"
      style={{ height: "100dvh" }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
