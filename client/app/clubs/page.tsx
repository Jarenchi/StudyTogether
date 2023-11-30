import CreateClubButton from "@/components/clubs/CreateClubButton";
import ClubList from "@/components/clubs/ClubList";

const Page = () => {
  return (
    <div className="mt-3 ml-4">
      <div className="mb-3">
        <CreateClubButton />
      </div>
      <ClubList />
    </div>
  );
};

export default Page;
