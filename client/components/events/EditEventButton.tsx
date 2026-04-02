"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Pencil } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Event } from "@/types/eventType";

const eventFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.enum(["online", "offline", "hybrid"]),
  location: z.string().optional(),
  maxPhysicalParticipants: z.string().optional(),
});

interface EditEventButtonProps {
  event: Event;
}

const EditEventButton: React.FC<EditEventButtonProps> = ({ event }) => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
      date: new Date(event.date),
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type as "online" | "offline" | "hybrid",
      location: event.location ?? "",
      maxPhysicalParticipants: String(event.maxPhysicalParticipants ?? 0),
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof eventFormSchema>) => {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${params.club}/events/${params.event}`,
        {
          title: values.title,
          description: values.description,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          type: values.type,
          location: values.location,
          maxPhysicalParticipants: Number(values.maxPhysicalParticipants),
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", params.club, params.event] });
      toast({ title: "活動已更新" });
      setOpen(false);
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        router.push("/login");
      } else {
        toast({ title: "更新失敗，請稍後再試", variant: "destructive" });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1.5" />
          編輯活動
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>編輯活動</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標題</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>選擇日期</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始時間</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>結束時間</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>類型</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="online">線上</SelectItem>
                      <SelectItem value="offline">實體</SelectItem>
                      <SelectItem value="hybrid">混合</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(form.watch("type") === "offline" || form.watch("type") === "hybrid") && (
              <>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>地點</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPhysicalParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>實體名額上限</FormLabel>
                      <FormControl><Input type="number" min={0} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "儲存中..." : "儲存變更"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventButton;
