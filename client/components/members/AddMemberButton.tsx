"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import nookies from "nookies";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { handleApiError } from "@/utils/handleApiError";
import { Button } from "../ui/button";

const FormSchema = z.object({
  userId: z.string().min(2, { message: "UserId must be at least 2 characters." }),
});

const AddMemberButton = () => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.club;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { userId: "" },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: { userId: string }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/join`,
        { userId: values.userId, clubId },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      toast({ title: "成員已加入" });
      queryClient.invalidateQueries({ queryKey: ["members", clubId] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 404) toast({ title: "找不到社團或使用者", variant: "destructive" });
      else if (status === 400) toast({ title: "使用者已在社團中", variant: "destructive" });
      else handleApiError(error, router);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>新增成員</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">輸入使用者 ID</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="flex gap-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input type="text" placeholder="User ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              新增
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberButton;
