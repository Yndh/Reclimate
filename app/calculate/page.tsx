"use client";

import AppSurvey from "@/components/survey";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Survey } from "@/lib/types";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export interface Question {
  id: string;
  question: string;
  options: Option[];
}

export interface Option {
  id: string;
  option: string;
}

export interface SurveyAnswer {
  id: string;
  option: Option;
}

const chartConfig = {
  poland: {
    label: "Polska",
    color: "hsl(var(--chart-2))",
  },
  yours: {
    label: "Ty",
    color: "hsl(var(--chart-1))",
  },
  global: {
    label: "Świat",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function CalculatePage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/signIn");
    },
  });
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [surveyId, setSurveyId] = useState<string>();
  const [surveyResponse, setSurveyResponse] = useState<Survey>();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const res = await fetch("/api/survey")
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              if (data.redirect) {
                router.replace(data.redirect);
                return;
              }
              toast({
                variant: "destructive",
                description: data.error,
              });
              router.replace("/app");
            }
            if (data.id) {
              setSurveyId(data.id);
            }
            if (data.questions) {
              setQuestions(data.questions);
            }
          });
      } catch (err) {
        console.error(`Error getting survey: ${err}`);
        toast({
          variant: "destructive",
          description: "Wystąpił błąd w trakcie pobiernia ankiety",
        });
        router.replace("/app");
      }
    };
    fetchSurveyData();
  }, []);

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const submitHandler = async () => {
    nextStep();

    try {
      await fetch(`/api/survey/${surveyId}`, {
        method: "POST",
        body: JSON.stringify({
          answers,
        }),
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

          if (data.survey) {
            setSurveyResponse(data.survey);
          }
        });
    } catch (err) {
      console.error(`Error submiting survey: ${err}`);
      toast({
        variant: "destructive",
        description: "Wystąpił błąd w trakcie przesyłanai ankiety",
      });
    }
  };

  const chartData = [
    { target: "poland", footprint: 8, fill: "var(--color-poland)" },
    {
      target: "yours",
      footprint: surveyResponse?.carbonFootprint,
      fill: "var(--color-yours)",
    },
    { target: "global", footprint: 4.5, fill: "var(--color-global)" },
  ];

  return (
    <div className="flex items-center justify-center w-full h-full p-10">
      {step == 0 && (
        <Card className="w-full h-fit md:h-1/2 md:w-1/2">
          <CardHeader>
            <CardTitle>Wprowadzenie</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center gap-2 h-2/3">
            {questions.length > 0 ? (
              <>
                <h2 className="text-xl font-bold">Na czym to polega?</h2>
                <p className="text-base text-muted-foreground">
                  Ankieta składa się z serii pytań dotyczących Twojego stylu
                  życia. Na podstawie Twoich odpowiedzi oszacujemy Twój ślad
                  węglowy oraz zaproponujemy konkretne rekomendacje dotyczące
                  bardziej ekologicznych wyborów.
                </p>
                <p className="w-full mx-5 text-right text-muted-foreground text-sm">
                  Czas trwania: 5-10min
                </p>

                <Button className="mt-4" onClick={nextStep}>
                  Rozpocznij
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="w-[200px] h-[20px] mb-2 rounded-full" />
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-full h-[20px] rounded-full" />
                <div className="w-full mx-5 flex justify-end">
                  <Skeleton className="w-[100px] h-[20px] rounded-full" />
                </div>
                <Skeleton className="w-[200px] h-[20px] mt-4 rounded-full" />
              </>
            )}
          </CardContent>
        </Card>
      )}
      {step === 1 && (
        <AppSurvey
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={submitHandler}
        />
      )}
      {step == 2 && (
        <Card
          className={`gradient-border-box w-full h-fit md:h-1/2 md:w-1/2 bg-background py-4 ${
            !surveyResponse && "backdrop-blur-[0px] h-1/2 !backdrop-filter-none"
          }`}
        >
          <div className={`gradient -z-40 ${surveyResponse && "finish"}`}></div>
          <CardContent
            className={`flex flex-col justify-center items-center text-center gap-2 h-full ${
              !surveyResponse ? "animate-pulse" : "animate-in"
            }`}
          >
            {!surveyResponse ? (
              <>
                <Sparkles className="" size={32} />
                <p className="text-base text-muted-foreground ">
                  Analizowanie ankiety...
                </p>
              </>
            ) : (
              <>
                <p className="text-lg opacity-85">Twój roczny ślad węglowy:</p>
                <div className="flex flex-col gap-0 mb-10">
                  <h1 className="text-6xl font-bold">
                    {surveyResponse.carbonFootprint}
                  </h1>
                  <span className="text-sm text-muted-foreground">Ton CO₂</span>
                </div>
                <ChartContainer
                  config={chartConfig}
                  className="w-full mx-10 h-[150px]"
                >
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 0,
                    }}
                  >
                    <YAxis
                      dataKey="target"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        chartConfig[value as keyof typeof chartConfig]?.label
                      }
                    />
                    <XAxis dataKey="footprint" type="number" hide />
                    <Bar dataKey="footprint" layout="vertical" radius={5} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                  </BarChart>
                </ChartContainer>
                <Button
                  className="w-full mt-8"
                  variant={"outline"}
                  onClick={() => {
                    router.push("/app?tips=true");
                  }}
                >
                  Dalej
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
