"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import nookies from "nookies";
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
  async function deleteMemberHandler() {
    try {
      const clubId = params.club;
      console.log(clubId, userId);
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      console.log(response.data);
      toast({
        title: "user deleted successfully",
      });
    } catch (error) {
      console.log(error);
    }
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
