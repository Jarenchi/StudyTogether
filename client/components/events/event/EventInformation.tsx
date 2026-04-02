import { Clock, Tag, MapPin, Users, Video } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/eventType";

const TYPE_MAP: Record<string, string> = {
  online: "線上",
  offline: "實體",
  hybrid: "混合",
};

interface EventInformationProps {
  data: Event;
}

const EventInformation: React.FC<EventInformationProps> = ({ data }) => {
  const formattedDate = new Date(data.date).toLocaleDateString("zh-TW");
  const total = data.onlineParticipants.length + data.physicalParticipants.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
          活動資訊
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>
            {formattedDate} {data.startTime}–{data.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
          <Badge variant="secondary">{TYPE_MAP[data.type] ?? data.type}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span>共 {total} 人參加</span>
        </div>
        {(data.type === "hybrid" || data.type === "offline") && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>
              實體 {data.physicalParticipants.length} / {data.maxPhysicalParticipants} 人
            </span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}`}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-primary underline-offset-2 hover:underline"
            >
              {data.location}
            </Link>
          </div>
        )}
        {data.type !== "offline" && (
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-4 w-4 text-muted-foreground shrink-0" />
            <Link
              href={`${data._id}/meeting`}
              target="_blank"
              className="text-primary hover:underline underline-offset-2"
            >
              加入線上會議
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={data.creator.picture} />
            <AvatarFallback className="text-xs">{data.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>主辦人：{data.creator.name}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventInformation;
