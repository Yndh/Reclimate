export type Survey = {
  id: number;
  questions: Quesiton[];
  date: Date;
};

export type Quesiton = {
  id: number;
  question: string;
  answers: Answer[];
  selectedAnswer?: Answer;
};

export type Answer = {
  id: number;
  value: string;
};
