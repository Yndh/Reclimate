"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ClockIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function NewUserPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {},
  });

  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const lastStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      {step == 0 && (
        <Card className="w-1/2 h-1/2">
          <CardHeader>
            <CardTitle>Wprowadzenie</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center gap-2">
            <CardTitle>Witaj, {session?.user?.name}!</CardTitle>
            <CardDescription>
              „Hakhiros2" to innowacyjna aplikacja, która pomaga użytkownikom
              zrozumieć wpływ ich stylu życia na środowisko. Dzięki
              interaktywnym narzędziom zwiększamy świadomość ekologiczną i
              pomagamy w podejmowaniu bardziej zrównoważonych decyzji.
            </CardDescription>
            <CardDescription>
              Aby rozpocząć, musisz wypełnić ankietę, która składa się z serii
              pytań dotyczących Twojego stylu życia. Na podstawie Twoich
              odpowiedzi oszacujemy Twój ślad węglowy oraz zaproponujemy
              konkretne rekomendacje dotyczące bardziej ekologicznych wyborów.
            </CardDescription>

            <Button className="mt-4" onClick={nextStep}>
              Wypełnij ankietę <ChevronRight />
            </Button>
          </CardContent>
        </Card>
      )}
      {step == 1 && (
        <Card className="w-1/2 h-1/2">
          <CardHeader>
            <CardTitle>Wprowadzenie</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center gap-2">
            <CardTitle>Co to za ankieta?</CardTitle>
            <CardDescription>
              Ankieta składa się z serii pytań dotyczących Twojego stylu życia.
              Na podstawie Twoich odpowiedzi oszacujemy Twój ślad węglowy oraz
              zaproponujemy konkretne rekomendacje dotyczące bardziej
              ekologicznych wyborów.
            </CardDescription>
            <CardDescription className="w-full mx-5 text-right">
              Czas trwania: 5-10min
            </CardDescription>

            <Button className="mt-4" onClick={nextStep}>
              Rozpocznij
            </Button>
          </CardContent>
        </Card>
      )}
      {step == 2 && (
        <Card className="w-1/2 h-1/2">
          <CardHeader>
            <CardTitle>Pytanie 1</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center text-center gap-2">
            <Progress max={10} value={1} />
            <CardTitle className="text-xl mt-2">
              Jak często korzystasz z transportu publicznego?
            </CardTitle>

            <Button className="mt-4 w-full" variant="outline">
              Nigdy
            </Button>

            <Button className="mt-4 w-full" variant="outline">
              Rzadko
            </Button>

            <Button className="mt-4 w-full" variant="outline">
              Czasami
            </Button>

            <Button className="mt-4 w-full" variant="outline">
              Często
            </Button>

            <div className="flex gap-4 w-full">
              <Button className="mt-4 w-full" variant="outline">
                Wróć
              </Button>
              <Button className="mt-4 w-full">Dalej</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
