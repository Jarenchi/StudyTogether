"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateClubForm from "./CreateClubForm";

const CreateClubButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="dark:text-white">Create Club</Button>
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
