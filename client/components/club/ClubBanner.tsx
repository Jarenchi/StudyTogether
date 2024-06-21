import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Club } from "@/types/clubType";
import { Clock, User } from "lucide-react";

interface ClubBannerProps {
  data: Club;
}

const ClubBanner: React.FC<ClubBannerProps> = ({ data }) => {
  const date = new Date(data?.createdAt);
  const formattedDate = date.toLocaleDateString();
  return (
    <Card className="w-5/6 p-6">
      <div className="flex items-center">
        <Avatar className="lg:w-24 lg:h-24 w-6 h-6">
          <AvatarImage src={data.picture} />
          <AvatarFallback>{data.name}</AvatarFallback>
        </Avatar>
        <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm ml-4 break-words">{data.name}</h1>
      </div>
      <div>
        <div className="flex items-center mt-2 md:text-base text-sm">
          <User />
          <span className="mr-4 ml-2">Owner :</span>
          <Avatar>
            <AvatarImage src={data.owner.picture} />
            <AvatarFallback>{data.owner.name}</AvatarFallback>
          </Avatar>
          <span className="ml-2">{data.owner.name}</span>
        </div>
        <div className="flex items-center mt-2 md:text-base text-sm">
          <Clock />
          <span className="mr-4 ml-2">CreatedAt :</span>
          <p>{formattedDate}</p>
        </div>
      </div>
    </Card>
  );
};

export default ClubBanner;
