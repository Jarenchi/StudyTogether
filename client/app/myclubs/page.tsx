"use client";

import { useQuery } from "@tanstack/react-query";
import nookies from "nookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CalendarDays, BookOpen, Users, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Club, Event } from "@/types/userProfileType";

const Page = () => {
  const router = useRouter();
  const userId = nookies.get().user_id;

  async function fetchMyProfile(user: string) {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${user}/profile`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    return response.data;
  }

  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchMyProfile(userId),
    queryKey: ["myclubs", userId],
    throwOnError: (error: any) => {
      if (error?.response?.status === 403) router.push("/login");
      return false;
    },
  });

  if (isLoading)
    return (
      <div className="max-w-5xl px-4 py-6 space-y-8">
        <Skeleton className="h-7 w-24" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-7 w-24" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );

  if (isError) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* My Clubs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-xl">我的讀書會</h2>
          <Badge variant="secondary" className="ml-1">{data?.clubs?.length ?? 0}</Badge>
        </div>
        {data?.clubs?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.clubs.map((club: Club) => (
              <Link key={club._id} href={`/myclubs/${club._id}`}>
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={club.picture} />
                      <AvatarFallback className="font-semibold">{club.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold truncate leading-snug">{club.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Users className="h-3 w-3" />
                        <span>{club.members.length} 人</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">尚未加入任何讀書會</p>
        )}
      </section>

      {/* My Events */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-xl">我的活動</h2>
          <Badge variant="secondary" className="ml-1">{data?.events?.length ?? 0}</Badge>
        </div>
        {data?.events?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.events.map((event: Event) => {
              const formattedDate = new Date(event.date).toLocaleDateString("zh-TW");
              const total = event.onlineParticipants.length + event.physicalParticipants.length;
              return (
                <Link key={event._id} href={`/myclubs/${event.clubId._id}/events/${event._id}`}>
                  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <p className="font-semibold truncate mb-2">{event.title}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formattedDate} {event.startTime}–{event.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {total} 人參加
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">尚未報名任何活動</p>
        )}
      </section>
    </div>
  );
};

export default Page;
