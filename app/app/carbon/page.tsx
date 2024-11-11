"use client";

import { AppTable } from "@/components/app-history-table";
import { Button } from "@/components/ui/button";
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
import { SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Survey, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculateTimer } from "@/components/calculateTimer";

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

export default function CarbonPage() {
  const router = useRouter();

  const [refreshTime, setRefreshTime] = useState<Date | null>(null);
  const [cooldownLoading, setCooldownLoading] = useState(true);
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

  useEffect(() => {
    const fetchCooldown = async () => {
      try {
        await fetch("/api/survey/cooldown")
          .then((res) => res.json())
          .then((data) => {
            setCooldownLoading(false);
            if (data.refreshTime) {
              setRefreshTime(new Date(data.refreshTime));
            }
            if (data.available) {
              setRefreshTime(null);
            }
          });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCooldown();
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
    <div className="w-full h-full p-8">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 ">
        <Card className="order-2 md:order-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Postęp Śladu Węglowego</CardTitle>
            <CardDescription>
              {formattedLowestDate} - {formattedHighestDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="max-h-[150px] w-full"
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
        <div className="grid gap-4 order-1 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Oblicz ślad węglowy</CardTitle>
              <CardDescription>
                Powtórz ankietę aby policzyć ślad węglowy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!cooldownLoading ? (
                <CalculateTimer targetDate={refreshTime ?? new Date()} />
              ) : (
                <Skeleton className="w-[80px] h-[35px]" />
              )}
            </CardContent>
          </Card>
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Ślad Węglowy</CardTitle>
              <CardDescription>Twój oszacowany ślad węglowy</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.carbonFootprint != null ? (
                <p className="text-xl font-bold">
                  {userData?.carbonFootprint}t CO₂
                </p>
              ) : (
                <Skeleton className="w-[80px] h-[30px]" />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-[300px] md:h-[400px] lg:h-full overflow-y-auto">
        <AppTable surveys={userData?.surveys ?? []} />
      </div>
    </div>
  );
}
