"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Users, Clock } from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/eventType";

const EventList = () => {
  const params = useParams();
  const clubId = params.club;
  async function fetchEventList() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`);
    return response.data;
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchEventList(),
    queryKey: ["eventList", clubId],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>500 Internal Server Error</div>;
  const eventItems = data.map((event: Event) => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString();
    const participantsNumber = event.onlineParticipants.length + event.physicalParticipants.length;
    return (
      <Card key={event._id} className="min-w-[25rem] mb-2">
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
                Creator:
                {event.creator.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <Clock />
            <span className="ml-2">{formattedDate}</span>
            <span className="ml-2">
              {event.startTime}-{event.endTime}
            </span>
          </div>
          <div className="flex mt-2">
            <Users />
            <span className="ml-2">Total Participants :</span>
            <span className="ml-2">{participantsNumber}</span>
          </div>
        </CardContent>
      </Card>
    );
  });

  return <div className="flex gap-2 flex-wrap">{eventItems}</div>;
};

export default EventList;
