/**
 * Represents a single multiple-choice option.
 */
export type Choice = {
  readonly label: string;
  readonly text: string;
  readonly isCorrect: boolean; // Flag to indicate if this is the correct answer
};
