import type { IQuestionRepository } from "../../domain/interface/IQuestionRepository.ts";
import { type Question } from "../../domain/entities/question.ts";
import type { QuestionId } from "../../domain/value-objects/questionId.ts";
import { type QuestionDTO, QuestionMapper } from "./QuestionMapper.ts";

const questionsData: QuestionDTO[] = [
  {
    id: "q1",
    sentence: "The new marketing campaign has been _______ successful.",
    choices: [
      { label: "A", text: "remarkably", isCorrect: true },
      { label: "B", text: "remarked", isCorrect: false },
      { label: "C", text: "remarkable", isCorrect: false },
      { label: "D", text: "remarking", isCorrect: false },
    ],
  },
  {
    id: "q2",
    sentence:
      "All employees must wear their identification badges _______ all times.",
    choices: [
      { label: "A", text: "at", isCorrect: true },
      { label: "B", text: "in", isCorrect: false },
      { label: "C", text: "on", isCorrect: false },
      { label: "D", text: "by", isCorrect: false },
    ],
  },
];

export const createMockQuestionRepository = (): IQuestionRepository => {
  return {
    // deno-lint-ignore require-await
    findById: async (id: QuestionId): Promise<Question | null> => {
      const questionData = questionsData.find((q) => q.id === id);

      if (!questionData) {
        return null;
      }
      return QuestionMapper.toEntity(questionData);
    },
  };
};
