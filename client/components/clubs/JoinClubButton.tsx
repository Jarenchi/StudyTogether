"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

const FormSchema = z.object({
  clubId: z.string().min(2, {
    message: "UserId must be at least 2 characters.",
  }),
});

const JoinClubButton = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clubId: "",
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: { clubId: string }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/join`,
        { userId: nookies.get().user_id, clubId: values.clubId },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      toast({
        title: "club joined",
      });
      router.push("/myclubs");
      queryClient.invalidateQueries({ queryKey: ["clublist"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        alert("Account is expired, please Login again");
        router.push("/login");
      } else if (error?.response?.status === 404) {
        toast({
          title: "Club or user not found",
        });
      } else if (error?.response?.status === 400) {
        toast({
          title: "User is already in the club",
        });
      } else if (error?.response?.status >= 500 && error?.response?.status < 600) {
        alert("請稍後再試或和我們的技術團隊聯絡");
      } else {
        alert(error);
      }
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    mutation.mutateAsync(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={typeof window === "undefined" ? false : !nookies.get().user_id}>Join Club</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">Enter club ID</DialogTitle>
          <DialogDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
                <FormField
                  control={form.control}
                  name="clubId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="ml-2">
                  Join
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default JoinClubButton;
