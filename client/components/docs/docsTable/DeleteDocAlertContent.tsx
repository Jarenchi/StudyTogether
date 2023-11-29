"use client";

import { FC } from "react";
import axios from "axios";
import nookies from "nookies";
import { useParams } from "next/navigation";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  docId: string;
}
const DeleteDocAlertContent: FC<DeleteButtonProps> = ({ docId }) => {
  const { club } = useParams();
  async function deleteDocHandler() {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/clubs/${club}/docs/${docId}`, {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    // TODO:刪除後重新rerender table
    console.log(response.data);
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
