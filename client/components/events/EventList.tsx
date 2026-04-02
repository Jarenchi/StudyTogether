"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Users, Clock, CalendarDays } from "lucide-react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { Event } from "@/types/eventType";

const EventList = () => {
  const params = useParams();
  const clubId = params.club;

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () => axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`).then((r) => r.data),
    queryKey: ["eventList", clubId],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="無法載入活動" description="請確認網路連線後再試。" onRetry={() => refetch()} />;
  }

  if (!data?.length) {
    return <EmptyState icon={CalendarDays} title="尚無活動" description="建立第一個活動開始聚會吧！" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((event: Event) => {
        const formattedDate = new Date(event.date).toLocaleDateString("zh-TW");
        const total = event.onlineParticipants.length + event.physicalParticipants.length;
        return (
          <Link key={event._id} href={`events/${event._id}`}>
            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold truncate leading-snug">{event.title}</p>
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
                <p className="text-xs text-muted-foreground">主辦：{event.creator.name}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default EventList;
