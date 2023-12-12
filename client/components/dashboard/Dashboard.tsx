"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/solid";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  Callout,
  Card,
  BarChart,
  DonutChart,
  Flex,
  Grid,
  Metric,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Title,
  Tracker,
  Button,
} from "@tremor/react";
import getCurrentWeekDates from "@/utils/getCurrentWeekDate";
import Achievements from "./Achievements";

const topics = [
  {
    name: "Events",
    time: 2700,
  },
  {
    name: "Documents",
    time: 4567,
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

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<TrackerType[]>([]);
  const [targetTime, setTargetTime] = useState(360);
  useEffect(() => {
    const data = getAttendanceData();
    setAttendanceData(data);
  }, []);
  const totalDays = attendanceData.length;
  const attendedDays = attendanceData.filter((item) => item.color === "emerald").length;
  const thisWeekDates = getCurrentWeekDates();
  const value = 400;

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
              <Card className="max-w-md">
                {value >= targetTime ? (
                  <Callout
                    title="Congratulations! You have reached the target hours this week!"
                    icon={CheckCircleIcon}
                    color="teal"
                  />
                ) : (
                  <Callout
                    title="You did not reach the target hours this week. Please keep working hard!"
                    icon={ExclamationIcon}
                    color="rose"
                  />
                )}
                <Text className="mt-4">This Week Usage Time</Text>
                <Metric>{value} mins</Metric>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <button
                      type="button"
                      className="font-bold p-2 rounded-full border"
                      onClick={() => setTargetTime((prev) => prev - 30)}
                    >
                      <MinusIcon size={15} />
                      <span className="sr-only">Decrease</span>
                    </button>
                    <div className="flex-1 text-center">
                      <div className="text-5xl font-bold tracking-tighter">{targetTime}</div>
                      <div className="text-[0.70rem] uppercase text-muted-foreground">Mins/Week</div>
                    </div>
                    <button
                      type="button"
                      className="font-bold p-2 rounded-full border"
                      onClick={() => setTargetTime((prev) => prev + 30)}
                    >
                      <PlusIcon size={15} />
                      <span className="sr-only">Decrease</span>
                    </button>
                  </div>
                  <Button className="mt-4 font-bold">Set Goal</Button>
                </div>
              </Card>
              <Card className="max-w-md">
                <Title>Total Time</Title>
                <DonutChart
                  className="mt-6"
                  data={topics}
                  category="time"
                  index="name"
                  valueFormatter={valueFormatter}
                  colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                />
              </Card>
              <Card className="max-w-md">
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
            </Grid>
            <div className="mt-6">
              <Card>
                <Title>Week 2 ({thisWeekDates})</Title>
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
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Achievements />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
