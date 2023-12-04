"use client";

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
  type: z.enum(["online", "physical"]),
});

const JoinEventForm = () => {
  const params = useParams();
  const clubId = params.club;
  const eventId = params.event;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values.type);
    try {
      if (values.type === "online") {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-online`,
          {
            params: {
              userId: nookies.get().user_id,
              name: nookies.get().user_name,
              picture: nookies.get().user_picture,
            },
          },
          { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
        );
        toast({
          title: "You joined this event",
        });
      }
      if (values.type === "physical") {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-physical`,
          {
            params: {
              userId: nookies.get().user_id,
              name: nookies.get().user_name,
              picture: nookies.get().user_picture,
            },
          },
          { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
        );
      }
      toast({
        title: "You joined this event",
      });
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    }
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
                  <SelectItem value="physical">Physical</SelectItem>
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
