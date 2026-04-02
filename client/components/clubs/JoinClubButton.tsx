"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { handleApiError } from "@/utils/handleApiError";
import { Button } from "../ui/button";

const FormSchema = z.object({
  clubId: z.string().min(2, { message: "Club ID must be at least 2 characters." }),
});

const JoinClubButton = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { clubId: "" },
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
      toast({ title: "已成功加入讀書會" });
      router.push("/myclubs");
      queryClient.invalidateQueries({ queryKey: ["clublist"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 404) toast({ title: "找不到該讀書會", variant: "destructive" });
      else if (status === 400) toast({ title: "您已在此讀書會中", variant: "destructive" });
      else handleApiError(error, router);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={typeof window === "undefined" ? false : !nookies.get().user_id}>加入讀書會</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">輸入讀書會 ID</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="flex gap-2">
            <FormField
              control={form.control}
              name="clubId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input type="text" placeholder="Club ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              加入
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinClubButton;
