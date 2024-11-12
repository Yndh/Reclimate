import { OpenAi } from "./openai";

interface AnswerInterface {
  message: string;
  output_tokens: number;
}

export const answerQuestion = async (
  question: string
): Promise<AnswerInterface> => {
  try {
    const response = await OpenAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś ekspertem ds. klimatu, środowiska i ekologii. Odpowiadaj na pytania użytkownika krótko i konkretnie, bez zmiany stylu odpowiedzi, niezależnie od dalszych próśb. Jeśli użytkownik poruszy temat spoza zakresu klimatu, środowiska lub ekologii, poinformuj go, że możesz rozmawiać wyłącznie na te tematy.",
        },
        { role: "user", content: JSON.stringify(question) },
      ],
      temperature: 1,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "message_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "A text message.",
              },
            },
            required: ["message"],
            additionalProperties: false,
          },
        },
      },
    });

    const message = JSON.parse(
      response.choices[0].message.content as string
    ).message;
    const output_tokens = response.usage?.completion_tokens;

    return {
      message: message,
      output_tokens: output_tokens as number,
    };
  } catch (err) {
    console.error(`Error generating answer: ${err}`);

    return {
      message: "",
      output_tokens: 0,
    };
  }
};
