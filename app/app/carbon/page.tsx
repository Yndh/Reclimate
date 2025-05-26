"use client";

import { AppTable } from "@/components/app-history-table";
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
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Survey, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculateTimer } from "@/components/calculateTimer";
import { toast } from "@/hooks/use-toast";

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
  const [userData, setUserData] = useState<User | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
        return;
      }

      if (data.user) {
        setUserData(data.user);

        const footprintData = data.user.surveys
          .filter((survey: Survey) => survey.carbonFootprint != null)
          .map((survey: Survey) => ({
            date: new Date(survey.createdAt),
            footprint: survey.carbonFootprint || 0,
          }));
        setChartData(footprintData);
      }
    } catch (err) {
      console.error(`Error getting user carbon data: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił problem w trakcie pobierania danych użytkownika",
      });
    } finally {
      setUserLoading(false);
    }
  }, []);

  const fetchCooldown = useCallback(async () => {
    try {
      const res = await fetch("/api/survey/cooldown");
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
        return;
      }
      setCooldownLoading(false);

      if (data.refreshTime) {
        setRefreshTime(new Date(data.refreshTime));
      }
      if (data.available) {
        setRefreshTime(null);
      }
    } catch (err) {
      console.error(`Error getting cooldown: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił problem w trakcie pobierania czasu odnowienia",
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchCooldown();
  }, [fetchUser, fetchCooldown]);

  const [lowestDate, highestDate] = useMemo(() => {
    if (chartData.length === 0) {
      const now = new Date();
      return [now, now];
    }
    const lowest = chartData.reduce(
      (min, item) => (item.date < min ? item.date : min),
      chartData[0].date
    );
    const highest = chartData.reduce(
      (max, item) => (item.date > max ? item.date : max),
      chartData[0].date
    );
    return [lowest, highest];
  }, [chartData]);

  const formatDate = useCallback((date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("pl-PL", { month: "long" });
    return `${day} ${month}`;
  }, []);

  const formattedLowestDate = formatDate(lowestDate);
  const formattedHighestDate = formatDate(highestDate);

  const memoizedChartData = useMemo(() => {
    return chartData.map((item) => ({
      ...item,
      date: item.date.toLocaleDateString("pl-PL"),
    }));
  }, [chartData]);

  return (
    <div className="overflow-y-scroll w-full h-full p-8">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 ">
        <Card className="order-2 md:order-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Postęp Śladu Węglowego</CardTitle>
            <CardDescription>
              {formattedLowestDate} - {formattedHighestDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userLoading || chartData.length === 0 ? (
              <Skeleton className="max-h-[150px] w-full h-[150px]" />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="max-h-[150px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={memoizedChartData}
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
            )}
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
              {cooldownLoading ? (
                <Skeleton className="w-[80px] h-[35px]" />
              ) : (
                <CalculateTimer targetDate={refreshTime ?? new Date()} />
              )}
            </CardContent>
          </Card>

          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Ślad Węglowy</CardTitle>
              <CardDescription>Twój oszacowany ślad węglowy</CardDescription>
            </CardHeader>
            <CardContent>
              {userLoading ? (
                <Skeleton className="w-[80px] h-[30px]" />
              ) : (
                <p className="text-xl font-bold">
                  {userData?.carbonFootprint != null
                    ? `${userData.carbonFootprint}t CO₂`
                    : "N/A"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-full overflow-y-auto mt-4">
        {userLoading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <AppTable surveys={userData?.surveys ?? []} />
        )}
      </div>
    </div>
  );
}
