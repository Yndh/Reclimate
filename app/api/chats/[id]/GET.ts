import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

interface ResponseInterface<T = any> extends NextApiResponse<T> {
  params: {
    id: string;
  };
}

export async function mGET(req: Request, res: ResponseInterface) {
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
    where: { id: chatId, userId: session.user.id },
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

  return new NextResponse(
    JSON.stringify({
      chat: chat,
    }),
    {
      status: 200,
    }
  );
}
