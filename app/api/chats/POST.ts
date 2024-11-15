import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function mPOST(req: NextRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "Użytkownik nie jest zalogowany" }),
      {
        status: 401,
      }
    );
  }

  try {
    const chat = await prisma.chat.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        messages: true,
        user: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        chat: chat,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(`Error creating chat: ${err}`);
    return new NextResponse(
      JSON.stringify({
        error: `Wystąpił błąd w trakcie tworzenia czatu. Spróbuj ponownie później`,
      }),
      {
        status: 500,
      }
    );
  }
}
