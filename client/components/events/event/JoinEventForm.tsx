"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import nookies from "nookies";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  type: z.enum(["online", "offline"]),
});

interface JoinEventFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const JoinEventForm: React.FC<JoinEventFormProps> = ({ setOpen }) => {
  const params = useParams();
  const clubId = params.club;
  const eventId = params.event;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof FormSchema>) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-${values.type}`,
        {
          userId: nookies.get().user_id,
          name: nookies.get().user_name,
          picture: nookies.get().user_picture,
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      setOpen(false);
      toast({
        title: "You have joined this event",
      });
      queryClient.invalidateQueries({ queryKey: ["event", clubId, eventId] });
    },
    onError: (error: any) => {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await mutation.mutateAsync(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default JoinEventForm;
