import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { User } from "@/types/userProfileType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileBannerProps {
  data: User;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ data }) => {
  const date = new Date(data?.createdAt);
  const formattedDate = date.toLocaleDateString();
  return (
    <Card className="w-[64rem] p-6 mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="w-36 h-36">
            <AvatarImage src={data.picture} />
            <AvatarFallback>{data.name}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl ml-4">{data.name}</h1>
        </div>
        <div className="flex">
          <Clock />
          <span className="mr-4 ml-2">CreatedAt :</span>
          <p>{formattedDate}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProfileBanner;
