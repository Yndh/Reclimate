"use client";

import { Answer, Survey } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Option, Question, SurveyAnswer } from "@/app/new-user/page";

interface AppSurveyProps {
  questions: Question[];
  answers: SurveyAnswer[];
  setAnswers: React.Dispatch<SetStateAction<SurveyAnswer[]>>;
  onFinish: () => void;
}

export default function AppSurvey({
  questions,
  answers,
  setAnswers,
  onFinish,
}: AppSurveyProps) {
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleAnswerSelection = (option: Option) => {
    setAnswers((prevAnswers) => {
      const currentQuestionId = questions[questionIndex].id;

      const existingAnswerIndex = prevAnswers.findIndex(
        (ans) => ans.id === currentQuestionId
      );

      const newAnswer: SurveyAnswer = {
        id: currentQuestionId,
        option: option,
      };

      const updatedAnswers = [...prevAnswers];

      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }

      return updatedAnswers;
    });

    console.log(answers);
  };

  const incrementQuestionIndex = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      onFinish();
    }
  };

  const decrementQuestionIndex = () => {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
  };

  return (
    <Card className="w-full h-fit md:h-1/2 md:w-1/2">
      <CardHeader>
        <CardTitle>Pytanie {questionIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center text-center gap-2">
        <Progress max={questions.length} value={questionIndex + 1} />
        <CardTitle className="text-xl mt-4">
          {questions[questionIndex].question}
        </CardTitle>

        {questions[questionIndex].options.map((option, index) => (
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
              onChange={() => handleAnswerSelection(option)}
              checked={answers.some((ans) => ans.option.id == option.id)}
            />
            <div className="border border-input peer-checked:bg-chart-1 w-full p-2 transition duration-300 rounded-md cursor-pointer">
              {option.option}
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
            {questionIndex === questions.length - 1 ? "Zakończ" : "Następne"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
