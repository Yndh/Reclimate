import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import dashboard from "@/assets/dashboard.png";
import mobileDashboard from "@/assets/mobileDashboard.png";
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-[5000px] items-center overflow-y-auto gap-24 md:gap-[150px] px-2 lg:px-64 scroll-smooth">
      <Navbar />

      <div className="w-full h-fit flex flex-col items-center justify-center">
        <div className="h-fit">
          <ContainerScroll
            titleComponent={
              <>
                <h1 className="flex flex-col text-center text-4xl font-semibold">
                  Zrób pierwszy krok dla planety
                  <span className="text-2xl md:text-[6rem] font-bold mt-1 leading-none">
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
              className="hidden sm:block w-full rounded-xl object-contain"
            />
            <Image
              src={mobileDashboard}
              alt="hero"
              width={720}
              height={1400}
              className="block sm:hidden h-full rounded-xl object-contain"
            />
          </ContainerScroll>
        </div>
      </div>

      <div className="flex flex-col items-center w-full text-center" id="about">
        <p className="text-sm text-muted-foreground font-semibold">O nas</p>
        <h2 className="text-3xl font-semibold pb-2">
          Dlaczego warto działać dla planety?
        </h2>
        <p className="text-muted-foreground text-base w-[400px]">
          Twoje codzienne wybory mają realny wpływ na klimat, a Reclimate pomoże
          Ci je zrozumieć i zmienić!
        </p>

        <div className="w-2/3 flex flex-col md:flex-row items-center justify-center gap-4 mt-10 text-left">
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
        <h2 className="text-3xl font-semibold pb-2">Jak działa Reclimate?</h2>
        <p className="text-muted-foreground text-base w-[400px]">
          Poznaj funkcje, które pozwolą ci żyć w zgodzie z klimatem!
        </p>

        <FeaturesSection />
      </div>
    </div>
  );
}
