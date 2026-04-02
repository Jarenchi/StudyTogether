"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Settings, LogOut, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Club } from "@/types/clubType";

const settingsSchema = z.object({
  name: z.string().min(2, { message: "名稱至少 2 個字元" }),
  description: z.string(),
});

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.club as string;
  const queryClient = useQueryClient();
  const userId = nookies.get().user_id;

  const { data, isLoading } = useQuery<Club>({
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}`);
      return res.data;
    },
    queryKey: ["club", clubId],
  });

  const isOwner = data?.owner?.id === userId;

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: { name: data?.name ?? "", description: data?.description ?? "" },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof settingsSchema>) =>
      axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}`,
        values,
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      toast({ title: "設定已更新" });
    },
    onError: () => toast({ title: "更新失敗，請稍後再試", variant: "destructive" }),
  });

  async function leaveClubHandler() {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      toast({ title: "已離開讀書會" });
      router.push("/myclubs");
    } catch {
      toast({ title: "操作失敗，請稍後再試", variant: "destructive" });
    }
  }

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* General settings — owners only */}
      {isOwner && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">一般設定</CardTitle>
            </div>
            <CardDescription>修改讀書會的基本資訊</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>讀書會名稱</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>簡介</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[80px] resize-y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-1.5" />
                  {updateMutation.isPending ? "儲存中..." : "儲存變更"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-destructive/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base text-destructive">危險區域</CardTitle>
          </div>
          <CardDescription>以下操作無法復原，請謹慎執行。</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">離開讀書會</p>
              <p className="text-xs text-muted-foreground mt-0.5">離開後需重新申請才能加入。</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">離開</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>確定要離開讀書會？</AlertDialogTitle>
                  <AlertDialogDescription>
                    離開後您將失去對此讀書會的存取權限，包括文件與活動紀錄。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={leaveClubHandler} className="bg-destructive hover:bg-destructive/90">
                    確認離開
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
