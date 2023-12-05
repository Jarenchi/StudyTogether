import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ClubDescriptionProps {
  description: string;
}

const ClubDescription: React.FC<ClubDescriptionProps> = ({ description }) => {
  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle> Description</CardTitle>
      </CardHeader>
      <CardContent className="max-w-5xl">
        <pre className="font-sans break-words whitespace-pre-wrap">{description}</pre>
      </CardContent>
    </Card>
  );
};

export default ClubDescription;
