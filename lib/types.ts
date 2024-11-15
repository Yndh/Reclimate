export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  surveys: Survey[];
  challenges: Challenge[];
  chats: Chat[];
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
  tips: Tip[];
  carbonFootprint?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: string;
  surveyId: string;
  survey: Survey;
  question: string;
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

export interface Tip {
  id: string;
  surveyId: string;
  survey: Survey;
  description: string;

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

export interface Chat {
  id: string;
  userId: string;
  user: User;
  messages: Message[];

  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  chat: Chat;
  text: string;
  tokens: number;
  sender: Sender;

  createdAt: Date;
  updatedAt: Date;
}

export enum Sender {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}
