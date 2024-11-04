import { auth } from "@/lib/auth";
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
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: {
        challenges: true,
        surveys: {
          where: {
            carbonFootprint: { not: null },
          },
          include: {
            responses: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        user: user,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(`Error getting user data: ${err}`);
  }
}
