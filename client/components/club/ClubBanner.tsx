import { Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Club } from "@/types/clubType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClubBannerProps {
  data: Club;
}

const ClubBanner: React.FC<ClubBannerProps> = ({ data }) => {
  const date = new Date(data?.createdAt);
  const formattedDate = date.toLocaleDateString();
  return (
    <Card className="w-[64rem] p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="w-36 h-36">
            <AvatarImage src={data.picture} />
            <AvatarFallback>{data.name}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl ml-4">{data.name}</h1>
        </div>
        <div>
          <div className="flex items-center mt-2">
            <User />
            <span className="mr-4 ml-2">Owner :</span>
            <Avatar>
              <AvatarImage src={data.owner.picture} />
              <AvatarFallback>{data.owner.name}</AvatarFallback>
            </Avatar>
            <span className="ml-2">{data.owner.name}</span>
          </div>
          <div className="flex">
            <Clock />
            <span className="mr-4 ml-2">CreatedAt :</span>
            <p>{formattedDate}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClubBanner;
