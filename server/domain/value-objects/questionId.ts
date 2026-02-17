export type QuestionId = string & { readonly __brand: "QuestionId" };

export const createQuestionId = (id: string): QuestionId => {
  if (!id) {
    throw new Error("Question ID cannot be empty.");
  }
  return id as QuestionId;
};
