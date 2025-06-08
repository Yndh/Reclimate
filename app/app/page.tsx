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
import { useEffect, useState, useMemo, useCallback } from "react";
import { Challenge, Survey, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompleteTimer } from "@/components/completeTimer";
import { Timer } from "@/components/timer";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import CountUp from "@/components/ui/count";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const tips = searchParams.get("tips");
  const showTips = tips === "true";
  const [userData, setUserData] = useState<User | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [completeDate, setCompleteDate] = useState<Date | null>(null);
  const [tipsClick, setTipsClick] = useState(0);

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

        if (!data.user.carbonFootprint) {
          router.replace("/calculate");
        }

        const footprintData = data.user.surveys
          .filter((survey: Survey) => survey.carbonFootprint)
          .map((survey: Survey) => ({
            date: new Date(survey.createdAt),
            footprint: survey.carbonFootprint || 0,
          }))
          .slice(-10);
        setChartData(footprintData);

        if (data.user.challenges && data.user.challenges.length > 0) {
          const target = new Date(data.user.challenges[0].endDate);
          setCompleteDate(new Date(target.getTime() - 1 * 24 * 60 * 60 * 1000));
        }
      }
    } catch (err) {
      console.error(`User data fetch error: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie pobierania danych użytkownika",
      });
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateChallenge = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/challenges/${id}`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
        return;
      }

      if (data.challenge) {
        setUserData((user) => {
          if (user && user.id) {
            return {
              ...user,
              points: user.points + data.challenge.points,
              challenges: user.challenges?.map((chall) =>
                chall.id === id
                  ? { ...chall, ...(data.challenge as Challenge) }
                  : chall
              ),
            };
          }
          return user;
        });
      }
    } catch (err) {
      console.error(`Update error: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w tarkcie aktualizowania wyzwania",
      });
    }
  }, []);

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

  const getWeekStartAndEnd = useCallback((): { start: Date; end: Date } => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const start = new Date(now);
    start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, []);

  const memoizedChartData = useMemo(() => {
    return chartData.map((item) => ({
      ...item,
      date: item.date.toLocaleDateString("pl-PL"),
    }));
  }, [chartData]);

  const latestSurveyTips = useMemo(() => {
    if (userData?.surveys && userData.surveys.length > 0) {
      return userData.surveys[userData.surveys.length - 1]?.tips;
    }
    return null;
  }, [userData?.surveys]);

  return (
    <div className="flex flex-col items-center w-full h-full p-8 pb-12 gap-6 box-border">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Dashboard</p>
      </div>
      <div className="flex flex-1 flex-col w-full gap-4 overflow-y-auto">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Ślad węglowy</CardTitle>
              <CardDescription>Twój oszacowany ślad węglowy</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.carbonFootprint != null ? (
                <p className="text-2xl font-bold">
                  <CountUp
                    from={0}
                    to={userData.carbonFootprint}
                    separator=","
                    direction="up"
                    duration={0.01}
                    className="text-2xl font-bold"
                  />
                  t CO₂
                </p>
              ) : (
                <Skeleton className="w-[80px] h-[30px]" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Punkty</CardTitle>
              <CardDescription>Twoje aktualne punkty.</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.points != null ? (
                <CountUp
                  from={0}
                  to={userData.points}
                  separator=","
                  direction="up"
                  duration={0.1}
                  className="text-2xl font-bold"
                />
              ) : (
                <Skeleton className="w-[80px] h-[30px]" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Porady</CardTitle>
              <CardDescription>
                Sprawdź praktyczne wskazówki, na podstawie ostatniej ankiety.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.surveys != null ? (
                <Dialog defaultOpen={showTips}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        if (tipsClick < 2) {
                          setTipsClick(tipsClick + 1);
                        }
                      }}
                    >
                      Zobacz porady
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Twoje porady</DialogTitle>
                      <DialogDescription>
                        Twoje spersonalizowane porady, jak zmniejszyć ślad
                        węglowy — oparte na Twoich ostatnich odpowiedziach.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full box-border">
                      <ol className="list-decimal w-full pl-4 space-y-2">
                        {latestSurveyTips &&
                          latestSurveyTips.map((tip, index) => (
                            <li
                              className={`text-base ${
                                tipsClick < 2
                                  ? "gradient-text duration-1000"
                                  : ""
                              }`}
                              key={`tip${index}`}
                            >
                              {tip.description}
                            </li>
                          ))}
                      </ol>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Skeleton className="w-[100px] h-[30px]" />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card className="md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Postęp Śladu Węglowego</CardTitle>
              <CardDescription className="capitalize">
                {formattedLowestDate} - {formattedHighestDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ChartContainer
                  config={chartConfig}
                  className="max-h-[400px] w-full"
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
              ) : (
                <Skeleton className="h-[400px] w-full" />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Zadania tygodniowe</CardTitle>
                <CardDescription>Twoje zadania na ten tydzień</CardDescription>
              </div>

              {userData?.challenges && userData.challenges.length > 0 ? (
                <span className="text-sm text-muted-foreground">
                  <Timer targetDate={getWeekStartAndEnd().end} />
                </span>
              ) : (
                <Skeleton className="h-[14px] w-[30px]" />
              )}
            </CardHeader>
            <CardContent>
              {userData?.challenges && userData.challenges.length > 0 ? (
                userData.challenges.map((challenge, index) => (
                  <Popover key={challenge.id}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="h-fit mb-4">
                        <div className="flex align-top justify-start gap-4 h-fit w-full m-0">
                          <p
                            className={`text-sm text-white font-bol rounded-full aspect-square w-12 h-12 flex items-center justify-center ${
                              challenge.isCompleted
                                ? "bg-green-950"
                                : "bg-green-700"
                            }`}
                          >
                            {challenge.isCompleted ? (
                              <Check />
                            ) : (
                              `+ ${challenge.points}`
                            )}
                          </p>
                          <div className="text-left">
                            <p
                              className={`text-lg font-semibold text-wrap ${
                                challenge.isCompleted && "line-through"
                              }`}
                            >
                              {challenge.title}
                            </p>
                            <p
                              className={`text-sm text-muted-foreground text-wrap ${
                                challenge.isCompleted && "line-through"
                              }`}
                            >
                              {challenge.description.length > 150
                                ? challenge.description.slice(
                                    0,
                                    challenge.description
                                      .slice(0, 150)
                                      .lastIndexOf(" ")
                                  ) + "..."
                                : challenge.description}
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
                          {challenge.isCompleted ? (
                            <Button variant={"outline"}>
                              <CheckCircle2 /> Ukończone
                            </Button>
                          ) : (
                            <CompleteTimer
                              targetDate={completeDate ?? new Date()}
                              id={challenge.id}
                              onClick={updateChallenge}
                            />
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))
              ) : (
                <>
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="flex align-top justify-start gap-4 h-fit w-full m-0 mb-4"
                    >
                      <Skeleton className="!w-12 !h-12 aspect-square rounded-full" />
                      <div className="w-full">
                        <Skeleton className="h-[18px] w-11/12 mb-2" />
                        <Skeleton className="h-[14px] w-full mb-1" />
                        <Skeleton className="h-[14px] w-full mb-1" />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
