"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import nookies from "nookies";
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

interface DeleteMemberAlertContentProps {
  userId: string;
}

const DeleteMemberAlertContent: React.FC<DeleteMemberAlertContentProps> = ({ userId }) => {
  const params = useParams();
  const router = useRouter();
  const clubId = params.club;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      }),
    onSuccess: () => {
      toast({ title: "成員已移除" });
      queryClient.invalidateQueries({ queryKey: ["members", clubId] });
    },
    onError: (error: any) => handleApiError(error, router),
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>確定要移除此成員？</AlertDialogTitle>
        <AlertDialogDescription>此操作無法復原，該成員將被移出讀書會。</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction onClick={() => mutation.mutate()}>確認移除</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteMemberAlertContent;
