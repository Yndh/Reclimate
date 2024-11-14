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
  const [completeDate, setCompleteDate] = useState<Date>();
  const [tipsClick, setTipsClick] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await fetch("/api/user")
          .then((res) => res.json())
          .then((data) => {
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
                .filter((survey: Survey) => survey.carbonFootprint)
                .map((survey: Survey) => ({
                  date: new Date(survey.createdAt),
                  footprint: survey.carbonFootprint || 0,
                }));
              setChartData(footprintData);

              const target = new Date(data.user.challenges[0].endDate);
              setCompleteDate(
                new Date(target.getTime() - 1 * 24 * 60 * 60 * 1000)
              );
            }
          });
      } catch (err) {
        console.error(`User data fetch error: ${err}`);
        toast({
          variant: "destructive",
          description: "Wystąpił błąd w trakcie pobierania danych użytkownika",
        });
      }
    };

    fetchUser();
  }, []);

  const updateChallenge = async (id: string) => {
    try {
      await fetch(`/api/challenges/${id}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
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
        });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w tarkcie aktualizowania wyzwania",
      });
    }
  };

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

  const getWeekStartAndEnd = (): { start: Date; end: Date } => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const start = new Date(now);
    start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  };

  const [lowestDate, highestDate] = getDates();
  const formattedLowestDate = formatDate(lowestDate);
  const formattedHighestDate = formatDate(highestDate);

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
              {userData?.surveys != null ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        if (tipsClick < 2) {
                          setTipsClick(tipsClick + 1);
                        }
                      }}
                    >
                      Pokaż porady
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Porady</DialogTitle>
                      <DialogDescription>
                        Porady do obnizenia śladu węglowego na podstawie twojej
                        ostatniej ankiety
                      </DialogDescription>
                    </DialogHeader>
                    <div className="w-full box-border">
                      <ol className="list-decimal w-full pl-4 space-y-2">
                        {userData?.surveys[
                          userData?.surveys.length - 1
                        ].tips.map((tip, index) => (
                          <li
                            className={`text-sm ${
                              tipsClick == 1
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
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>Zadania tygodniowe</CardTitle>
                <CardDescription>Twoje zadania na ten tydzień</CardDescription>
              </div>

              {!userData?.challenges ? (
                <span className="text-sm text-muted-foreground">
                  {(() => {
                    const { end } = getWeekStartAndEnd();
                    return <Timer targetDate={end} />;
                  })()}
                </span>
              ) : (
                <Skeleton className="h-[14px] w-[30px]" />
              )}
            </CardHeader>
            <CardContent>
              {userData?.challenges && userData.challenges.length > 0 ? (
                userData?.challenges.map((challenge, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" className="h-fit mb-4">
                        <div className="flex align-top justify-start gap-4 h-fit w-full m-0">
                          <p className="text-sm text-white font-bold bg-green-700 rounded-full aspect-square w-12 h-12 flex items-center justify-center">
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
