"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Survey, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  footprint: {
    label: "Ślad węglowy: ",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartData {
  date: Date;
  footprint: number;
}

export default function AppPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {},
  });
  const [userData, setUserData] = useState<User>();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetch("/api/user")
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              alert(data.error);
              return;
            }

            if (data.user) {
              setUserData(data.user);

              const footprintData = data.user.surveys
                .filter((survey: Survey) => survey.carbonFootprint)
                .map((survey: Survey) => ({
                  date: new Date(survey.createdAt),
                  footprint: survey.carbonFootprint || 0,
                }));
              setChartData(footprintData);
            }
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const getDates = (): [Date, Date] => {
    const lowestDate = chartData.reduce(
      (min, item) => (item.date < min ? item.date : min),
      chartData[0]?.date || new Date()
    );
    const highestDate = chartData.reduce(
      (max, item) => (item.date > max ? item.date : max),
      chartData[0]?.date || new Date()
    );

    return [lowestDate, highestDate];
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("pl-PL", { month: "long" });
    return `${day} ${month}`;
  };

  const [lowestDate, highestDate] = getDates();
  const formattedLowestDate = formatDate(lowestDate);
  const formattedHighestDate = formatDate(highestDate);

  return (
    <div className="flex flex-col items-center w-full h-full p-8 pb-12 gap-6 box-border">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Dashboard</p>
      </div>
      <div className="flex flex-1 flex-col w-full gap-4 lg:overflow-y-hidden overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Ślad węglowy</CardTitle>
              <CardDescription>Twój oszacowany ślad węglowy</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.carbonFootprint != null ? (
                <p className="text-2xl font-bold">
                  {userData?.carbonFootprint}t CO₂
                </p>
              ) : (
                <Skeleton className="w-[80px] h-[30px]" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Punkty</CardTitle>
              <CardDescription>Ilość punktów</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.points != null ? (
                <p className="text-2xl font-bold">{userData?.points}</p>
              ) : (
                <Skeleton className="w-[80px] h-[30px]" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Porady</CardTitle>
              <CardDescription>
                Porady aby zmniejszyć swój ślad węglowy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">test</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card className="md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Postęp Śladu Węglowego</CardTitle>
              <CardDescription>
                {formattedLowestDate} - {formattedHighestDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="max-h-[400px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={chartData.map((item) => ({
                    ...item,
                    date: item.date.toLocaleDateString("pl-PL"),
                  }))}
                  margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    dataKey="footprint"
                    type="natural"
                    stroke="var(--color-footprint)"
                    strokeWidth={2}
                    dot={{
                      fill: "var(--color-footprint)",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  >
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Line>
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Zadania tygodniowe</CardTitle>
              <CardDescription>Twoje zadania na ten tydzień</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.challenges && userData.challenges.length > 0 ? (
                userData?.challenges.map((challenge, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="h-fit mb-4">
                        <div className="flex align-top justify-start gap-4 h-fit w-full m-0">
                          <p className="text-sm text-secondary font-bold bg-green-600 rounded-full aspect-square w-12 h-12 flex items-center justify-center">
                            + {challenge.point}
                          </p>
                          <div className="text-left">
                            <p className="text-lg font-semibold text-wrap">
                              {challenge.title}
                            </p>
                            <p className="text-sm text-muted-foreground text-wrap">
                              {challenge.description}
                            </p>
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            {challenge.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {challenge.description}
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Button>Oznacz jako ukończone</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Narazie nie masz żadnych wyzwań
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
