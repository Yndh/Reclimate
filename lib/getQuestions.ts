import { OpenAi } from "./openai";

interface Question {
  id?: string;
  question: string;
  options: Option[];
}

interface Option {
  id?: string;
  option: string;
}

export interface SurveyAnswers {
  question: string;
  selectedAnswer: string;
}

export const getQuestions = async (
  lastSurvey: SurveyAnswers[]
): Promise<Question[]> => {
  try {
    const response = await OpenAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "Na podstawie poniższych odpowiedzi udzielonych w poprzedniej ankiecie wygeneruj 10 dodatkowych, uzupełniających pytań, które pomogą dokładniej oszacować roczny ślad węglowy użytkownika. Każde pytanie powinno: odnosić się do obszarów, które wynikają z wcześniejszych odpowiedzi i wymagają doprecyzowania, dotyczyć takich tematów jak transport, energia, jedzenie, zakupy czy inne aspekty stylu życia, zawierać 4 opcje odpowiedzi, zróżnicowane pod względem wpływu na emisję CO₂ (od najniższego do najwyższego), być sformułowane w prosty, przyjazny sposób, bez technicznego języka.",
            },
          ],
        },
        {
          role: "user",
          content: JSON.stringify(lastSurvey),
        },
      ],
      temperature: 1,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "multiple_questions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                description: "A list of multiple choice questions.",
                items: {
                  type: "object",
                  properties: {
                    question: {
                      type: "string",
                      description: "The text of the question.",
                    },
                    options: {
                      type: "array",
                      description: "The available options for each question.",
                      items: {
                        type: "object",
                        properties: {
                          option: {
                            type: "string",
                            description:
                              "A possible answer option for the question.",
                          },
                        },
                        required: ["option"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["question", "options"],
                  additionalProperties: false,
                },
              },
            },
            required: ["questions"],
            additionalProperties: false,
          },
        },
      },
    });

    const res = JSON.parse(response.choices[0].message.content as string);

    return res.questions;
  } catch (err) {
    console.error(`Error calculating footprint: ${err}`);
    return [];
  }
};
