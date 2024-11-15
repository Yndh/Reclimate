import { Navbar } from "@/components/navbar";
import Image, { StaticImageData } from "next/image";
import nextLogo from "@/assets/nextLogo.png";
import reactLogo from "@/assets/reactLogo.png";
import gptLogo from "@/assets/gptLogo.png";
import authLogo from "@/assets/authLogo.png";
import prismaLogo from "@/assets/prismaLogo.png";
import tailwindLogo from "@/assets/tailwindLogo.png";

interface Question {
  title: string;
  subtitle?: string;
  items: Item[];
}

interface Item {
  title?: string;
  content: string;
  child?: React.ReactNode;
  items?: Item[];
}

interface techStack {
  description: string;
  image: StaticImageData;
}
const logos: techStack[] = [
  {
    description: "Next.js (backend)",
    image: nextLogo,
  },
  {
    description: "Prisma ORM",
    image: prismaLogo,
  },
  {
    description: "GPT 4o-mini",
    image: gptLogo,
  },
  {
    description: "Auth.js",
    image: authLogo,
  },
  {
    description: "React",
    image: reactLogo,
  },
  {
    description: "Tailwind CSS",
    image: tailwindLogo,
  },
];

const questions: Question[] = [
  {
    title: "Na jakie potrzeby/problem odpowiada Wasze rozwiązanie?",
    items: [
      {
        content:
          "Moja aplikacja odpowiada na poważny problem, jakim jest niska świadomość o wpływie naszych codziennych decyzji na środowisko. Wiele osób nie zdaje sobie sprawy, w jaki sposób ich styl życia oraz codzienne decyzje takie jak transport, zużycie energii, dieta czy ogólny konsumpcjonizm przyczyniają się do zmiany klimatu i degradacji środowiska. Reclimate ma na celu pomóc użytkownikom zrozumieć ich indywidualny ślad węglowy i zmienić codzienne nawyki dążąc tym do bardziej zrównoważonego stylu życia. Dodatkowo, poprzez elementy rywalizacji oraz wyzwań, aplikacja mobilizuje do aktywnego zaangażowania w dbanie o środowisko.",
      },
      {
        content:
          "Podczas analizy istniejących rozwiązań w tym temacie zauważyłem kilka problemów, które wiedziałem jak rozwiązać:",
        items: [
          {
            title: "Stała pula pytań ",
            content:
              "Wiele aplikacji stosuje szablonowe pytania ze stałymi odpowiedziami, które nie pozwalają na pełne zrozumienie indywidualnych nawyków użytkowników.",
          },
          {
            title: "Brak personalizacji",
            content:
              "Wiele istniejących rozwiązań nie dostosowuje się do zmieniających się nawyków użytkownika, przez co porady są ogólnikowe i mało skuteczne.",
          },
          {
            title: "Brak motywacji do regularnego korzystania z aplikacji",
            content:
              "Niektóre aplikacje skupiają się na obliczeniu śladu i przedstawieniu kilku płytkich porad przez co użytkownik nie ma motywacji do stałego monitorowania postępów i podejmowaniu znaczących dla środowiska działań.",
          },
          {
            title: "Nieintuicyjne i przestarzałe Interfejsy Użytkownika (UI) ",
            content:
              "Duża ilość aplikacji w tym temacie ma skomplikowane, nieintuicyjne czy nieczytelne interfejsy, co utrudnia użytkownikowi komfortowe korzystanie z aplikacji. Brak modernistycznych designów sprawia, że aplikacja staje się mało atrakcyjna czy czasami trudniejsza w obsłudze, co negatywnie wpływa na zaangażowanie użytkowników.",
          },
        ],
      },
      {
        content:
          "Dlatego właśnie Reclimate wyróżnia się następującymi cechami:",
        items: [
          {
            title: "Personalizowane ankiety ",
            content:
              "Dzięki użyciu sztucznej inteligencji (AI), pytania w ankiecie są tworzone na podstawie odpowiedzi z poprzednich ankiet, co powala na głębsze zrozumienie codziennych nawyków użytkownika, dokładniejsze określenie śladu węglowego i dostarczenie precyzyjniejszych rekomendacji.",
          },
          {
            title: "Nowoczesny design ",
            content:
              "Moje rozwiązanie może pochwalić się estetycznym, intuicyjnym interfejsem użytkownika (UI), co zapewnia użytkownikowi łatwą nawigację i przyjemne doświadczenie. ",
          },
          {
            title: "Multiplatformowość",
            content:
              "Reclimate jest aplikacją webowa, co pozwala na używanie jej niezależnie od systemu operacyjnego (Android, iOS, Windows, MacOS czy Linux) bez potrzeby dostosowywania aplikacji do każdego z osobna.",
          },
        ],
      },
    ],
  },
  {
    title:
      "W jakich językach programowania, jakich technologiach powstała aplikacja/narzędzie",
    items: [
      {
        content:
          "Aplikacja została stworzona z wykorzystaniem najnowszych i szybkich technologiach webowych, co umożliwia jej łatwą dostępność na różnych urządzeniach (takich jak komputery, smartfony czy tablety)",
        child: (
          <div className="w-full flex flex-row justify-between items-center flex-wrap text-center mt-4">
            {logos.map((logo, index) => (
              <div
                className="flex flex-col items-center justify-center gap-2 "
                key={`logo${index}`}
              >
                <Image
                  src={logo.image}
                  alt="tech logo"
                  className="h-[100px] w-auto object-scale-down"
                />
                <p>{logo.description}</p>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
  {
    title: "Opisz działanie Waszej aplikacji/narzędzia",
    subtitle:
      "W jaki sposób działa Wasza aplikacja? Co może dzięki niej osiągnąć użytkownik? Jaką ma funkcjonalność?",
    items: [
      {
        content:
          "Reclimate jest aplikacją zaprojektowaną aby w prosty lecz skuteczny sposób zwiększyć świadomość użytkowników o negatywnym wpływie na środowisko oraz pomóc w podejmowaniu bardziej zrównoważonych decyzji życiowych. Głównym celem aplikacji jest zrozumienie indywidualnego wpływu na środowisko, edukacja o wpływie ich codziennych nawyków na środowisko oraz pomoc w zmniejszeniu śladu węglowego. ",
      },
      {
        content:
          "Design aplikacji jest oparty na modernistycznych trendach wyglądu, co pomaga w intuicyjnym i przyjemnym użytkowaniu aplikacji.",
      },
      {
        content: "Sposób działania aplikacji:",
        items: [
          {
            title: "Interaktywna ankieta o śladzie węglowym ",
            content:
              "Użytkownik wypełnia ankietę, której celem jest dokładne zrozumienie codziennych nawyków użytkownika, takich jak zużycie energii, transport, dieta i inne aspekty życia wpływające na środowisko. Dzięki zastosowaniu sztucznej inteligencji (AI), pytania są dynamicznie dostosowywane na do odpowiedzi z poprzednich ankiet, co pozwala na dokładne oszacowanie śladu węglowego. ",
          },
          {
            title: "Raport z wynikami",
            content:
              "Na podstawie wyników aplikacja generuje raport, który pokazuje wynik użytkownika na tle średniej krajowej oraz globalnej, co pozwala na lepsze zrozumienie, jak ich wybory wpływają na środowisko.",
          },
          {
            title: "Dashobard",
            content:
              "Jest to centrum aplikacji w którum użytkownik może śledzić swoje postępy. Wyświetlane są tu dane w formie wykresów, które ułatwiają śledzenie postępów. Widnieje też aktualny ślad węglowy oraz lista wyzwań tygodniowych. Ponadto użytkownik ma dostęp do listy porad dotyczących poprawy jego wpływu na środowisko.",
          },
          {
            title: "Monitorowanie postępów",
            content:
              "Aplikacja umożliwia użytkownikowi wielokrotne powtarzanie ankiety dostosowując pytania do odpowiedzi z poprzednich pytań. Na podstawie historii ankiet generowany jest wykres przedstawiający zmiany w śladzie węglowym.",
          },
          {
            title: "Społeczność i rywalizacja",
            content:
              "Użytkownicy mogą zdobywać punkty za wykonywanie wyzwań tygodniowych. Punkty te są następnie porównywane w ramach systemu rankingowego, umożliwiając użytkownikom zobaczenie swojego poziomu na tle innych uczestników.",
          },
          {
            title: "Asystent AI",
            content:
              "W aplikacji znajduje się także asystent AI ds. klimatu i środowiska, który umożliwia użytkownikom zadawanie pytań dotyczących stylu życia, ochrony środowiska oraz zmian klimatycznych. Asystent jest dostępny w formie popupu w prawym dolnym rogu aplikacji oraz na dedykowanej stronie, co sprawia, że jest zawsze pod ręką, gdy użytkownik potrzebuje informacji lub porady.",
          },
        ],
      },
    ],
  },
  {
    title: "Jak widzicie dalszy rozwój Waszego rozwiązania?",
    subtitle:
      "W jaki sposób Wasz projekt mógłby zostać wdrożony lub rozwijany? Jacy partnerzy mogliby się zaangażować w jego rozwój?",
    items: [
      {
        content:
          "„Klimat i Środowisko” jest obszernym tematem który oferuje wiele ścieżek rozwoju. Aktualna wersja aplikacji została zaprojektowana w schemacie MVP (Minimum Viable Product), co pozwoliło skupić się na wprowadzeniu kliczowych funkcjonalności. Jednak lista pomysłów na dalszy rozwój jest ogromna, jednak tu przedstawie tylko niektóre z nich, które mogą się przyczynić do rozwoju projektu:",
        items: [
          {
            title:
              "•	Użycie self-hosted modeli językowych oraz dalszy rozwój systemów AI ",
            content:
              "W przyszłości aplikacja mogłaby korzystać otwartych modeli językowych, takich jak Llama czy Phi-3, które zostałyby rozwinięte o dane zebrane przez użytkowników. Taki rozwój pozwoliłby na zwiększenie dokładności analizy i rekomendacji, a także lepsze dostosowanie pytań i porad do indywidualnych potrzeb użytkowników.",
          },
          {
            title: "Integracja z zewnętrznymi urządzeniami",
            content:
              "Możliwość podłączenia do aplikacji urządzeń zewnętrznych takich jak liczniki energii, aby na bieżąco monitorować zużycie energii i automatycznie dostarczać rekomendacje dotyczące optymalizacji zużycia energii, przyczyniając się do dalszej redukcji śladu węglowego użytkowników.",
          },
          {
            title: "Współpraca z organizacjami ekologicznymi ",
            content:
              "Zawiąznie współpracy z organizacjami zajmującymi się ochroną środowiska umożliwiłoby wprowadzenie nowych funkcji wspierających działania proekologiczne. Przykładowo, użytkownicy mogliby wymieniać punkty na konkretne działania, takie jak posadzenie drzewa, recykling czy wsparcie organizacji ekologicznych.",
          },
          {
            title: "Wsparcie innych języków i globalizacja aplikacji ",
            content:
              "Aktualnie aplikacja dostępna tylko w języku polskim i skierowana do polskich użytkowników. Jednak w trakcie rozwoju można by było wprowadzić aplikację na rynki międzynarodowe wprowadzając inne języki do aplikacji.",
          },
          {
            title: "Poszerzenie zespołu developerów ",
            content:
              "Większy zespół pomógłby w pewnym i szybszym rozwoju aplikacji oraz rozwinięciu jej o bardziej zaawansowane funkcjonalności. Większy zespół pozwoliłby również na lepsze zarządzanie projektem i skrócenie czasu wdrożenia nowych funkcji oraz zmniejszenie awaryjności.",
          },
        ],
      },
      {
        content:
          "Potencjalni partnerzy, którzy mogliby zaangażować się w rozwój aplikacji: ",
        items: [
          {
            title: "Firmy zajmujące się technologiami smart home",
            content:
              "Współpraca z producentami urządzeń IoT (Internet of Things) mogłaby umożliwić integrację aplikacji z nowoczesnymi urządzeniami monitorującymi zużycie energii, wodę czy inne zasoby. ",
          },
          {
            title: "Organizacje ekologiczne i pozarządowe",
            content:
              "Współpraca z organizacjami zajmującymi się ochroną środowiska umożliwiłaby wprowadzenie funkcji, które angażowałyby użytkowników w aktywności na rzecz ochrony środowiska, takie jak sadzenie drzew, organizowanie wydarzeń proekologicznych czy wspieranie działań edukacyjnych. ",
          },
          {
            title: "Instytucje rządowe oraz organizacje międzynarodowe",
            content:
              "Partnerstwa z organizacjami rządowymi lub międzynarodowymi mogłyby wspierać aplikację w jej rozwoju, oferując dodatkowe zasoby, finansowanie lub dostęp do szerszych baz danych dotyczących wpływu na środowisko.",
          },
        ],
      },
    ],
  },
  {
    title: "Jakie widzicie zagrożenia/ryzyka dla Waszego rozwiązania?",
    subtitle:
      "Opisz zdiagnozowane zagrożenia jak np. problemy technologiczne czy konieczność zaangażowania innych podmiotów np. urząd miasta",
    items: [
      {
        content:
          "Jak to każdy inny projekt moja aplikacja również wiąże się z kilkoma zagrożeniami/ryzykami, które mogą wpłynąć na życie. Brak zaangażowania użytkowników w długoterminową zmianę nawyków – Głównym celem aplikacji jest motywacja użytkowników do wprowadzenia trwałych zmian w ich codziennych nawykach, który będą miały realny wpływ na środowisko. Mimo wielu działających i spersonalizowanych funkcjonalnościach które stworzyłem znajdzie się grupa ludzi która nie będzie dostrzegała bezpośrednich korzyści z zmian w stylu życia, co może wpłynąć na rezygnacje z aplikacji lub nie będzie po prostu w stanie utrzymać nowych nawyków na dłuższą metę. Aby temu zapobiec konieczne będzie nieustanne dostosowywanie treści aplikacji.",
      },
      {
        content:
          "Kolejnym zagrożeniem jest skalowalnośc aplikacji – pomimo tego, że aplikacja została zaprojektowana z uzyciem nowoczesnych technologii zarządzanie dużą ilością danych oraz ilością użytkowników jest problemem z którym boryka się każda aplikacja. Dlatego problemy które trzeba będzie priorytetowo rozwiązać będzie: postawienie aplikacji na dedykowanym serwerze (aplikacja, baza danych, llm).",
      },
    ],
  },
  {
    title: "Dlaczego akurat Wy powinniście wygrać?",
    subtitle:
      "Napisz, co wyróżnia Wasz pomysł lub jego realizacja np. wybór innowacyjnej technologii.",
    items: [
      {
        content:
          "Reclimate jest rezultatem dużej ilości pracy oraz serca którą włożyłem w ten projekt. Tworzenie tej aplikacji nie polegało tylko na pisaniu kodu lecz także na zrozumieniu potrzeb użytkowniku i zbadaniu rynku.",
      },
      {
        content:
          "To, co wyróżnia moją aplikację na tle innych, to nie tylko innowacyjne podejście do monitorowania i redukcji śladu węglowego, ale również sposób, w jaki użytkownicy są angażowani w proces zmiany nawyków. Reclimate to nie tylko narzędzie edukacyjne, ale jest to też aplikacja, która rzeczywiście motywuje do poedjmowania realnych proekologicznych działań zmieniając codzienne nawyki. Dodatkowo zastosowanie sztucznej inteligencji sprawia, że aplikacja jest bardziej efektywna niż inne rozwiązania, dostarczając spersonalizowane porady czy dostosowując pytania do użytkownika.",
      },
      {
        content:
          "Patrząc na produkt końcowy projektu uważam, że projekt ma ogromny potencjał - dzięki otwartości na poszerzanie aplikacji o nowe funkcjonalności jak i współprace z innymi organizacjami, można stworzyć platformę, która będzie nie tylko narzędziem do obliczania śladu węglowego, ale również aktywnie wspierać inicjatywy na rzecz ochrony środowiska. ",
      },
      {
        content:
          "Dlatego właśnie uważam, że Reclimate zasługuje na wygraną - zarówno za innowacyjność, jak i potencjał do rozwoju i wprowadzenia realnych zmian w życiu wielu ludzi.	",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-y-auto gap-24 px-4 lg:px-64 scroll-smooth">
      <Navbar />

      <div className="flex flex-col items-center w-full text-center mt-[150px]">
        <p className="text-sm text-muted-foreground font-semibold">
          O Projekcie
        </p>
        <h2 className="text-4xl font-semibold pb-2">Reclimate</h2>

        <div className="flex flex-col gap-4 text-left w-full">
          <ul className="list-decimal marker:font-semibold marker:text-xl space-y-8 ml-4">
            {questions.map((question, index) => (
              <li className="space-y-2" key={`li${index}`}>
                <h2 className="text-xl font-semibold">{question.title}</h2>
                {question.subtitle && (
                  <p className="italic text-muted-foreground">
                    {question.subtitle}
                  </p>
                )}
                {question.items && (
                  <div className="w-full space-y-4">
                    {question.items.map((questionitem, index) => (
                      <div className="w-full" key={`d${index}`}>
                        <span>{questionitem.content}</span>
                        {questionitem.child && questionitem.child}
                        {questionitem.items && (
                          <ul className="list-disc ml-4 space-y-2">
                            {questionitem.items.map((item, index) => (
                              <li key={`item${index}`}>
                                <span>
                                  {item.title && (
                                    <span className="font-semibold">
                                      {item.title}
                                      {" - "}
                                    </span>
                                  )}
                                  {item.content}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
