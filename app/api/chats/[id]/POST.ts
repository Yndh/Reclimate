import { SurveyAnswer } from "@/app/new-user/page";
import { AiMessage, answerQuestion } from "@/lib/answerQuestion";
import { auth } from "@/lib/auth";
import { calculateFootprint } from "@/lib/calculateFootprint";
import { prisma } from "@/lib/prisma";
import { Sender } from "@/lib/types";
import { error } from "console";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

interface ResponseInterface<T = any> extends NextApiResponse<T> {
  params: {
    id: string;
  };
}

interface SendMessageReqBody {
  message: string;
}

const TOKENS_LIMIT = (process.env.DAILY_TOKENS_LIMIT ?? 0) as number;

export async function mPOST(req: Request, res: ResponseInterface) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "Użytkownik nie jest zalogowany" }),
      {
        status: 401,
      }
    );
  }

  const chatId = res.params.id;
  if (!chatId) {
    return new NextResponse(
      JSON.stringify({ error: "Nie podano id w parametrach adresu url" }),
      {
        status: 400,
      }
    );
  }
  const chat = await prisma.chat.findFirst({
    where: { id: chatId },
    include: {
      messages: true,
      user: true,
    },
  });

  if (!chat) {
    return new NextResponse(
      JSON.stringify({ error: "Ten czat nie istnieje" }),
      {
        status: 400,
      }
    );
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const messages = await prisma.message.findMany({
    where: {
      chat: {
        userId: session.user.id,
      },
      updatedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const totalTokens = messages.reduce(
    (sum, message) => (sum += message.tokens || 0),
    0
  );

  if (totalTokens > TOKENS_LIMIT) {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    return new NextResponse(
      JSON.stringify({
        error: "Przekroczyłeś dzienny limit asystenta",
        refreshTime: nextDay.toISOString(),
      }),
      {
        status: 429,
      }
    );
  }

  const body: SendMessageReqBody = await req.json();
  const { message } = body;

  if (message.trim().length > 400) {
    return new NextResponse(
      JSON.stringify({
        error: "Długość wiadomości przekracza limit 400 znaków",
      }),
      { status: 400 }
    );
  }

  try {
    const chatHistory: AiMessage[] = chat.messages
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((message) => ({
        role: message.sender === Sender.USER ? "user" : "assistant",
        content: message.text,
      }));

    const updatedChatHistory: AiMessage[] = [
      ...chatHistory,
      { role: "user", content: message },
    ];

    const { message: answer, output_tokens } = await answerQuestion(
      updatedChatHistory
    );

    console.log(answer);

    const newMessage = await prisma.message.create({
      data: {
        text: message,
        tokens: 0,
        chat: {
          connect: {
            id: chatId,
          },
        },
        sender: Sender.USER,
      },
    });

    const aiMessage = await prisma.message.create({
      data: {
        text: answer.replace(/\n+/g, "\\n"),
        tokens: output_tokens,
        chat: {
          connect: {
            id: chatId,
          },
        },
        sender: Sender.ASSISTANT,
      },
      include: {
        chat: {
          include: {
            user: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: aiMessage,
      })
    );
  } catch (err) {
    console.error(`Error generating answer: ${err}`);
    return new NextResponse(
      JSON.stringify({
        error: `Wystąpił błąd w trakcie generowania odpowiedzi. Spróbuj ponownie później`,
      }),
      {
        status: 500,
      }
    );
  }
}
