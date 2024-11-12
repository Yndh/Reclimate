import { SurveyAnswer } from "@/app/new-user/page";
import { answerQuestion } from "@/lib/answerQuestion";
import { auth } from "@/lib/auth";
import { calculateFootprint } from "@/lib/calculateFootprint";
import { prisma } from "@/lib/prisma";
import { Sender } from "@/lib/types";
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
        text: answer,
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
