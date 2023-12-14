import CreateClubButton from "@/components/clubs/CreateClubButton";
import JoinClubButton from "@/components/clubs/JoinClubButton";
import ClubList from "@/components/clubs/ClubList";
import Searchbar from "@/components/clubs/Searchbar";

const Page = () => {
  return (
    <div className="mt-3 lg:mx-20 mx-2">
      <div className="mb-3 flex justify-between items-center">
        <Searchbar />
        <div className="flex items-center gap-3">
          <CreateClubButton />
          <JoinClubButton />
        </div>
      </div>
      <ClubList />
    </div>
  );
};

export default Page;
