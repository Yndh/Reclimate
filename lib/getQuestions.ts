import { questions } from "./questions";

interface Question {
  id?: string;
  question: string;
  options: Option[];
}

interface Option {
  id?: string;
  option: string;
}

export const getQuestions = (n: number): Question[] => {
  if (n > questions.length) {
    throw new Error("n cant be higher than number of questions");
  }

  const shuffled = questions.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
};
