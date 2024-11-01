"use client";

import { Answer, Survey } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { SetStateAction, useState } from "react";
import { Button } from "./ui/button";

interface AppSurveyProps {
  survey: Survey;
  answers: Answer[];
  setAnswers: React.Dispatch<SetStateAction<Answer[]>>;
  onFinish: () => void;
}

export default function AppSurvey({
  survey,
  answers,
  setAnswers,
  onFinish,
}: AppSurveyProps) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleAnswerSelection = (answer: Answer) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = answer;
      return updatedAnswers;
    });

    console.log(answers);
  };

  const incrementQuestionIndex = () => {
    if (questionIndex < survey.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      onFinish();
    }
  };

  const decrementQuestionIndex = () => {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
  };

  return (
    <Card className="w-1/2 h-1/2">
      <CardHeader>
        <CardTitle>Pytanie {questionIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center text-center gap-2">
        <Progress max={survey.questions.length} value={questionIndex + 1} />
        <CardTitle className="text-xl mt-4">
          {survey.questions[questionIndex].question}
        </CardTitle>

        {survey.questions[questionIndex].answers.map((answer, index) => (
          <label
            key={index}
            htmlFor={`answer${index}i${questionIndex}`}
            className="w-full"
          >
            <input
              type="radio"
              id={`answer${index}i${questionIndex}`}
              name="survey"
              className="peer hidden"
              onChange={() => handleAnswerSelection(answer)}
              checked={answers.some((ans) => ans.id === answer.id)}
            />
            <div className="border border-input peer-checked:bg-green-500 w-full p-2 transition duration-300 rounded-md cursor-pointer">
              {answer.value}
            </div>
          </label>
        ))}

        <div className="flex justify-between mt-10 w-full">
          {questionIndex > 0 && (
            <Button onClick={decrementQuestionIndex} className="w-full mr-2">
              Wróć
            </Button>
          )}
          <Button className="w-full" onClick={incrementQuestionIndex}>
            {questionIndex === survey.questions.length - 1
              ? "Zakończ"
              : "Następne"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
