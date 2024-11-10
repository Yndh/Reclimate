import { auth } from "@/lib/auth";
import { getQuestions } from "@/lib/getQuestions";
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
        createdAt: "desc",
      },
    });

    if (survey) {
      const surveyCreatedAt = new Date(survey.createdAt);
      const refreshTime = new Date(
        surveyCreatedAt.getTime() + SURVEY_COOLDOWN * 60 * 60 * 1000
      );

      if (Date.now() < refreshTime.getTime()) {
        return new NextResponse(
          JSON.stringify({
            error: "You need to wait to ",
            refreshTime: refreshTime.toISOString,
          }),
          {
            status: 429,
          }
        );
      }
    }

    let questions: Question[];
    let newSurvey;
    if (!survey || (survey.carbonFootprint ?? 0) > 0) {
      questions = getQuestions(10);

      newSurvey = await prisma.survey.create({
        data: {
          responses: {
            create: questions.map((q) => ({
              question: q.question,
              answers: {
                create: q.options.map((opt) => ({
                  answer: opt.option,
                })),
              },
            })),
          },
          user: {
            connect: { id: session.user.id },
          },
        },
        include: {
          responses: {
            include: {
              answers: true,
            },
          },
        },
      });
    } else {
      newSurvey = survey;
      questions = newSurvey.responses.map((response) => {
        const options: Option[] = response.answers.map((answer) => ({
          id: answer.id,
          option: answer.answer,
        }));

        return {
          id: response.id,
          question: response.question,
          options: options,
        };
      });
    }

    questions.forEach((q) => {
      const questionResponse = newSurvey.responses.find(
        (res) => res.question === q.question
      );
      q.id = questionResponse?.id;

      if (questionResponse) {
        q.options.forEach((option) => {
          const answer = questionResponse.answers.find(
            (ans) => ans.answer === option.option
          );
          option.id = answer?.id;
        });
      }
    });

    return new NextResponse(
      JSON.stringify({
        id: newSurvey.id,
        questions: questions,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error generating survey:", e);
    return new NextResponse(
      JSON.stringify({ error: `Failed generating survey` }),
      {
        status: 500,
      }
    );
  }
}
