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
      JSON.stringify({ error: "Użytkownik nie jest zalogowany.=" }),
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
  try {
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId: session.user.id },
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

    return new NextResponse(
      JSON.stringify({
        chat: chat,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(`Error getting chat: ${err}`);
    return new NextResponse(
      JSON.stringify({
        error:
          "Wystąpił błąd w trakcie znajdywania czatu. Spróbuj ponownie później",
      }),
      {
        status: 500,
      }
    );
  }
}
