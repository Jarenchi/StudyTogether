import CreateEventButton from "@/components/events/CreateEventButton";
import EventList from "@/components/events/EventList";

const Page = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CreateEventButton />
      </div>
      <EventList />
    </div>
  );
};

export default Page;
