import { SurveyAnswer } from "@/app/new-user/page";
import { answerQuestion } from "@/lib/answerQuestion";
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
      JSON.stringify({ error: "The user is not authenticated" }),
      {
        status: 401,
      }
    );
  }

  const chatId = res.params.id;
  if (!chatId) {
    return new NextResponse(
      JSON.stringify({ error: "No id is provided in the URL parameters." }),
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
    return new NextResponse(JSON.stringify({ error: "Chat doesnt exist" }), {
      status: 400,
    });
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
  console.log(`${session.user.id} used ${totalTokens} output tokens today`);
  if (totalTokens > TOKENS_LIMIT) {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    return new NextResponse(
      JSON.stringify({
        error: "You must wait for the cooldown period to use assistant",
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
        error: "Message length exceeds the 400 character limit.",
      }),
      { status: 400 }
    );
  }

  try {
    const { message: answer, output_tokens } = await answerQuestion(message);

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
  } catch (e) {
    console.error("Error submiting survey:", e);
    return new NextResponse(
      JSON.stringify({ error: `Failed to update survey` }),
      {
        status: 500,
      }
    );
  }
}
