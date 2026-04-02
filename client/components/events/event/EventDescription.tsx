import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface EventDescriptionProps {
  description: string;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ description }) => {
  if (!description) return null;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
          活動說明
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="font-sans text-sm leading-relaxed break-words whitespace-pre-wrap">{description}</pre>
      </CardContent>
    </Card>
  );
};

export default EventDescription;
