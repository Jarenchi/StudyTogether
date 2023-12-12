const totalTime = ({ value, topics, valueFormatter }) => {
  return (
    <Card className="max-w-md">
      <Title>Total Time</Title>
      <DonutChart
        className="mt-6"
        data={topics}
        category="sales"
        index="name"
        valueFormatter={valueFormatter}
        colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
      />
    </Card>
  );
};

export default totalTime;
