"use client";

import AppSurvey from "@/components/app-survey";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Answer, Survey } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const survey: Survey = {
  id: 1,
  date: new Date(),
  questions: [
    {
      id: 1,
      question: "Ile kilometrów pokonujesz tygodniowo samochodem?",
      answers: [
        { id: 1, value: "Mniej niż 10 km" },
        { id: 2, value: "10-50 km" },
        { id: 3, value: "50-200 km" },
        { id: 4, value: "Ponad 200 km" },
      ],
    },
    {
      id: 2,
      question: "Jak często korzystasz z transportu publicznego?",
      answers: [
        { id: 5, value: "Codziennie" },
        { id: 6, value: "Kilka razy w tygodniu" },
        { id: 7, value: "Kilka razy w miesiącu" },
        { id: 8, value: "Nigdy" },
      ],
    },
    {
      id: 3,
      question: "Jaki jest główny sposób ogrzewania Twojego domu?",
      answers: [
        { id: 9, value: "Gaz" },
        { id: 10, value: "Prąd" },
        { id: 11, value: "Paliwo stałe (np. węgiel)" },
        { id: 12, value: "Odnawialne źródła energii (np. pompy ciepła)" },
      ],
    },
    {
      id: 4,
      question: "Ile osób mieszka w Twoim gospodarstwie domowym?",
      answers: [
        { id: 13, value: "1" },
        { id: 14, value: "2" },
        { id: 15, value: "3-4" },
        { id: 16, value: "5 lub więcej" },
      ],
    },
    {
      id: 5,
      question: "Jak często spożywasz mięso?",
      answers: [
        { id: 17, value: "Codziennie" },
        { id: 18, value: "Kilka razy w tygodniu" },
        { id: 18, value: "Kilka razy w miesiącu" },
        { id: 20, value: "Nigdy" },
      ],
    },
    {
      id: 6,
      question:
        "Ile godzin tygodniowo korzystasz z urządzeń elektronicznych (komputer, telewizor, telefon)?",
      answers: [
        { id: 21, value: "Mniej niż 10 godzin" },
        { id: 22, value: "10-20 godzin" },
        { id: 23, value: "20-40 godzin" },
        { id: 24, value: "Ponad 40 godzin" },
      ],
    },
    {
      id: 7,
      question: "Ile razy w roku latasz samolotem?",
      answers: [
        { id: 25, value: "0 razy" },
        { id: 26, value: "1-2 razy" },
        { id: 27, value: "3-5 razy" },
        { id: 28, value: "Ponad 5 razy" },
      ],
    },
    {
      id: 8,
      question: "Czy segregujesz odpady?",
      answers: [
        { id: 29, value: "Tak, zawsze" },
        { id: 30, value: "Tak, czasami" },
        { id: 31, value: "Rzadko" },
        { id: 32, value: "Nie" },
      ],
    },
    {
      id: 9,
      question: "Jak często kupujesz nowe ubrania?",
      answers: [
        { id: 33, value: "Kilka razy w miesiącu" },
        { id: 34, value: "Kilka razy w roku" },
        { id: 35, value: "Raz w roku" },
        { id: 36, value: "Rzadziej niż raz w roku" },
      ],
    },
    {
      id: 10,
      question: "Ile litrów wody zużywasz dziennie podczas kąpieli/prysznica?",
      answers: [
        { id: 37, value: "Mniej niż 20 litrów" },
        { id: 38, value: "20-50 litrów" },
        { id: 39, value: "50-100 litrów" },
        { id: 40, value: "Ponad 100 litrów" },
      ],
    },
  ],
};

export default function CalculatePage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/signIn");
    },
  });
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const nextStep = () => {
    if (step < 1) {
      setStep(step + 1);
    }
  };

  const submitHandler = () => {
    router.replace("app?newUser=true");
    console.log(answers);
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
          survey={survey}
          answers={answers}
          setAnswers={setAnswers}
          onFinish={submitHandler}
        />
      )}
    </div>
  );
}
