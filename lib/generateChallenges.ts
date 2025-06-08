import { OpenAi } from "./openai";

interface ChallengeAi {
  title: string;
  description: string;
  points: number;
}

export const generateChallenges = async (): Promise<ChallengeAi[]> => {
  try {
    const response = await OpenAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Wymyśl trzy unikalne, tygodniowe wyzwania w duchu eko (eco-friendly), które pomagają zmniejszyć ślad węglowy. Każde zadanie powinno być konkretne i praktyczne, dostosowane do codziennego życia (np. jedzenie, transport, zakupy, energia, odpady, edukacja). Dodaj do każdego punktację od 100 do 400 w zależności od stopnia trudności lub wpływu na środowisko. Unikaj powtórzeń i schematów — każde wyzwanie ma być nieco inne niż standardowe „nie używaj plastiku” czy „oszczędzaj wodę”. Inspiruj się realnymi problemami klimatycznymi, sezonowością, lokalnymi działaniami i codziennymi nawykami. Dodaj krótką nazwę lub hasło dla każdego wyzwania, np. „Tydzień bez mięsa” albo „Zielony transport.",
        },
      ],
      temperature: 1,
      max_completion_tokens: 350,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "eco_friendly_tasks",
          strict: true,
          schema: {
            type: "object",
            properties: {
              tasks: {
                type: "array",
                description:
                  "Lista trzech ekologicznych zadań, które można wykonać w prawdziwym życiu i pomoga zmniejszyc ślad węglowy.",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Krótki tytuł",
                    },
                    description: {
                      type: "string",
                      description: "Opis zadania",
                    },
                    points: {
                      type: "number",
                      description:
                        "Punkty przypisane do zadania na podstawie jego trudności lub wpływu.",
                    },
                  },
                  required: ["title", "description", "points"],
                  additionalProperties: false,
                },
              },
            },
            required: ["tasks"],
            additionalProperties: false,
          },
        },
      },
    });

    const res = JSON.parse(response.choices[0].message.content as string);

    if (!res.tasks) {
      throw new Error("No challenges in resposne");
    }

    return res.tasks;
  } catch (err) {
    console.error(`Error generating challenges: ${err}`);

    throw new Error(`Error generating challenges`);
  }
};
