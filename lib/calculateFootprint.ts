import { OpenAi } from "./openai";

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
    const response = await OpenAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Na podstawie poniższych odpowiedzi na pytania, ocen roczny slad weglowy i daj kilka porad.",
        },
        { role: "user", content: JSON.stringify(answers) },
      ],
      temperature: 1,
      max_completion_tokens: 250,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "footprint_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              footprint: {
                type: "number",
                description:
                  "A numeric representation of the footprint in tons.",
              },
              tips: {
                type: "array",
                description: "An array of tips related to the footprint.",
                items: {
                  type: "string",
                },
              },
            },
            required: ["footprint", "tips"],
            additionalProperties: false,
          },
        },
      },
    });

    const res = JSON.parse(response.choices[0].message.content as string);

    return {
      footprint: res.footprint ?? 0,
      tips: res.tips || [],
    };
  } catch (err) {
    console.error(`Error calculating footprint: ${err}`);

    return {
      footprint: 0,
      tips: [],
    };
  }
};
