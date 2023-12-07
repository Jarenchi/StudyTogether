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
      toast({
        title: "user deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["members", clubId] });
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
  async function deleteMemberHandler() {
    await mutation.mutateAsync();
    // try {
    //   console.log(clubId, userId);
    //   const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members/${userId}`, {
    //     headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    //   });
    //   console.log(response.data);
    //   toast({
    //     title: "user deleted successfully",
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  }
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently remove member.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={deleteMemberHandler}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteMemberAlertContent;
