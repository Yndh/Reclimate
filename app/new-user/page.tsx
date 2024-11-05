"use client";

import AppSurvey from "@/components/survey";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Answer, Survey } from "@/lib/types";
import { ChevronRight, Sparkles } from "lucide-react";
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
  visitors: {
    label: "Visitors",
  },
  poland: {
    label: "Polska",
    color: "hsl(var(--chart-1))",
  },
  yours: {
    label: "Ty",
    color: "hsl(var(--chart-2))",
  },
  global: {
    label: "Świat",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function NewUserPage() {
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
        const res = await fetch("/api/first-survey")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.id) {
              setSurveyId(data.id);
            }
            if (data.questions) {
              setQuestions(data.questions);
            }
            if (data.error) {
              router.replace("/app");
            }
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchSurveyData();
  }, []);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const submitHandler = async () => {
    console.log(answers);

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
          console.log(data);
          setSurveyResponse(data.survey);
        });
    } catch (e) {
      console.log(e);
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
    <div className="flex items-center justify-center w-full h-full">
      {step == 0 && (
        <Card className="w-1/2 h-1/2">
          <CardHeader>
            <CardTitle>Wprowadzenie</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center gap-2 h-2/3">
            {questions.length > 0 ? (
              <>
                <h2 className="text-xl font-bold">
                  Witaj, {session?.user?.name}!
                </h2>
                <p className="text-base text-muted-foreground">
                  „Hakhiros2" to innowacyjna aplikacja, która pomaga
                  użytkownikom zrozumieć wpływ ich stylu życia na środowisko.
                  Dzięki interaktywnym narzędziom zwiększamy świadomość
                  ekologiczną i pomagamy w podejmowaniu bardziej zrównoważonych
                  decyzji.
                </p>
                <p className="text-base text-muted-foreground">
                  Aby rozpocząć, musisz wypełnić ankietę, która składa się z
                  serii pytań dotyczących Twojego stylu życia. Na podstawie
                  Twoich odpowiedzi oszacujemy Twój ślad węglowy oraz
                  zaproponujemy konkretne rekomendacje dotyczące bardziej
                  ekologicznych wyborów.
                </p>

                <Button className="mt-4" onClick={nextStep}>
                  Wypełnij ankietę <ChevronRight />
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="w-[200px] h-[20px] mb-2 rounded-full" />
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-full mt-4 h-[20px] rounded-full" />
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-[200px] h-[20px] mt-4 rounded-full" />
              </>
            )}
          </CardContent>
        </Card>
      )}
      {step == 1 && (
        <Card className="w-1/2 h-1/2">
          <CardHeader>
            <CardTitle>Wprowadzenie</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center gap-2 h-2/3">
            <h2 className="text-xl font-bold">Na czym to polega?</h2>
            <p className="text-base text-muted-foreground">
              Ankieta składa się z serii pytań dotyczących Twojego stylu życia.
              Na podstawie Twoich odpowiedzi oszacujemy Twój ślad węglowy oraz
              zaproponujemy konkretne rekomendacje dotyczące bardziej
              ekologicznych wyborów.
            </p>
            <p className="w-full mx-5 text-right text-muted-foreground text-sm">
              Czas trwania: 5-10min
            </p>

            <Button className="mt-4" onClick={nextStep}>
              Rozpocznij
            </Button>
          </CardContent>
        </Card>
      )}
      {step === 2 && (
        <AppSurvey
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={submitHandler}
        />
      )}
      {step === 3 && (
        <Card className="gradient-border-box w-1/2 h-1/2">
          <div className={`gradient ${surveyResponse && "finish"}`}></div>
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
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="footprint" layout="vertical" radius={5} />
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
