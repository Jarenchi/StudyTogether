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
      toast({ title: "doc deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["docs", club] });
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
  async function deleteDocHandler() {
    await mutation.mutateAsync();
  }

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your document and remove your data from our
          servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={deleteDocHandler}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteDocAlertContent;
