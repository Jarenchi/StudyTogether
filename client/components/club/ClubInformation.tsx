import { Card, CardContent } from "@/components/ui/card";
import { Club } from "@/types/clubType";
import { CalendarDays, FileText, Users } from "lucide-react";

interface ClubInformationProps {
  data: Club;
}

const stats = (data: Club) => [
  { label: "成員", value: data.members.length, icon: Users },
  { label: "活動", value: data.events.length, icon: CalendarDays },
  { label: "文件", value: data.docs.length, icon: FileText },
];

const ClubInformation: React.FC<ClubInformationProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      {stats(data).map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex flex-col items-center justify-center py-4 gap-1">
            <div className="p-2 rounded-lg bg-primary/10 mb-1">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display font-bold text-2xl">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClubInformation;
