import { createQuestionId } from "../../domain/value-objects/questionId.ts";
import type { Question } from "../../domain/entities/question.ts";

// This file is responsible for converting between DTO and Entity

export type QuestionDTO = {
  id: string;
  sentence: string;
  choices: {
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
};

export const QuestionMapper = {
  toEntity: (dto: QuestionDTO): Question => {
    // The logic from the old reconstructQuestion function was moved here.
    return {
      id: createQuestionId(dto.id),
      sentence: dto.sentence,
      choices: dto.choices,
    };
  },
};
