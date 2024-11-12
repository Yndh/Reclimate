import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function mPOST(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "The user is not authenticated" }),
      {
        status: 401,
      }
    );
  }

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
}
