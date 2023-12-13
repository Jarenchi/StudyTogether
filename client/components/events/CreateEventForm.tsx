"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "../ui/textarea";

const eventFormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  description: z.string(),
  date: z.date(),
  startTime: z.string(),
  endTime: z.string(),
  hasSharedFile: z.boolean().default(false).optional(),
  type: z.enum(["online", "offline", "hybrid"]),
  location: z.string().optional(),
  maxPhysicalParticipants: z.string().optional(),
});

interface CreateEventFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ setOpen }) => {
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      startTime: "00:00",
      endTime: "00:00",
      hasSharedFile: false,
      location: "",
      maxPhysicalParticipants: "0",
    },
  });
  const clubId = params.club;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof eventFormSchema>) => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events`,
        {
          title: values.title,
          date: values.date,
          startTime: values.startTime,
          endTime: values.endTime,
          description: values.description,
          type: values.type,
          hasSharedFile: values.hasSharedFile,
          location: values.location,
          maxPhysicalParticipants: Number(values.maxPhysicalParticipants),
          creator: {
            id: nookies.get().user_id,
            name: nookies.get().user_name,
            picture: nookies.get().user_image,
          },
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
      if (values.hasSharedFile) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/docs`,
          {
            title: values.title,
            content: "",
            creator: {
              id: nookies.get().user_id,
              name: nookies.get().user_name,
              picture: nookies.get().user_image,
            },
          },
          { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventList", clubId] });
      toast({ title: "event created successfully" });
      setOpen(false);
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        console.log(error);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    await mutation.mutateAsync(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
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
                <FormLabel>startTime</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>endTime</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description about your event" className="resize-none" {...field} />
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
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online">online</SelectItem>
                    <SelectItem value="offline">offline</SelectItem>
                    <SelectItem value="hybrid">hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(form.watch("type") === "offline" || form.watch("type") === "hybrid") && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {(form.watch("type") === "offline" || form.watch("type") === "hybrid") && (
          <FormField
            control={form.control}
            name="maxPhysicalParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Physical Attendees</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="hasSharedFile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Create Shared Document</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="text-right">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreateEventForm;
