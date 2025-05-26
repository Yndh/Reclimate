"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Challenge, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppChallengesTable } from "@/components/app-challenges-table";
import { Timer } from "@/components/timer";
import { CompleteTimer } from "@/components/completeTimer";
import { toast } from "@/hooks/use-toast";

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

export default function CarbonPage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [completeDate, setCompleteDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const memoizedGetWeekStartAndEnd = useCallback(getWeekStartAndEnd, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/challenges");
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

        const { end } = memoizedGetWeekStartAndEnd();
        const target = new Date(end);
        setCompleteDate(new Date(target.getTime() - 1 * 24 * 60 * 60 * 1000));
      }
    } catch (err) {
      console.error(`Error getting user challenges: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie pobierania danych użytkownika",
      });
    } finally {
      setLoading(false);
    }
  }, [memoizedGetWeekStartAndEnd]);

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
      console.error(`Error updating challenge: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie aktualizowania wyzwania",
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const displayedChallenges = useMemo(() => {
    if (!userData?.challenges) {
      return [];
    }
    const { start, end } = memoizedGetWeekStartAndEnd();
    return userData.challenges.filter(
      (challenge) =>
        new Date(challenge.endDate).toISOString() === end.toISOString() &&
        new Date(challenge.startDate).toISOString() === start.toISOString()
    );
  }, [userData?.challenges, memoizedGetWeekStartAndEnd]);

  return (
    <div className="w-full h-full p-8 overflow-y-scroll">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 ">
        <Card className="order-2 md:order-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Zadania tygodniowe</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
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
            ) : displayedChallenges.length > 0 ? (
              <>
                {displayedChallenges.map((challenge) => (
                  <Popover key={challenge.id}>
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
                ))}
              </>
            ) : (
              <p className="text-center text-muted-foreground">
                Brak zadań na ten tydzień.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 order-1 md:order-2">
          <Card>
            <CardHeader>
              <CardTitle>Punkty</CardTitle>
              <CardDescription>Ilość punktów</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="w-[30px] h-[30px]" />
              ) : (
                <p className="text-xl font-bold">
                  {userData?.points != null ? userData.points : "N/A"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nowe wyzwania</CardTitle>
              <CardDescription>
                Ile czasu zostało do otrzymania nowych wyzwań tygodniowych
              </CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="w-[80px] h-[30px]" />
              ) : (
                <Timer targetDate={memoizedGetWeekStartAndEnd().end} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-[300px] md:h-[400px] lg:h-full overflow-y-auto mt-4">
        {loading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : (
          <AppChallengesTable challenges={userData?.challenges ?? []} />
        )}
      </div>
    </div>
  );
}
