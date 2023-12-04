import CreateEventButton from "@/components/events/CreateEventButton";
import EventList from "@/components/events/EventList";

const Page = () => {
  return (
    <div className="mx-auto">
      <CreateEventButton />
      <EventList />
    </div>
  );
};

export default Page;
