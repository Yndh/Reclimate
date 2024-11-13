import { auth } from "@/lib/auth";
import { generateChallenges } from "@/lib/generateChallenges";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function mGET(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "The user is not authenticated" }),
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

      console.log(`Deleted ${emptyChats.length} empty chats.`);
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
      JSON.stringify({ error: `Failed to get user chats` }),
      {
        status: 500,
      }
    );
  }
}
