import { assertEquals, assertThrows } from "@std/assert";
import { createQuestionId } from "./questionId.ts";

Deno.test("createQuestionId should return a branded QuestionId for a valid string", () => {
  // Arrange
  const id = "some-valid-id";

  // Act
  const questionId = createQuestionId(id);

  // Assert
  assertEquals(questionId, id);
});

Deno.test("createQuestionId should throw an error for an empty string", () => {
  // Arrange
  const id = "";

  // Act & Assert
  assertThrows(
    () => createQuestionId(id),
    Error,
    "Question ID cannot be empty.",
  );
});
