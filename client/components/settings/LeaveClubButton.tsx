"use client";

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
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";

import { toast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

const LeaveClubButton = () => {
  const params = useParams();
  const router = useRouter();
  async function leaveClubHandler() {
    try {
      const clubId = params.club;
      const userId = nookies.get().user_id;
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${clubId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      console.log(response.data);
      toast({
        title: "You have left the club",
      });
      router.push("/myclubs");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Leave Club</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={leaveClubHandler}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveClubButton;
