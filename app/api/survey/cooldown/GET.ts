import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Survey } from "@/lib/types";
import { error } from "console";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

interface Question {
  id?: string;
  question: string;
  options: Option[];
}

interface Option {
  id?: string;
  option: string;
}

const SURVEY_COOLDOWN = (process.env.SURVEY_COOLDOWN ?? 0) as number; // hours

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
    const survey = await prisma.survey.findFirst({
      where: { userId: session.user.id },
      include: {
        responses: {
          include: {
            answers: true,
          },
        },
        user: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (survey) {
      const surveyUpdatedAt = new Date(survey.updatedAt);
      const refreshTime = new Date(
        surveyUpdatedAt.getTime() + SURVEY_COOLDOWN * 60 * 60 * 1000
      );

      if (Date.now() < refreshTime.getTime()) {
        return new NextResponse(
          JSON.stringify({
            message: `A survey was created less than ${SURVEY_COOLDOWN} hours ago `,
            refreshTime: refreshTime.toISOString(),
          }),
          {
            status: 200,
          }
        );
      }
    }

    return new NextResponse(
      JSON.stringify({
        message: "You can create a new survey",
        available: true,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error:", e);
    return new NextResponse(JSON.stringify({ error: `Server error` }), {
      status: 500,
    });
  }
}
