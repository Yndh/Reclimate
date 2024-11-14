import { auth } from "@/lib/auth";
import { getQuestions, SurveyAnswers } from "@/lib/getQuestions";
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
      JSON.stringify({ error: "Użytkownik nie jest zalogowany" }),
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
            error: "Musisz poczekać zanim utworzysz następna ankietę",
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
      const lastSurvey = await prisma.survey.findFirst({
        where: {
          userId: session.user.id,
          carbonFootprint: {
            not: null,
          },
        },
        include: {
          responses: {
            include: {
              answer: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!lastSurvey) {
        return new NextResponse(
          JSON.stringify({
            error: "Nie masz dostępu do tej ankiety",
          }),
          {
            status: 405,
          }
        );
      }

      const sur: SurveyAnswers[] = lastSurvey.responses.map((res) => ({
        question: res.question as string,
        selectedAnswer: res.answer?.answer as string,
      }));

      questions = await getQuestions(sur);

      if (questions.length == 0) {
        return new NextResponse(
          JSON.stringify({
            error:
              "Wystąpił błąd w trakcie generowania ankiety. Spróbuj ponownie później",
          }),
          {
            status: 500,
          }
        );
      }

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
  } catch (err) {
    console.error(`Error generating survey ${err}:`);
    return new NextResponse(
      JSON.stringify({
        error: `Wystąpił błąd w trakcie generowania ankiety. Spróbuj ponownie później`,
      }),
      {
        status: 500,
      }
    );
  }
}
