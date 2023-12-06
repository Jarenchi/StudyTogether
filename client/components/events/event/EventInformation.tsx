import { Clock, Tag, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from "@/types/eventType";

interface EventInformationProps {
  data: Event;
}

const EventInformation: React.FC<EventInformationProps> = ({ data }) => {
  const date = new Date(data?.date);
  const formattedDate = date.toLocaleDateString();
  const participantsNumber = data.onlineParticipants.length + data.physicalParticipants.length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <Clock />
          <span className="ml-2">{formattedDate}</span>
          <span className="ml-2">
            {data.startTime}-{data.endTime}
          </span>
          <Link href="/" className="text-primary ml-2">
            Add To Calender
          </Link>
        </div>
        <div className="flex mt-2">
          <Tag />
          <span className="ml-2">{data.type}</span>
        </div>
        <div className="flex mt-2">
          <Users />
          <span className="ml-2">Total Participants :</span>
          <span className="ml-2">{participantsNumber}</span>
        </div>
        {data.type !== "online" && (
          <div className="flex mt-2">
            <Users />
            <span className="ml-2">Physical Participants :</span>
            <span className="ml-2">
              {data.physicalParticipants.length} / {data.maxPhysicalParticipants}
            </span>
          </div>
        )}
        {data.type === "online" && (
          <div className="flex mt-2">
            <Users />
            <span className="ml-2">Online Participants :</span>
            <span className="ml-2">{data.onlineParticipants.length} </span>
          </div>
        )}
        {data.location && (
          <div className="flex mt-2">
            <MapPin />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${data.location}`}
              rel="noopener noreferrer"
              target="_blank"
              className="ml-2 hover:text-primary"
            >
              {data.location}
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center mt-2">
          <span className="mr-4">Creator</span>
          <Avatar>
            <AvatarImage src={data.creator.picture} />
            <AvatarFallback>{data.creator.name}</AvatarFallback>
          </Avatar>
          <span className="ml-2">{data.creator.name}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventInformation;
