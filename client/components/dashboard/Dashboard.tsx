"use client";

import { useState } from "react";
import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/solid";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  Callout,
  Card,
  Color,
  BarChart,
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

// const data = {
//   _id: "6578396bb6c0a264c0aaa140",
//   userId: "6572728d76f107fea7a7e1a3",
//   targetTime: 0,
//   logs: [
//     {
//       date: "2023-12-01",
//       minutes: 233,
//       _id: "657833c078bbd47b8edd88eb",
//     },
//     {
//       date: "2023-12-02",
//       minutes: 200,
//       _id: "657833c078bbd47b8edd88ed",
//     },
//     {
//       date: "2023-12-04",
//       minutes: 301,
//       _id: "657833c078bbd47b8edd88f1",
//     },
//     {
//       date: "2023-12-05",
//       minutes: 61,
//       _id: "657833c078bbd47b8edd88f3",
//     },
//     {
//       date: "2023-12-06",
//       minutes: 313,
//       _id: "657833c078bbd47b8edd88f5",
//     },
//     {
//       date: "2023-12-07",
//       minutes: 2,
//       _id: "657833c078bbd47b8edd88f7",
//     },
//     {
//       date: "2023-12-08",
//       minutes: 46,
//       _id: "657833c078bbd47b8edd88f9",
//     },
//     {
//       date: "2023-12-09",
//       minutes: 278,
//       _id: "657833c078bbd47b8edd88fb",
//     },
//     {
//       date: "2023-12-10",
//       minutes: 41,
//       _id: "657833c078bbd47b8edd88fd",
//     },
//     {
//       date: "2023-12-11",
//       minutes: 221,
//       _id: "657833c078bbd47b8edd88ff",
//     },
//     {
//       date: "2023-12-12",
//       minutes: 364,
//       _id: "657833c078bbd47b8edd8901",
//     },
//   ],
//   __v: 0,
// };
interface Log {
  date: string;
  minutes: number;
  _id: string;
}

interface DashboardData {
  _id: string;
  userId: string;
  targetTime: number;
  logs: Log[];
  __v: number;
}

interface AttendanceItem {
  color: Color;
  tooltip: string;
}

const getAttendanceData = (dashboardData: DashboardData): AttendanceItem[] => {
  const today: Date = new Date();
  const thisMonth: number = today.getMonth() + 1;
  const thisYear: number = today.getFullYear();
  const attendanceData: AttendanceItem[] = [];

  const lastDayOfMonth = new Date(thisYear, thisMonth, 0).getDate();

  for (let day = 1; day <= lastDayOfMonth; day += 1) {
    const currentDate = new Date(thisYear, thisMonth - 1, day);
    const formattedDate = `${thisYear}/${(thisMonth < 10 ? "0" : "") + thisMonth}/${(day < 10 ? "0" : "") + day}`;

    if (currentDate > today) {
      attendanceData.push({
        color: "gray",
        tooltip: formattedDate,
      });
    } else {
      const hasLog = dashboardData.logs.find((log) => new Date(log.date).getDate() === day);
      if (hasLog) {
        attendanceData.push({
          color: "emerald",
          tooltip: formattedDate,
        });
      } else {
        attendanceData.push({
          color: "rose",
          tooltip: formattedDate,
        });
      }
    }
  }

  return attendanceData;
};
const valueFormatter = (number: number) => {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;
  return `${hours}h ${minutes}min`;
};
interface DashboardProps {
  data: DashboardData;
}
const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [targetTime, setTargetTime] = useState(data.targetTime);
  const attendanceData: AttendanceItem[] = getAttendanceData(data);
  function getTotalTime() {
    const totalMinutes = data.logs.reduce((total, log) => total + log.minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return `${totalHours} h ${remainingMinutes} min`;
  }

  function getThisWeekData() {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - ((currentDay + 6) % 7)); // Set to the first day (Monday) of the current week
    endOfWeek.setDate(today.getDate() + (6 - currentDay)); // Set time to end of day

    console.log(startOfWeek.toLocaleDateString(), endOfWeek.toLocaleDateString());

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const thisWeekLogs = daysOfWeek.map((day, index) => {
      const logForDay = data.logs.find((log) => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return (
          logDate.getTime() ===
          new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + index).getTime()
        );
      });

      return {
        name: day,
        date: new Date(
          startOfWeek.getFullYear(),
          startOfWeek.getMonth(),
          startOfWeek.getDate() + index,
        ).toLocaleDateString(),
        minutes: logForDay ? logForDay.minutes : 0,
      };
    });

    const thisWeekTotalTime = thisWeekLogs.reduce((total, log) => total + log.minutes, 0);

    return { thisWeekLogs, thisWeekTotalTime };
  }
  const { thisWeekLogs, thisWeekTotalTime } = getThisWeekData();
  // TODO:customTooltip

  const totalTime = getTotalTime();
  const totalDays = attendanceData.length;
  const attendedDays = attendanceData.filter((item) => item.color === "emerald").length;
  const thisWeekDates = getCurrentWeekDates();
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.toLocaleString("default", { month: "long" });
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
                {thisWeekTotalTime >= targetTime ? (
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
                <Metric>{thisWeekTotalTime} mins</Metric>
                <div className="flex flex-col">
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <button
                      type="button"
                      className="font-bold p-2 rounded-full border"
                      onClick={() => setTargetTime((prev) => Math.max(prev - 30, 0))}
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
                <p className="text-center text-6xl my-16">{totalTime}</p>
              </Card>
              <Card className="max-w-md">
                <Title>Attendance</Title>
                <Text>
                  {currentYear} {currentMonth}
                </Text>
                <Flex justifyContent="end" className="mt-4">
                  <Text>
                    {`${((attendedDays / totalDays) * 100).toFixed(2)}%`} ({attendedDays} / {totalDays})
                  </Text>
                </Flex>
                <Tracker data={attendanceData} className="mt-2" />
              </Card>
            </Grid>
            <div className="mt-6">
              <Card>
                <Title>Week 2 ({thisWeekDates})</Title>
                <BarChart
                  className="mt-6"
                  data={thisWeekLogs}
                  index="name"
                  categories={["minutes"]}
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
};
export default Dashboard;
