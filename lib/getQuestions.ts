import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

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
    const { object } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema: z.object({
        questions: z
          .array(
            z.object({
              question: z.string().describe("The text of the question."),
              options: z
                .array(
                  z.object({
                    option: z
                      .string()
                      .describe("A possible answer option for the question."),
                  })
                )
                .describe("The available options for each question."),
            })
          )
          .describe("A list of multiple choice questions."),
      }),
      system:
        "Na podstawie poniższych odpowiedzi udzielonych w poprzedniej ankiecie wygeneruj 10 dodatkowych, uzupełniających pytań, które pomogą dokładniej oszacować roczny ślad węglowy użytkownika. Każde pytanie powinno: odnosić się do obszarów, które wynikają z wcześniejszych odpowiedzi i wymagają doprecyzowania, dotyczyć takich tematów jak transport, energia, jedzenie, zakupy czy inne aspekty stylu życia, zawierać 4 opcje odpowiedzi, zróżnicowane pod względem wpływu na emisję CO₂ (od najniższego do najwyższego), być sformułowane w prosty, przyjazny sposób, bez technicznego języka.",
      prompt: JSON.stringify(lastSurvey),
      temperature: 1,
    });

    return object.questions;
  } catch (err) {
    console.error(`Error calculating footprint: ${err}`);
    return [];
  }
};
