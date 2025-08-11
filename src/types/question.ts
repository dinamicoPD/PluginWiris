// src/types/question.ts

export interface ClozeQuestion {
  id: number;
  type: 'cloze';
  question: string;
  expected: string;
  points: number;
  correctionMode: 'algebraic' | 'exact';
}

export interface MultichoiceOption {
  latex: string;
  correct: boolean;
}

export interface MultichoiceQuestion {
  id: number;
  type: 'multichoice';
  question: string;
  options: MultichoiceOption[];
  points: number;
}

export type Question = ClozeQuestion | MultichoiceQuestion;

export interface Bank {
  id: string;
  name: string;
  questions: Question[];
}
