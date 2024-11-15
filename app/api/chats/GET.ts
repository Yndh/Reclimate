import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function mGET(req: NextRequest, res: NextApiResponse) {
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
    const emptyChats = await prisma.chat.findMany({
      where: {
        messages: {
          none: {},
        },
      },
    });

    if (emptyChats) {
      for (const chat of emptyChats) {
        await prisma.chat.delete({
          where: { id: chat.id },
        });
      }

      console.log(`Deleted ${emptyChats.length} empty chats`);
    }
  } catch (err) {
    console.error(`Error cleaning up empty chats: ${err}`);
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userId: session.user.id },
    });

    return new NextResponse(
      JSON.stringify({
        chats: chats,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error getting user chats");
    return new NextResponse(
      JSON.stringify({
        error: `Wystąpił błąd w trakcie pobierania czatów. Spróbuj ponownie później`,
      }),
      {
        status: 500,
      }
    );
  }
}
