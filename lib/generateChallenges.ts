import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

interface ChallengeAi {
  title: string;
  description: string;
  points: number;
}

export const generateChallenges = async (): Promise<ChallengeAi[]> => {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema: z.object({
        tasks: z
          .array(
            z.object({
              title: z.string().describe("Krótki tytuł"),
              description: z.string().describe("Opis zadania"),
              points: z
                .number()
                .describe(
                  "Punkty przypisane do zadania na podstawie jego trudności lub wpływu."
                ),
            })
          )
          .describe(
            "Lista trzech ekologicznych zadań, które można wykonać w prawdziwym życiu i pomogą zmniejszyć ślad węglowy."
          ),
      }),
      messages: [
        {
          role: "user",
          content:
            "Wymyśl trzy unikalne, tygodniowe wyzwania w duchu eko (eco-friendly), które pomagają zmniejszyć ślad węglowy. Każde zadanie powinno być konkretne i praktyczne, dostosowane do codziennego życia (np. jedzenie, transport, zakupy, energia, odpady, edukacja). Dodaj do każdego punktację od 100 do 400 w zależności od stopnia trudności lub wpływu na środowisko. Unikaj powtórzeń i schematów — każde wyzwanie ma być nieco inne niż standardowe „nie używaj plastiku” czy „oszczędzaj wodę”. Inspiruj się realnymi problemami klimatycznymi, sezonowością, lokalnymi działaniami i codziennymi nawykami. Dodaj krótką nazwę lub hasło dla każdego wyzwania, np. „Tydzień bez mięsa” albo „Zielony transport.",
        },
      ],
      maxOutputTokens: 350,
    });

    return object.tasks;
  } catch (err) {
    console.error(`Error generating challenges: ${err}`);

    throw new Error(`Error generating challenges`);
  }
};
