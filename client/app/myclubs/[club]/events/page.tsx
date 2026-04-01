import CreateEventButton from "@/components/events/CreateEventButton";
import EventList from "@/components/events/EventList";

const Page = () => {
  return (
    <div>
      <div className="mb-2">
        <CreateEventButton />
      </div>
      <EventList />
    </div>
  );
};

export default Page;
