"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import nookies from "nookies";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EventInformation from "@/components/events/event/EventInformation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import EventDescription from "@/components/events/event/EventDescription";
import { Event } from "@/types/eventType";
import JoinEventForm from "@/components/events/event/JoinEventForm";
import EventMap from "@/components/events/event/EventMap";
import EditEventButton from "@/components/events/EditEventButton";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ui/ErrorState";
import { handleApiError } from "@/utils/handleApiError";

const Page = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const clubId = params.club;
  const eventId = params.event;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryFn: () =>
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}`).then((r) => r.data as Event),
    queryKey: ["event", clubId, eventId],
  });

  const joinEventMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-${data?.type}`,
        { userId: nookies.get().user_id, name: nookies.get().user_name, email: nookies.get().user_email },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      toast({ title: "已成功報名活動" });
      queryClient.invalidateQueries({ queryKey: ["event", clubId, eventId] });
    },
    onError: (error: any) => handleApiError(error, router),
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/cancel`,
        { userId: nookies.get().user_id },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      toast({ title: "已取消報名" });
      queryClient.invalidateQueries({ queryKey: ["event", clubId, eventId] });
    },
    onError: (error: any) => handleApiError(error, router),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState title="無法載入活動" description="請確認網路連線後再試。" onRetry={() => refetch()} />;
  }

  const isJoined =
    data?.onlineParticipants.some((p) => p.userId === nookies.get().user_id) ||
    data?.physicalParticipants.some((p) => p.userId === nookies.get().user_id);
  const isCreator = data?.creator.userId === nookies.get().user_id;

  const JoinOnlineButton = (
    <Button onClick={() => joinEventMutation.mutate()} disabled={joinEventMutation.isPending}>
      {joinEventMutation.isPending ? "報名中..." : "報名參加"}
    </Button>
  );
  const JoinHybridSection = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>報名參加</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>選擇參加方式</DialogTitle>
        </DialogHeader>
        <JoinEventForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-3xl font-bold leading-tight">{data?.title}</h1>
        {isCreator && <EditEventButton event={data!} />}
      </div>
      <EventInformation data={data!} />
      <EventDescription description={data?.description!} />
      <EventMap place={data?.location!} />
      <div className="flex gap-2">
        {!isCreator && !isJoined && (data?.type !== "hybrid" ? JoinOnlineButton : JoinHybridSection)}
        {isJoined && (
          <Button variant="outline" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
            {cancelMutation.isPending ? "取消中..." : "取消報名"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Page;
