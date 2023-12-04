"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import nookies from "nookies";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const EventList = () => {
  const params = useParams();
  const clubId = params.club;
  async function fetchEventList() {
    console.log(clubId);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`);
    return response.data;
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchEventList(),
    queryKey: ["eventList", clubId],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  console.log(data);
  const eventItems = data.map((event: Event) => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString();
    const participantsNumber = event.onlineParticipants.length + event.physicalParticipants.length;
    return (
      <Card key={event._id} className="min-w-[20rem] mb-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CardTitle>
                <Link href={`events/${event._id}`} className="hover:underline">
                  {event.title}
                </Link>
              </CardTitle>
            </div>
            <div>
              <CardDescription>
                建立者:
                {event.creator.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>{formattedDate}</p>
          <div className="flex">
            <p className="mr-2">時間 :</p>
            <p>{event.startTime}</p>
            <span className="mx-2">-</span>
            <p>{event.endTime}</p>
          </div>
          <p>參與人數: {participantsNumber}</p>
        </CardContent>
      </Card>
    );
  });

  return <div className="flex">{eventItems}</div>;
};

export default EventList;
