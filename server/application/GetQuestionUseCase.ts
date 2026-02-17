import type { IQuestionRepository } from "../domain/interface/IQuestionRepository.ts";
import type { QuestionId } from "../domain/value-objects/questionId.ts";
import type { Question } from "../domain/entities/question.ts";

/**
 * A public-facing representation of a choice (without the answer).
 */
export type PublicChoice = {
  readonly label: string;
  readonly text: string;
};

/**
 * A public-facing representation of a question.
 */
export type GetQuestionResult = {
  readonly id: QuestionId;
  readonly sentence: string;
  readonly choices: readonly PublicChoice[];
};

export type GetQuestionUseCase = (
  id: QuestionId,
) => Promise<GetQuestionResult | null>;

const toGetQuestionResult = (question: Question): GetQuestionResult => {
  return {
    id: question.id,
    sentence: question.sentence,
    choices: question.choices.map(({ label, text }) => ({ label, text })),
  };
};

export const createGetQuestionUseCase = (
  repo: IQuestionRepository,
): GetQuestionUseCase => {
  return async (id: QuestionId) => {
    const question = await repo.findById(id);

    if (!question) {
      return null;
    }

    return toGetQuestionResult(question);
  };
};
