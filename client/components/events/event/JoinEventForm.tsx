"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import nookies from "nookies";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { handleApiError } from "@/utils/handleApiError";

const FormSchema = z.object({
  type: z.enum(["online", "offline"]),
});

interface JoinEventFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinEventForm: React.FC<JoinEventFormProps> = ({ setOpen }) => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.club;
  const eventId = params.event;
  const form = useForm<z.infer<typeof FormSchema>>({ resolver: zodResolver(FormSchema) });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof FormSchema>) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/events/${eventId}/join-${values.type}`,
        { userId: nookies.get().user_id, name: nookies.get().user_name },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      setOpen(false);
      toast({ title: "已成功報名活動" });
      queryClient.invalidateQueries({ queryKey: ["event", clubId, eventId] });
    },
    onError: (error: any) => handleApiError(error, router),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇參加方式" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="online">線上參加</SelectItem>
                  <SelectItem value="offline">實體參加</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "報名中..." : "確認報名"}
        </Button>
      </form>
    </Form>
  );
};

export default JoinEventForm;
