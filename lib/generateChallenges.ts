import OpenAI from "openai";

interface ChallengeAi {
  title: string;
  description: string;
  points: number;
}

export const generateChallenges = async (): Promise<ChallengeAi[]> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Stwórz trzy proste tygodniowe eco-friendly zadania zmniejszające ślad węglowy, z punktami od 100 do 400 według trudności lub wpływu",
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
