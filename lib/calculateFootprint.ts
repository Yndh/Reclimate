import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

interface SurveyAnswers {
  question: string;
  selectedAnswer: string;
}

interface FootprintResponse {
  footprint: number;
  tips: string[];
}

export const calculateFootprint = async (
  answers: SurveyAnswers[]
): Promise<FootprintResponse> => {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema: z.object({
        footprint: z
          .number()
          .describe("A numeric representation of the footprint in tons."),
        tips: z
          .array(z.string())
          .describe("An array of tips related to the footprint."),
      }),
      messages: [
        {
          role: "system",
          content:
            "Na podstawie poniższych odpowiedzi oceń szacunkowy roczny ślad węglowy użytkownika (w tonach CO₂) oraz zaproponuj 3-5 praktycznych porad, jak może go zmniejszyć. Uwzględnij najważniejsze obszary wpływu (transport, jedzenie, energia itp.) i podaj wskazówki dopasowane do stylu życia przedstawionego w odpowiedziach.",
        },
        {
          role: "user",
          content: JSON.stringify(answers),
        },
      ],
    });

    return {
      footprint: object.footprint ?? 0,
      tips: object.tips || [],
    };
  } catch (err) {
    console.error(`Error calculating footprint: ${err}`);

    return {
      footprint: 0,
      tips: [],
    };
  }
};
