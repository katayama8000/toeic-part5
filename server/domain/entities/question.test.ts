import { assert } from "@std/assert";
import { checkAnswer, type Question } from "./question.ts";
import type { QuestionId } from "../value-objects/questionId.ts";

const testQuestion: Question = {
  id: "q1" as QuestionId,
  sentence: "Test sentence _______.",
  choices: [
    { label: "A", text: "Correct", isCorrect: true },
    { label: "B", text: "Incorrect", isCorrect: false },
  ],
};

Deno.test("checkAnswer should return true for the correct label", () => {
  // Act
  const result = checkAnswer(testQuestion, "A");
  // Assert
  assert(result);
});

Deno.test("checkAnswer should return false for an incorrect label", () => {
  // Act
  const result = checkAnswer(testQuestion, "B");
  // Assert
  assert(!result);
});

Deno.test("checkAnswer should return false for a non-existent label", () => {
  // Act
  const result = checkAnswer(testQuestion, "C");
  // Assert
  assert(!result);
});
