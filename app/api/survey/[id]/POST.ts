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

interface SendSurveyReqBody {
  answers: SurveyAnswer[];
}

export async function mPOST(req: Request, res: ResponseInterface) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse(
      JSON.stringify({ error: "The user is not authenticated" }),
      {
        status: 401,
      }
    );
  }

  const surveyId = res.params.id;
  if (!surveyId) {
    return new NextResponse(
      JSON.stringify({ error: "No id is provided in the URL parameters." }),
      {
        status: 400,
      }
    );
  }
  const survey = await prisma.survey.findFirst({
    where: { id: surveyId },
    include: {
      responses: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!survey) {
    return new NextResponse(JSON.stringify({ error: "Survey doesnt exist" }), {
      status: 400,
    });
  }

  if ((survey.carbonFootprint ?? 0) > 0) {
    return new NextResponse(
      JSON.stringify({ error: "You can't edit this survey" }),
      {
        status: 403,
      }
    );
  }

  const body: SendSurveyReqBody = await req.json();
  const { answers } = body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid answers provided." }),
      {
        status: 400,
      }
    );
  }

  for (const answer of answers) {
    if (!answer.id || !answer.option || !answer.option.id) {
      return new NextResponse(
        JSON.stringify({ error: "All answers must have valid ids." }),
        {
          status: 400,
        }
      );
    }

    const response = survey.responses.find((resp) => resp.id == answer.id);
    if (!response) {
      return new NextResponse(
        JSON.stringify({
          error: `Response ID ${answer.id} does not correspond to any valid response in the survey.`,
        }),
        {
          status: 400,
        }
      );
    }
    const isValidOption = response.answers.find(
      (ans) => ans.id === answer.option.id
    );
    if (!isValidOption) {
      return new NextResponse(
        JSON.stringify({
          error: `Option ID ${answer.option.id} is not valid for response ID ${answer.id}.`,
        }),
        {
          status: 400,
        }
      );
    }
  }

  try {
    const surveyAnswers = survey.responses.map((response) => {
      const selectedAnswer = answers.find((ans) => ans.id === response.id);
      return {
        question: response.question as string,
        selectedAnswer: selectedAnswer?.option.option as string,
      };
    });

    const response = await calculateFootprint(surveyAnswers);
    // const response = {
    //   footprint: 3.5,
    //   tips: [],
    // };
    const { footprint, tips } = response;

    const updatedSurvey = await prisma.survey.update({
      where: { id: surveyId },
      data: {
        carbonFootprint: footprint, //temp
        responses: {
          update: answers.map((answer) => ({
            where: { id: answer.id },
            data: {
              answer: {
                connect: {
                  id: answer.option.id,
                },
              },
            },
          })),
        },
        tips: {
          create: tips.map((tip) => ({
            description: tip,
          })),
        },
      },
      include: {
        responses: {
          include: {
            answer: true,
          },
        },
        tips: true,
      },
    });

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        carbonFootprint: footprint,
      },
    });

    return new NextResponse(
      JSON.stringify({
        survey: updatedSurvey,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error submiting survey:", e);
    return new NextResponse(
      JSON.stringify({ error: `Failed to update survey` }),
      {
        status: 500,
      }
    );
  }
}
