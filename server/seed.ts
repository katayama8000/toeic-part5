import type { QuestionDTO } from "./infrastructure/persistence/QuestionMapper.ts";

const questionsData: QuestionDTO[] = [
  {
    id: "q1",
    sentence: "The new marketing campaign has been _______ successful.",
    choices: [
      { label: "A", text: "remarkably", isCorrect: true },
      { label: "B", text: "remarked", isCorrect: false },
      { label: "C", text: "remarkable", isCorrect: false },
      { label: "D", text: "remarking", isCorrect: false },
    ],
  },
  {
    id: "q2",
    sentence:
      "All employees must wear their identification badges _______ all times.",
    choices: [
      { label: "A", text: "at", isCorrect: true },
      { label: "B", text: "in", isCorrect: false },
      { label: "C", text: "on", isCorrect: false },
      { label: "D", text: "by", isCorrect: false },
    ],
  },
];

const kv = await Deno.openKv();

for (const question of questionsData) {
  await kv.set(["questions_by_id", question.id], question);
}

console.log("✅ Seed data loaded successfully!");
