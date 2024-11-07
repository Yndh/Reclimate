export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  surveys: Survey[];
  challenges: Challenge[];
  points: number;
  carbonFootprint?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface Survey {
  id: string;
  userId: string;
  user: User;
  responses: Response[];
  carbonFootprint?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: string;
  surveyId: string;
  survey: Survey;
  question: String;
  answers: Answer[];
  answer?: Answer;

  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: string;
  responseId: string;
  response: Response;
  answer: string;
  selectedInId: string;
  selectedIn: Response;

  createdAt: Date;
  updatedAt: Date;
}

export interface Challenge {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  startDate: Date;
  endDate: Date;

  createdAt: Date;
  updatedAt: Date;
}
