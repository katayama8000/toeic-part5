import { assertEquals } from "@std/assert";
import {
  createGetQuestionUseCase,
  type GetQuestionResult,
} from "./GetQuestionUseCase.ts";
import type { IQuestionRepository } from "../domain/interface/IQuestionRepository.ts";
import type { Question } from "../domain/entities/question.ts";
import type { QuestionId } from "../domain/value-objects/questionId.ts";

// The mock repository still deals with the full domain entity
const setup = (mockQuestion: Question | null) => {
  const mockRepo: IQuestionRepository = {
    findById: (_id: QuestionId): Promise<Question | null> => {
      return Promise.resolve(mockQuestion);
    },
  };
  const getQuestion = createGetQuestionUseCase(mockRepo);
  return { getQuestion };
};

Deno.test("GetQuestionUseCase should return a public question when found", async () => {
  // Arrange
  const questionId = "q1" as QuestionId;

  // The full Question entity, as it exists in the database
  const dbQuestion: Question = {
    id: questionId,
    sentence: "Test sentence _______.",
    choices: [
      { label: "A", text: "A", isCorrect: false },
      { label: "B", text: "B", isCorrect: true },
    ],
  };

  // The expected public-facing question, without the isCorrect flag
  const expectedGetQuestionResult: GetQuestionResult = {
    id: questionId,
    sentence: "Test sentence _______.",
    choices: [
      { label: "A", text: "A" },
      { label: "B", text: "B" },
    ],
  };

  const { getQuestion } = setup(dbQuestion);

  // Act
  const actualGetQuestionResult = await getQuestion(questionId);

  // Assert
  assertEquals(actualGetQuestionResult, expectedGetQuestionResult);
});

Deno.test("GetQuestionUseCase should return null when not found", async () => {
  // Arrange
  const { getQuestion } = setup(null);
  const questionId = "non-existent" as QuestionId;

  // Act
  const result = await getQuestion(questionId);

  // Assert
  assertEquals(result, null);
});
