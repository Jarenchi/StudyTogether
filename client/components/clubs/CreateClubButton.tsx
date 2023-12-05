"use client";

import { useState } from "react";
import nookies from "nookies";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateClubForm from "./CreateClubForm";

const CreateClubButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={typeof window === "undefined" ? false : !nookies.get().user_id}>Create Club</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Club</DialogTitle>
        </DialogHeader>
        <CreateClubForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClubButton;
