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
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default EventDescription;
