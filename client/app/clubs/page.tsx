import CreateClubButton from "@/components/clubs/CreateClubButton";
import JoinClubButton from "@/components/clubs/JoinClubButton";
import ClubList from "@/components/clubs/ClubList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// TODO:搜尋社團功能
const Page = () => {
  return (
    <div className="mt-3 lg:mx-20 mx-2">
      <div className="mb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Input className="w-60" placeholder="search club..." />
          <Button type="submit">
            <Search size={20} />
          </Button>
        </div>
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
