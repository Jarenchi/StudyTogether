import CreateEventButton from "@/components/events/CreateEventButton";
import EventList from "@/components/events/EventList";

const Page = () => {
  return (
    <div className="mt-2 lg:mx-20 mx-4">
      <div className="mb-2">
        <CreateEventButton />
      </div>
      <EventList />
    </div>
  );
};

export default Page;
