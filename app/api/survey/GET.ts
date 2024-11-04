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

    const questions: Question[] = [
      {
        question:
          "Jakie źródła energii są głównie używane w Twoim gospodarstwie domowym?",
        options: [
          { option: "Energia elektryczna" },
          { option: "Gaz" },
          { option: "Energia odnawialna" },
          { option: "Inne" },
        ],
      },
      {
        question: "Jak często korzystasz z samochodu?",
        options: [
          { option: "Codziennie" },
          { option: "Kilka razy w tygodniu" },
          { option: "Kilka razy w miesiącu" },
          { option: "Nie korzystam" },
        ],
      },
      {
        question:
          "Jak często spożywasz mięso i produkty pochodzenia zwierzęcego?",
        options: [
          { option: "Codziennie" },
          { option: "Kilka razy w tygodniu" },
          { option: "Kilka razy w miesiącu" },
          { option: "Nigdy" },
        ],
      },
      {
        question: "Czy segregujesz odpady?",
        options: [
          { option: "Tak, zawsze" },
          { option: "Tak, czasami" },
          { option: "Rzadko" },
          { option: "Nie segreguję" },
        ],
      },
      {
        question: "Jak często korzystasz z transportu publicznego?",
        options: [
          { option: "Codziennie" },
          { option: "Kilka razy w tygodniu" },
          { option: "Kilka razy w miesiącu" },
          { option: "Nigdy" },
        ],
      },
      {
        question: "Jakie jest Twoje podejście do zakupów?",
        options: [
          { option: "Kupuję wszystko nowe" },
          { option: "Kupuję używane rzeczy" },
          { option: "Preferuję lokalne produkty" },
          { option: "Nie mam zdania" },
        ],
      },
      {
        question: "Jak często korzystasz z urządzeń energooszczędnych?",
        options: [
          { option: "Zawsze" },
          { option: "Często" },
          { option: "Rzadko" },
          { option: "Nigdy" },
        ],
      },
      {
        question: "Jak często używasz jednorazowych plastikowych produktów?",
        options: [
          { option: "Codziennie" },
          { option: "Czasami" },
          { option: "Rzadko" },
          { option: "Nigdy" },
        ],
      },
      {
        question:
          "Ile litrów wody zużywasz dziennie podczas kąpieli/prysznica?",
        options: [
          { option: "Mniej niż 20 litrów" },
          { option: "20-50 litrów" },
          { option: "50-100 litrów" },
          { option: "Ponad 100 litrów" },
        ],
      },
      {
        question: "Jak często kupujesz nowe ubrania?",
        options: [
          { option: "Kilka razy w miesiącu" },
          { option: "Kilka razy w roku" },
          { option: "Raz w roku" },
          { option: "Rzadziej niż raz w roku" },
        ],
      },
    ];

    let newSurvey;
    if (!survey) {
      console.log("no survey");
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
      console.log("Survey left");
      newSurvey = survey;
    }

    questions.map((q) => {
      const questionResponse = newSurvey.responses.find(
        (res) => res.question === q.question
      );
      q.id = questionResponse?.id;

      if (questionResponse) {
        q.options.map((option) => {
          const answer = questionResponse.answers.find(
            (ans) => ans.answer === option.option
          );
          option.id = answer?.id;
          answer;
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
