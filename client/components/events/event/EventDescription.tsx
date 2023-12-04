import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface EventDescriptionProps {
  description: string;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle> Description</CardTitle>
      </CardHeader>
      <CardContent className="max-w-sm lg:max-w-xl">
        <pre className="font-sans break-words whitespace-pre-wrap">{description}</pre>
      </CardContent>
    </Card>
  );
};

export default EventDescription;
