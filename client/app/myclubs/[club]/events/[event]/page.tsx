"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import EventInformation from "@/components/events/event/EventInformation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import EventDescription from "@/components/events/event/EventDescription";
import { Event } from "@/types/eventType";
import JoinEventForm from "@/components/events/event/JoinEventForm";

const Page = () => {
  const params = useParams();
  const clubId = params.club;
  const eventId = params.event;
  const toast = useToast();
  async function fetchEventList() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}`);
    return response.data as Event;
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchEventList(),
    queryKey: ["eventList", clubId, eventId],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  async function joinOnlineEventHandler() {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-online`,
        {
          params: {
            userId: nookies.get().user_id,
            name: nookies.get().user_name,
            picture: nookies.get().user_picture,
          },
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    }
  }
  const isHidden =
    data?.creator.userId === nookies.get().user_id ||
    data?.onlineParticipants.some((participant) => participant.userId === nookies.get().user_id) ||
    data?.physicalParticipants.some((participant) => participant.userId === nookies.get().user_id);
  const JoinEventButton = <Button onClick={joinOnlineEventHandler}>Join Event</Button>;
  const JoinEventSection = (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <JoinEventForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  return (
    <div className="mx-auto mt-2">
      <h1 className="text-4xl mb-3">{data?.title}</h1>
      <EventInformation data={data!} />
      <div className="my-2">
        <EventDescription description={data?.description!} />
      </div>
      {!isHidden && (data?.type === "online" ? JoinEventButton : JoinEventSection)}
    </div>
  );
};
export default Page;
