"use client";

import nookies from "nookies";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateClubForm from "./CreateClubForm";

const CreateClubButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={typeof window === "undefined" ? false : !nookies.get().user_id}>Create Club</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Club</DialogTitle>
        </DialogHeader>
        <CreateClubForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClubButton;
