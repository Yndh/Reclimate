"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import React, { SetStateAction, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Option, Question, SurveyAnswer } from "@/app/new-user/page";
import { toast } from "@/hooks/use-toast";

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

  const handleAnswerSelection = useCallback(
    (option: Option) => {
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
    },
    [questions, questionIndex, setAnswers]
  );

  const incrementQuestionIndex = useCallback(() => {
    const currentQuestionId = questions[questionIndex].id;
    const hasAnswered = answers.some((ans) => ans.id === currentQuestionId);

    if (!hasAnswered) {
      toast({
        variant: "destructive",
        description: "Wybierz odpowiedź zanim przejdziesz dalej",
        duration: 2000,
      });
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      onFinish();
    }
  }, [questionIndex, answers, onFinish, questions]);

  const decrementQuestionIndex = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
    }
  }, [questionIndex]);

  const progressValue = questionIndex + 1;
  const maxProgress = questions.length;
  const showBackButton = questionIndex > 0;
  const nextButtonText =
    questionIndex === questions.length - 1 ? "Zakończ" : "Następne";

  return (
    <Card className="w-full h-fit md:min-h-1/2 md:w-1/2">
      <CardHeader>
        <CardTitle>Pytanie {questionIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center text-center gap-2">
        <Progress max={maxProgress} value={progressValue} />
        <CardTitle className="text-xl mt-4">
          {questions[questionIndex]?.question}
        </CardTitle>
        {questions[questionIndex]?.options.map((option) => (
          <label
            key={option.id}
            htmlFor={`answer-${option.id}-${questionIndex}`}
            className="w-full"
          >
            <input
              type="radio"
              id={`answer-${option.id}-${questionIndex}`}
              name="survey"
              className="peer hidden"
              onChange={() => handleAnswerSelection(option)}
              checked={answers.some(
                (ans) =>
                  ans.id === questions[questionIndex].id &&
                  ans.option.id === option.id
              )}
            />
            <div className="border border-input peer-checked:bg-chart-1 w-full p-2 transition duration-300 rounded-md cursor-pointer">
              {option.option}
            </div>
          </label>
        ))}

        <div className="flex justify-between mt-10 w-full">
          {showBackButton && (
            <Button onClick={decrementQuestionIndex} className="w-full mr-2">
              Wróć
            </Button>
          )}
          <Button className="w-full" onClick={incrementQuestionIndex}>
            {nextButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
