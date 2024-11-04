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
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const res = await fetch("/api/survey")
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
    if (step < 1) {
      setStep(step + 1);
    }
  };

  const submitHandler = async () => {
    // router.replace("app?newUser=true");
    console.log(answers);

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
        });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      {step == 0 && (
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
      {step === 1 && (
        <AppSurvey
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={submitHandler}
        />
      )}
    </div>
  );
}
