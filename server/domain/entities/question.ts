import type { Choice } from "../value-objects/choice.ts";
import type { QuestionId } from "../value-objects/questionId.ts";

export type Question = {
  readonly id: QuestionId;
  readonly sentence: string;
  readonly choices: readonly Choice[];
};

export const checkAnswer = (
  question: Question,
  submittedLabel: string,
): boolean => {
  const submittedChoice = question.choices.find((c) =>
    c.label === submittedLabel
  );
  if (!submittedChoice) {
    return false;
  }
  return submittedChoice.isCorrect;
};
