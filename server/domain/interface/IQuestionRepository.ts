import type { Question } from "../entities/question.ts";
import type { QuestionId } from "../value-objects/questionId.ts";

export interface IQuestionRepository {
  findById(id: QuestionId): Promise<Question | null>;
}
