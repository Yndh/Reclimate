import { SurveyAnswer } from "@/app/new-user/page";
import { auth } from "@/lib/auth";
import { calculateFootprint } from "@/lib/calculateFootprint";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

interface ResponseInterface<T = any> extends NextApiResponse<T> {
  params: {
    id: string;
  };
}

export async function mPOST(req: Request, res: ResponseInterface) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "Użytkownik nie jest zalogowany" }),
      {
        status: 401,
      }
    );
  }

  const challengeId = res.params.id;
  if (!challengeId) {
    return new NextResponse(
      JSON.stringify({ error: "Nie podano id w parametrach adresu url" }),
      {
        status: 400,
      }
    );
  }
  const challenge = await prisma.challenge.findFirst({
    where: { id: challengeId },
    include: {
      user: true,
    },
  });

  if (!challenge) {
    return new NextResponse(
      JSON.stringify({ error: "Te wyzwanie nie istnieje" }),
      {
        status: 400,
      }
    );
  }

  if (challenge.isCompleted) {
    return new NextResponse(
      JSON.stringify({ error: "Nie możesz aktualizować tego wyzwania" }),
      {
        status: 403,
      }
    );
  }

  const now = new Date();
  const target = new Date(challenge.endDate);
  const timeLeft = target.getTime() - now.getTime();

  if (timeLeft <= 0) {
    return new NextResponse(
      JSON.stringify({
        error: "Nie możesz aktualizować tego wyzwania",
      }),
      {
        status: 403,
      }
    );
  }

  const completeDate = new Date(target.getTime() - 1 * 24 * 60 * 60 * 1000);
  const completeTimeLeft = completeDate.getTime() - now.getTime();
  if (completeTimeLeft > 0) {
    return new NextResponse(
      JSON.stringify({
        error: "Nie możesz jeszcze zaaktualizować tego wydarzenia",
      }),
      {
        status: 403,
      }
    );
  }

  try {
    const updatedChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        isCompleted: true,
        user: {
          update: {
            data: {
              points: {
                increment: challenge.points,
              },
            },
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        challenge: updatedChallenge,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error(`Error updating challenge: ${err}`);
    return new NextResponse(
      JSON.stringify({
        error: `Wystapił błąd w trakcie aktualizowania wyzwania. Spróbuj ponownie później`,
      }),
      {
        status: 500,
      }
    );
  }
}
