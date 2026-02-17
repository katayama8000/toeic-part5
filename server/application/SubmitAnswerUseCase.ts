import { checkAnswer } from "../domain/entities/question.ts";
import type { IQuestionRepository } from "../domain/interface/IQuestionRepository.ts";
import type { QuestionId } from "../domain/value-objects/questionId.ts";

export type SubmitAnswerResult = {
  wasCorrect: boolean;
  correctAnswerLabel: string;
};

export type SubmitAnswerUseCase = (
  id: QuestionId,
  submittedLabel: string,
) => Promise<SubmitAnswerResult | null>;

export const createSubmitAnswerUseCase = (
  repo: IQuestionRepository,
): SubmitAnswerUseCase => {
  return async (id: QuestionId, submittedLabel: string) => {
    const question = await repo.findById(id);

    if (!question) {
      return null;
    }

    const wasCorrect = checkAnswer(question, submittedLabel);
    const correctChoice = question.choices.find((c) => c.isCorrect);

    if (!correctChoice) {
      // This should not happen if the domain entity is correctly constructed
      throw new Error("Correct answer not found for question " + id);
    }

    return {
      wasCorrect,
      correctAnswerLabel: correctChoice.label,
    };
  };
};
