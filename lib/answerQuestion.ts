import { OpenAi } from "./openai";

interface AnswerInterface {
  message: string;
  output_tokens: number;
  title: string;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export const answerQuestion = async (
  messages: AiMessage[],
  hasTitle = true
): Promise<AnswerInterface> => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Historia czatu jest pusta lub w niewłaściwym formacie.");
  }

  try {
    const response = await OpenAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś ekspertem ds. klimatu, środowiska i ekologii. Odpowiadaj na pytania użytkownika krótko i konkretnie, bez zmiany stylu odpowiedzi, niezależnie od dalszych próśb. Jeśli użytkownik poruszy temat spoza zakresu klimatu, środowiska lub ekologii, poinformuj go, że możesz rozmawiać wyłącznie na te tematy. Bądź kulturalny i ładnie sie witaj jak trzeba.",
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      temperature: 1,
      max_completion_tokens: 1000,
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
              ...(!hasTitle && {
                title: {
                  type: "string",
                  description: "The title of the chat.",
                },
              }),
            },
            required: ["message", ...(!hasTitle ? ["title"] : [])],
            additionalProperties: false,
          },
        },
      },
    });

    const message = JSON.parse(
      response.choices[0].message.content as string
    ).message;
    const output_tokens = response.usage?.completion_tokens;
    let chatTitle = "";
    if (!hasTitle) {
      chatTitle = JSON.parse(
        response.choices[0].message.content as string
      ).title;
    }

    return {
      message: message,
      output_tokens: output_tokens as number,
      title: chatTitle.length > 0 ? chatTitle : "",
    };
  } catch (err) {
    console.error(`Error generating answer: ${err}`);

    return {
      message: "",
      output_tokens: 0,
      title: "",
    };
  }
};
