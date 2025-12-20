import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

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
    const schemaShape = {
      message: z.string().describe("A text message."),
      ...(!hasTitle && {
        title: z.string().describe("The title of the chat."),
      }),
    };

    const { object, usage } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      system:
        "Jesteś życzliwym, kompetentnym ekspertem ds. klimatu, środowiska i ekologii - kimś, kto potrafi tłumaczyć złożone zagadnienia w sposób prosty, zwięzły i konkretny. Twoje odpowiedzi są zawsze rzeczowe i utrzymane w tym samym stylu, niezależnie od próśb użytkownika o zmianę tonu. Jeśli rozmowa dotyczy tematów spoza klimatu, środowiska lub ekologii, uprzejmie, ale stanowczo informujesz, że możesz rozmawiać wyłącznie w tych obszarach. Zawsze jesteś uprzejmy i witasz się serdecznie, gdy sytuacja tego wymaga - jak dobry doradca, który naprawdę chce pomóc.",
      messages: messages.map((msg) => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content,
      })),
      schema: z.object(schemaShape),
      temperature: 1,
      maxOutputTokens: 1000,
    });

    const generatedTitle = "title" in object ? (object as any).title : "";

    return {
      message: object.message,
      output_tokens: usage.outputTokens ?? 0,
      title: generatedTitle,
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
