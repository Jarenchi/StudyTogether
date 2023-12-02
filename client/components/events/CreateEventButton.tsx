import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import CreateEventForm from "./CreateEventForm";

const CreateEventButton = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Add Event</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-y-scroll max-h-screen">
        <AlertDialogHeader>
          <AlertDialogDescription>
            <CreateEventForm />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateEventButton;
