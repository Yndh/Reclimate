import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function mGET(req: NextRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        points: "desc",
      },
      select: {
        name: true,
        points: true,
        image: true,
        createdAt: true,
      },
      take: 50,
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
    return new NextResponse(
      JSON.stringify({
        error:
          "Wystąpił błąd w trakcie pobierania rankingu. Spróbuj ponownie później",
      }),
      {
        status: 500,
      }
    );
  }
}
