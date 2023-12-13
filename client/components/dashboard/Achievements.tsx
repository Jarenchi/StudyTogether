import { Card, Flex, Grid, Text, ProgressCircle } from "@tremor/react";

const achievements = [
  { value: 5, total: 10, label: "Participated in 10 events." },
  { value: 0, total: 1, label: "Hosted an event." },
  { value: 0, total: 1, label: "Hosted a live session (3 hours)." },
  { value: 20, total: 100, label: "Logged in consecutively for 100 days." },
];
const achievementItems = achievements.map((item, index) => (
  // eslint-disable-next-line react/no-array-index-key
  <Card key={index} className="max-w-sm mx-auto">
    <Flex className="space-x-5" justifyContent="center">
      <ProgressCircle value={(item.value / item.total) * 100} size="md">
        <span className="text-xl font-medium">{`${(item.value / item.total) * 100}%`}</span>
      </ProgressCircle>
      <div className="w-3/4">
        <Text className="font-medium">{`${item.value}/${item.total} (${(item.value / item.total) * 100}%)`}</Text>
        <Text className="whitespace-pre-line">{item.label}</Text>
      </div>
    </Flex>
  </Card>
));

const Achievements = () => {
  return (
    <Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
      {achievementItems}
    </Grid>
  );
};

export default Achievements;
