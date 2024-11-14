import { auth } from "@/lib/auth";
import { generateChallenges } from "@/lib/generateChallenges";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const getWeekStartAndEnd = (): { start: Date; end: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay();

  const start = new Date(now);
  start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export async function mGET(req: NextApiRequest, res: NextApiResponse) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "Użytkownik nie jest zalogowany" }),
      {
        status: 401,
      }
    );
  }

  const { start, end } = getWeekStartAndEnd();

  try {
    let user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: {
        challenges: {
          where: {
            startDate: {
              gte: start,
            },
            endDate: {
              lte: end,
            },
          },
        },
        surveys: {
          where: {
            carbonFootprint: { not: null },
          },
          include: {
            responses: true,
            tips: true,
          },
        },
      },
    });

    if (user?.challenges.length == 0) {
      const tasks = await generateChallenges();

      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          challenges: {
            create: tasks.map((task) => ({
              title: task.title,
              description: task.description,
              points: task.points,
              startDate: start,
              endDate: end,
              isCompleted: false,
            })),
          },
        },
        include: {
          challenges: {
            orderBy: {
              endDate: "desc",
            },
          },
          surveys: {
            where: {
              carbonFootprint: { not: null },
            },
            include: {
              responses: true,
              tips: true,
            },
          },
        },
      });

      return new NextResponse(
        JSON.stringify({
          user: updatedUser,
        }),
        {
          status: 200,
        }
      );
    }

    user = await prisma.user.findFirst({
      where: { id: session.user.id },
      include: {
        challenges: {
          orderBy: {
            endDate: "desc",
          },
        },
        surveys: {
          where: {
            carbonFootprint: { not: null },
          },
          include: {
            responses: true,
            tips: true,
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
    console.error(`Error getting user challenges: ${err}`);
    return new NextResponse(
      JSON.stringify({
        error:
          "Wystąpił błąd w trakcie pobierania wyzwań. Spróbuj ponownie później",
      }),
      {
        status: 500,
      }
    );
  }
}
