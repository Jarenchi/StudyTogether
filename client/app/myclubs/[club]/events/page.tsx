import CreateEventButton from "@/components/events/CreateEventButton";
import EventList from "@/components/events/EventList";

const Page = () => {
  return (
    <div className="mt-2 ml-2">
      <div className="mb-2">
        <CreateEventButton />
      </div>
      <EventList />
    </div>
  );
};

export default Page;
