"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/solid";
import {
  BadgeDelta,
  Callout,
  Card,
  BarChart,
  DeltaType,
  DonutChart,
  Flex,
  Grid,
  Metric,
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
  Tracker,
  ProgressCircle,
} from "@tremor/react";

type Kpi = {
  title: string;
  metric: string;
  progress: number;
  target: string;
  delta: string;
  deltaType: DeltaType;
};

const kpiData: Kpi = {
  title: "Level",
  metric: "2000",
  progress: 20,
  target: "10,000",
  delta: "13.2%",
  deltaType: "moderateIncrease",
};

const topics = [
  {
    name: "Events",
    sales: 9800,
  },
  {
    name: "Documents",
    sales: 4567,
  },
];
interface TrackerType {
  color: "emerald" | "rose" | "gray";
  tooltip: string;
}

const getAttendanceData = (): TrackerType[] => {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const attendanceData: TrackerType[] = Array.from({ length: daysInMonth }, (_, day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
    const isFutureDate = date > currentDate;

    return {
      color: isFutureDate ? "gray" : "emerald",
      tooltip: date.toLocaleDateString(),
    };
  });

  return attendanceData;
};

const valueFormatter = (number: number) => {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;
  return `${hours}h ${minutes}min`;
};

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
        <span className="text-xs text-gray-700 font-medium">{`${(item.value / item.total) * 100}%`}</span>
      </ProgressCircle>
      <div className="w-3/4">
        <Text className="font-medium text-gray-700">
          {`${item.value}/${item.total} (${(item.value / item.total) * 100}%)`}
        </Text>
        <Text className="whitespace-pre-line">{item.label}</Text>
      </div>
    </Flex>
  </Card>
));

const chartdata = [
  {
    name: "Monday",
    Minutes: 170,
  },
  {
    name: "Tuesday",
    Minutes: 0,
  },
  {
    name: "Wednesday",
    Minutes: 320,
  },
  {
    name: "Thursday",
    Minutes: 256,
  },
  {
    name: "Friday",
    Minutes: 320,
  },
  {
    name: "Saturday",
    Minutes: 128,
  },
  {
    name: "Sunday",
    Minutes: 320,
  },
];

const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  console.log(currentDay);
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);
  console.log(endOfWeek);
  startOfWeek.setDate(today.getDate() - ((currentDay + 6) % 7)); // Set to the first day (Monday) of the current week
  endOfWeek.setDate(today.getDate() + (6 - currentDay)); // Set to the last day (Sunday) of the current week

  const startDateString = `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}`;
  const endDateString = `${endOfWeek.getMonth() + 1}/${endOfWeek.getDate()}`;

  return `${startDateString}-${endDateString}`;
};

export default function FinalDashboard() {
  const [attendanceData, setAttendanceData] = useState<TrackerType[]>([]);

  useEffect(() => {
    const data = getAttendanceData();
    setAttendanceData(data);
  }, []);
  const totalDays = attendanceData.length;
  const attendedDays = attendanceData.filter((item) => item.color === "emerald").length;
  const thisWeekDates = getCurrentWeekDates();
  return (
    <main>
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Achievements</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
              <Card key={kpiData.title}>
                <Flex alignItems="start">
                  <div className="truncate">
                    <Text>{kpiData.title}</Text>
                    <Metric className="truncate">{kpiData.metric}</Metric>
                  </div>
                  <BadgeDelta deltaType={kpiData.deltaType}>{kpiData.delta}</BadgeDelta>
                </Flex>
                <Flex className="mt-4 space-x-2">
                  <Text className="truncate">{`${kpiData.progress}% (${kpiData.metric})`}</Text>
                  <Text className="truncate">{kpiData.target}</Text>
                </Flex>
                <ProgressBar value={kpiData.progress} className="mt-2" />
              </Card>
              <Card className="max-w-md">
                <Text>Last Week Usage Time</Text>
                <Metric>18.4hrs</Metric>
                <Callout
                  className="mt-4"
                  title="You did not reach the target hours last week. Please keep working hard!"
                  icon={ExclamationIcon}
                  color="rose"
                />
              </Card>
              <Card className="max-w-md">
                <Text>Last Week Usage Time</Text>
                <Metric>7.2hrs</Metric>
                <Callout
                  className="mt-4"
                  title="Congratulations! You have reached the target hours last week!"
                  icon={CheckCircleIcon}
                  color="teal"
                />
              </Card>
            </Grid>
            <div className="mt-6">
              <Grid numItemsMd={2} numItemsLg={2} className="mt-6 gap-6">
                <Card className="max-w-lg">
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
                <Card className="max-w-lg">
                  <Title>Attendance</Title>
                  <Text>Dec 2023</Text>
                  <Text>
                    {attendedDays} / {totalDays}
                  </Text>
                  <Flex justifyContent="end" className="mt-4">
                    <Text>{`${((attendedDays / totalDays) * 100).toFixed(2)}%`}</Text>
                  </Flex>
                  <Tracker data={attendanceData} className="mt-2" />
                </Card>
                <Card>
                  <Title>Number of species threatened with extinction ({thisWeekDates})</Title>
                  <BarChart
                    className="mt-6"
                    data={chartdata}
                    index="name"
                    categories={["Minutes"]}
                    colors={["blue"]}
                    valueFormatter={valueFormatter}
                    yAxisWidth={60}
                  />
                </Card>
              </Grid>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
                {achievementItems}
              </Grid>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
