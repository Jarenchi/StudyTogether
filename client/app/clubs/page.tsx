import { Suspense } from "react";
import CreateClubButton from "@/components/clubs/CreateClubButton";
import JoinClubButton from "@/components/clubs/JoinClubButton";
import ClubList from "@/components/clubs/ClubList";
import Searchbar from "@/components/clubs/Searchbar";
import ClubListSkeleton from "@/components/clubs/ClubListSkeleton";

const Page = () => {
  return (
    <div className="mt-3 lg:mx-20 mx-2">
      <div className="mb-3 flex justify-between items-center">
        <Suspense>
          <Searchbar />
        </Suspense>
        <div className="flex items-center gap-3">
          <CreateClubButton />
          <JoinClubButton />
        </div>
      </div>
      <Suspense fallback={<ClubListSkeleton />}>
        <ClubList />
      </Suspense>
    </div>
  );
};

export default Page;
