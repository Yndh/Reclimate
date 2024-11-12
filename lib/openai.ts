import { OpenAI } from "openai";

const globalForOpenAI = globalThis as unknown as { OpenAi: OpenAI };

export const OpenAi =
  globalForOpenAI.OpenAi ||
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== "production") globalForOpenAI.OpenAi = OpenAi;
