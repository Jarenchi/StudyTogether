import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Club } from "@/types/clubType";
import { CalendarDays, File, Users } from "lucide-react";

interface ClubInformationProps {
  data: Club;
}

const ClubInformation: React.FC<ClubInformationProps> = ({ data }) => {
  return (
    <div className="flex flex-wrap gap-2 w-5/6">
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Members</CardTitle>
            <Users size={48} color="#2563eb" />
          </div>
        </CardHeader>
        <CardContent className="text-4xl">{data?.members.length}</CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Events</CardTitle>
            <CalendarDays size={48} color="#2563eb" />
          </div>
        </CardHeader>
        <CardContent className="text-4xl">{data?.events.length}</CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Documents</CardTitle>
            <File size={48} color="#2563eb" />
          </div>
        </CardHeader>
        <CardContent className="text-4xl">{data?.docs.length}</CardContent>
      </Card>
    </div>
  );
};

export default ClubInformation;
