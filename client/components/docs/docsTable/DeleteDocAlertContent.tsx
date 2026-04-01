"use client";

import { FC } from "react";
import axios from "axios";
import nookies from "nookies";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { handleApiError } from "@/utils/handleApiError";

interface DeleteButtonProps {
  docId: string;
}

const DeleteDocAlertContent: FC<DeleteButtonProps> = ({ docId }) => {
  const { club } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${club}/docs/${docId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      }),
    onSuccess: () => {
      toast({ title: "文件已刪除" });
      queryClient.invalidateQueries({ queryKey: ["docs", club] });
    },
    onError: (error: any) => handleApiError(error, router),
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>確定要刪除此文件？</AlertDialogTitle>
        <AlertDialogDescription>此操作無法復原，文件內容將永久刪除。</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction onClick={() => mutation.mutate()}>確認刪除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteDocAlertContent;
