import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import dashboard from "@/public/dashboard.png";
import mobileDashboard from "@/public/mobileDashboard.png";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Handshake, Lightbulb, TreeDeciduous } from "lucide-react";
import FeaturesSection from "@/components/features-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Globe } from "@/components/globe";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqData: { question: string; answer: string }[] = [
  {
    question: "Jak obliczany jest mój ślad węglowy?",
    answer:
      "Twój ślad węglowy jest szacowany na podstawie odpowiedzi na pytania dotyczące Twojego stylu życia, w tym zużycia energii, preferowanego środka transportu oraz diety. Dane te są analizowane przez algorytm AI w celu określenia Twojego wkładu w emisję CO2.",
  },
  {
    question: "Jak często mogę powtarzać ankietę?",
    answer: `Ankietę możesz powtarzać co ${process.env.SURVEY_COOLDOWN}h, aby śledzić swoje postępy i widzieć zmiany w śladzie węglowym.`,
  },
  {
    question: "Czy moje dane są bezpieczne?",
    answer:
      "Tak, bezpieczeństwo Twoich danych jest naszym priorytetem, dlatego wykorzystujemy logowanie wyłącznie za pośrednictwem Google i GitHub, dzięki czemu unikamy przechowywania haseł w naszej bazie danych.",
  },
  {
    question: "Jakie wyzwania ekologiczne mogę podjąć?",
    answer:
      "Wyzwania ekologiczne są dostosowywane indywidualnie dla każdego użytkownika co tydzień przez nasz algorytm AI. Mogą obejmować ograniczenie zużycia plastiku, redukcję korzystania z transportu spalinowego czy zwiększenie liczby roślinnych posiłków w diecie.",
  },
  {
    question: "Czy mogę porównać swoje wyniki z innymi?",
    answer:
      "Tak, w sekcji społecznościowej dostępny jest ranking użytkowników, który umożliwia porównywanie wyników z innymi osobami!",
  },
  {
    question: "Czy aplikacja jest darmowa?",
    answer: "Tak, aplikacja jest całkowicie darmowa!",
  },
  {
    question: "Jak mogę zdobywać punkty?",
    answer:
      "Punkty zdobywa się za wykonywanie tygodniowych wyzwań ekologicznych.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-y-auto gap-24 px-4 lg:px-64 scroll-smooth">
      <Navbar />

      <div className="w-full h-fit flex flex-col items-center justify-center mt-40 md:mt-5">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="flex flex-col text-center text-xl md:text-4xl font-semibold">
                Zrób pierwszy krok dla planety
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Zmieniaj nawyki z pomocą AI!
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={dashboard}
            alt="hero"
            width={1400}
            height={720}
            className="hidden md:block w-full rounded-xl object-contain"
          />
          <Image
            src={mobileDashboard}
            alt="hero"
            width={720}
            height={1400}
            className="block md:hidden h-full rounded-xl object-contain"
          />
        </ContainerScroll>
      </div>

      <div className="flex flex-col items-center w-full text-center" id="about">
        <p className="text-sm text-muted-foreground font-semibold">
          Nasza misja
        </p>
        <h2 className="text-4xl font-semibold pb-2">
          Dlaczego warto wybrać Reclimate?
        </h2>
        <p className="text-muted-foreground text-base w-[400px]">
          Twoje codzienne wybory mają realny wpływ na klimat, a Reclimate pomoże
          Ci je zrozumieć i zmienić!
        </p>

        <div className="w-full md:w-2/3 flex flex-col md:flex-row justify-center gap-4 mt-10 text-left">
          <Card>
            <CardHeader>
              <Lightbulb size={32} className="text-yellow-400" />
            </CardHeader>
            <CardContent>
              <CardTitle>Świadomość</CardTitle>
              <CardDescription>
                Dowiedz się, jaki jest Twój wpływ na środowisko.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TreeDeciduous size={32} className="text-green-700" />
            </CardHeader>
            <CardContent>
              <CardTitle>Rozwój</CardTitle>
              <CardDescription>
                Poznaj proste kroki ku lepszej przyszłości.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Handshake size={32} className="text-yellow-100" />
            </CardHeader>
            <CardContent>
              <CardTitle>Społeczność</CardTitle>
              <CardDescription>
                Dołącz do ludzi, którzy dbają o środowisko.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col items-center w-full text-center" id="app">
        <p className="text-sm text-muted-foreground font-semibold">Funkcje</p>
        <h2 className="text-4xl font-semibold pb-2">Jak działa Reclimate?</h2>
        <p className="text-muted-foreground text-base w-[400px]">
          Poznaj funkcje, które pozwolą ci żyć w zgodzie z klimatem!
        </p>

        <FeaturesSection />
      </div>

      <div className="flex flex-col items-center w-full text-center" id="faq">
        <p className="text-sm text-muted-foreground font-semibold">FAQ</p>
        <h2 className="text-4xl font-semibold pb-2">
          Masz pytania? Oto odpowiedzi!
        </h2>
        <p className="text-muted-foreground text-base w-[400px]">
          W tej sekcji znajdziesz odpowiedzi na najczęściej zadawane pytania.
        </p>

        <Accordion type="single" collapsible className="w-full text-left">
          {faqData.map((question, index) => (
            <AccordionItem value={`item-${index}`} key={`acc${index}`}>
              <AccordionTrigger>{question.question}</AccordionTrigger>
              <AccordionContent>{question.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="flex flex-col items-center w-full text-center" id="join">
        <p className="text-sm text-muted-foreground font-semibold">
          Dołącz teraz
        </p>
        <h2 className="text-4xl font-semibold pb-2">
          Zacznij zmieniać swoje nawyki już dziś!
        </h2>
        <p className="text-muted-foreground text-base w-[400px]">
          Dołącz do społeczności Reclimate i żyj bardziej ekologicznie!
        </p>

        <div className="w-full h-[300px] flex justify-center items-center relative mt-10 box-border overflow-hidden">
          <Link href="/signIn">
            <Button
              variant={"ghost"}
              className="border border-border rounded-full bg-card py-6 px-14 shadow backdrop-blur-[8px] duration-300 font-semibold text-base"
            >
              Dołącz teraz!
            </Button>
          </Link>
          <Globe className="absolute -z-10 -top-10" />
        </div>
      </div>
    </div>
  );
}
