"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import EventInformation from "@/components/events/event/EventInformation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import EventDescription from "@/components/events/event/EventDescription";
import { Event } from "@/types/eventType";
import JoinEventForm from "@/components/events/event/JoinEventForm";
import EventMap from "@/components/events/event/EventMap";

const Page = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const clubId = params.club;
  const eventId = params.event;
  const queryClient = useQueryClient();

  async function fetchEventList() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}`);
    console.log(response.data);
    return response.data as Event;
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchEventList(),
    queryKey: ["event", clubId, eventId],
  });

  const joinEventMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-${data?.type!}`,
        {
          userId: nookies.get().user_id,
          name: nookies.get().user_name,
          email: nookies.get().user_email,
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      toast({
        title: "You have joined this event",
      });
      queryClient.invalidateQueries({ queryKey: ["event", clubId, eventId] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    },
  });
  async function joinOnlineEventHandler() {
    await joinEventMutation.mutateAsync();
  }

  const cancelEventParticipationMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/cancel`,
        {
          userId: nookies.get().user_id,
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      toast({
        title: "You have canceled your participation in this event",
      });
      queryClient.invalidateQueries({ queryKey: ["event", clubId, eventId] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    },
  });
  async function cancelEventParticipationHandler() {
    await cancelEventParticipationMutation.mutateAsync();
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  const isJoined =
    data?.onlineParticipants.some((participant) => participant.userId === nookies.get().user_id) ||
    data?.physicalParticipants.some((participant) => participant.userId === nookies.get().user_id);
  const iSNotCreator = data?.creator.userId !== nookies.get().user_id;

  const JoinEventButton = <Button onClick={joinOnlineEventHandler}>Join Event</Button>;
  const JoinEventSection = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Join Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription asChild>
            <JoinEventForm setOpen={setOpen} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  const CancelParticipationButton = <Button onClick={cancelEventParticipationHandler}>Cancel Participation</Button>;
  return (
    <div className="mx-auto mt-2">
      <h1 className="text-4xl my-3 text-center">{data?.title}</h1>
      <EventInformation data={data!} />
      <div className="my-2">
        <EventDescription description={data?.description!} />
      </div>
      {/* <div className="my-2">
        <EventMap place={data?.location!} />
      </div> */}
      <div className="mb-3">
        {iSNotCreator && !isJoined && (data?.type !== "hybrid" ? JoinEventButton : JoinEventSection)}
        {isJoined && CancelParticipationButton}
      </div>
    </div>
  );
};
export default Page;
