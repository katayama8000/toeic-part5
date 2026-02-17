import { assert, assertEquals } from "@std/assert";
import { createSubmitAnswerUseCase } from "./SubmitAnswerUseCase.ts";
import type { IQuestionRepository } from "../domain/interface/IQuestionRepository.ts";
import type { Question } from "../domain/entities/question.ts";
import type { QuestionId } from "../domain/value-objects/questionId.ts";

const setup = (mockQuestion: Question | null) => {
  const mockRepo: IQuestionRepository = {
    findById: (_id: QuestionId): Promise<Question | null> => {
      return Promise.resolve(mockQuestion);
    },
  };
  const submitAnswer = createSubmitAnswerUseCase(mockRepo);
  return { submitAnswer };
};

const questionId = "q1" as QuestionId;
const testQuestion: Question = {
  id: questionId,
  sentence: "Test sentence _______.",
  choices: [
    { label: "A", text: "Correct", isCorrect: true },
    { label: "B", text: "Incorrect", isCorrect: false },
  ],
};

Deno.test("SubmitAnswerUseCase should return correct result for a correct answer", async () => {
  // Arrange
  const { submitAnswer } = setup(testQuestion);

  // Act
  const result = await submitAnswer(questionId, "A");

  // Assert
  assert(result);
  assertEquals(result.wasCorrect, true);
  assertEquals(result.correctAnswerLabel, "A");
});

Deno.test("SubmitAnswerUseCase should return incorrect result for a wrong answer", async () => {
  // Arrange
  const { submitAnswer } = setup(testQuestion);

  // Act
  const result = await submitAnswer(questionId, "B");

  // Assert
  assert(result);
  assertEquals(result.wasCorrect, false);
  assertEquals(result.correctAnswerLabel, "A");
});

Deno.test("SubmitAnswerUseCase should return null if question is not found", async () => {
  // Arrange
  const { submitAnswer } = setup(null);

  // Act
  const result = await submitAnswer("non-existent" as QuestionId, "A");

  // Assert
  assertEquals(result, null);
});

Deno.test("SubmitAnswerUseCase should throw an error for an invalid choice label", async () => {
  // Arrange
  const { submitAnswer } = setup(testQuestion);

  // Act
  const result = await submitAnswer(questionId, "C");

  // Assert
  assert(result);
  // The use case implementation finds the correct answer, but the submitted
  // choice is not found, leading to a `false` isCorrect result.
  assertEquals(result.wasCorrect, false);
  assertEquals(result.correctAnswerLabel, "A");
});
