import type { IQuestionRepository } from "../../domain/interface/IQuestionRepository.ts";
import { type Question } from "../../domain/entities/question.ts";
import type { QuestionId } from "../../domain/value-objects/questionId.ts";
import { type QuestionDTO, QuestionMapper } from "./QuestionMapper.ts";

const kv = await Deno.openKv();

export const createDenoKvQuestionRepository = (): IQuestionRepository => {
  return {
    findById: async (id: QuestionId): Promise<Question | null> => {
      const result = await kv.get<QuestionDTO>(["questions_by_id", id]);

      if (!result.value) {
        return null;
      }
      return QuestionMapper.toEntity(result.value);
    },
  };
};
