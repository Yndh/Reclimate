import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function mGET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        points: "asc",
      },
      select: {
        name: true,
        points: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        users: users,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(`Error getting user data: ${err}`);
  }
}
