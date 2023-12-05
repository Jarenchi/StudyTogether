"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import CreateEventForm from "./CreateEventForm";

const CreateEventButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Add Event</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-auto max-h-screen">
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => {
            setOpen(false);
          }}
        >
          <X />
        </Button>
        <AlertDialogHeader>
          <CreateEventForm setOpen={setOpen} />
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateEventButton;
