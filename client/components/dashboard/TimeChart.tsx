"use client";

import { CheckCircleIcon, ExclamationIcon } from "@heroicons/react/solid";
import {
  BadgeDelta,
  Callout,
  Card,
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

const cities = [
  {
    name: "Events",
    sales: 9800,
  },
  {
    name: "Documents",
    sales: 4567,
  },
];

const valueFormatter = (number: number) => `$ ${new Intl.NumberFormat("us").format(number).toString()}`;

export default function FinalDashboard() {
  return (
    <main>
      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detail</Tab>
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
            </Grid>
            <div className="mt-6">
              <Card className="max-w-lg">
                <Title>Total Time</Title>
                <DonutChart
                  className="mt-6"
                  data={cities}
                  category="sales"
                  index="name"
                  valueFormatter={valueFormatter}
                  colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                />
              </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <>
                <Card className="max-w-md">
                  <Text>This Week Usage Time</Text>
                  <Metric>18.4hrs</Metric>
                  <Callout
                    className="h-12 mt-4"
                    title="Didn't reach the time,better luck next time!"
                    icon={ExclamationIcon}
                    color="rose"
                  />
                </Card>

                <Card className="max-w-md">
                  <Text>This Week Usage Time</Text>
                  <Metric>7.2knts</Metric>
                  <Callout className="mt-4" title="Very Good.Please continues" icon={CheckCircleIcon} color="teal" />
                </Card>
              </>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Grid numItemsMd={2} numItemsLg={3} className="mt-6 gap-6">
                <Card className="max-w-sm mx-auto">
                  <Flex className="space-x-5" justifyContent="center">
                    <ProgressCircle value={50} size="md">
                      <span className="text-xs text-gray-700 font-medium">50%</span>
                    </ProgressCircle>
                    <div>
                      <Text className="font-medium text-gray-700">5/10 (50%)</Text>
                      <Text>Participated in 10 events.</Text>
                    </div>
                  </Flex>
                </Card>
                <Card className="max-w-sm mx-auto">
                  <Flex className="space-x-5" justifyContent="center">
                    <ProgressCircle value={0} size="md">
                      <span className="text-xs text-gray-700 font-medium">0%</span>
                    </ProgressCircle>
                    <div>
                      <Text className="font-medium text-gray-700">0/1 (0%)</Text>
                      <Text>Hosted a event.</Text>
                    </div>
                  </Flex>
                </Card>
              </Grid>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
