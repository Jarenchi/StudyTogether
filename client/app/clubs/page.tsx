import CreateClubButton from "@/components/clubs/CreateClubButton";
import ClubList from "@/components/clubs/ClubList";

const Page = () => {
  return (
    <div>
      <div className="mb-4">
        <CreateClubButton />
      </div>
      <ClubList />
    </div>
  );
};

export default Page;
