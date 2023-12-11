"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CalendarDays, MenuSquare, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Club, Event } from "@/types/userProfileType";

const Page = () => {
  const router = useRouter();
  const userId = nookies.get().user_id;

  async function fetchMyProfile(user: string) {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${user}/profile`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      }
      throw error;
    }
  }
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchMyProfile(userId),
    queryKey: ["myclubs", userId],
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    return (
      <div className="flex items-center">
        <p>請先登入帳號</p>
        <Button>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  const clubItems = data?.clubs?.map((club: Club) => (
    <Card key={club._id} className="min-w-[20rem] mb-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="mr-4">
              <AvatarImage src={club.picture} />
              <AvatarFallback>{club.name}</AvatarFallback>
            </Avatar>
            <CardTitle>
              <Link href={`/myclubs/${club._id}`} className="hover:underline">
                {club.name}
              </Link>
            </CardTitle>
          </div>
          <CardDescription>
            <p className="text-lg"> Creator:{club.owner.name}</p>
            <div className="flex items-center gap-3">
              <Users />
              <p className="text-lg">{club.members.length}</p>
            </div>
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  ));

  const eventItems = data.events.map((event: Event) => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString();
    const participantsNumber = event.onlineParticipants.length + event.physicalParticipants.length;
    return (
      <Card key={event._id} className="min-w-[20rem] mb-2">
        <CardHeader>
          <CardTitle>
            <Link href={`/myclubs/${event.clubId._id}/events/${event._id}`} className="hover:underline">
              {event.title}
            </Link>
          </CardTitle>
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
  return (
    <div className="mx-20 mt-2">
      <div className="flex gap-3 items-center">
        <MenuSquare />
        <p className="text-2xl py-2">Clubs</p>
      </div>
      <div className="flex gap-3 flex-wrap">{clubItems}</div>
      <div className="mt-3 flex gap-3 items-center">
        <CalendarDays />
        <p className="text-2xl py-2">Events</p>
      </div>
      <div className="flex gap-3 flex-wrap">{eventItems}</div>
    </div>
  );
};

export default Page;
