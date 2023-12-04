"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import nookies from "nookies";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventInformation from "@/components/events/event/EventInformation";

import { Button } from "@/components/ui/button";
import EventDescription from "@/components/events/event/EventDescription";

interface Event {
  creator: Creator;
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
  maxPhysicalParticipants: number;
  clubId: string;
  physicalParticipants: any[];
  onlineParticipants: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Creator {
  userId: string;
  name: string;
  picture: string;
}

const Page = () => {
  const params = useParams();
  const clubId = params.club;
  const eventId = params.event;
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
  async function joinOnlineEventHandler() {}
  const JoinEventButton = <Button onClick={joinOnlineEventHandler}>Join Event</Button>;
  const JoinEventSection = (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  return (
    <div>
      <h1 className="text-4xl mb-3">{data.title}</h1>
      <EventInformation data={data} />
      <div className="mt-2">
        <EventDescription description={data.description} />
      </div>
      {data?.type === "online" ? JoinEventButton : JoinEventSection}
    </div>
  );
};
export default Page;
