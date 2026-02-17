# TOEIC Part 5 Quiz API

## Description

This project is a backend API for a TOEIC Part 5 quiz application. It provides
endpoints for clients to fetch questions and submit user answers. The API then
validates the user's answer and returns whether it was correct. It serves as a
backend for a learning application where users can test their knowledge.

## Architecture Overview

This project uses a layered architecture inspired by Domain-Driven Design (DDD)
to separate concerns. It favors a functional programming style and is built on
the native Deno runtime.

1. **Presentation Layer**: Handles HTTP requests and responses. It uses a
   simple, dependency-free custom router built for this project. The main server
   is started with `Deno.serve`.
2. **Application Layer**: Orchestrates the use cases of the application,
   implemented as higher-order functions.
3. **Domain Layer**: The heart of the application. Contains the core business
   logic, rules, and types.
4. **Infrastructure Layer**: Contains concrete implementations for external
   concerns, primarily the persistence layer which uses Deno KV.

### Custom Router

To keep the project dependency-free, a custom, functional router was created in
`lib/router.ts`. It provides a simple way to map HTTP methods and URL patterns
to specific handler functions.

- It is created via a `createRouter()` factory function.
- It supports `router.get(path, handler)` and `router.post(path, handler)`.
- It uses the standard `URLPattern` API internally for matching routes and
  extracting path parameters.
- The main `Deno.serve` function delegates all incoming requests to
  `router.fetch`.

## Directory Structure

```
.
├── lib/
│   └── router.ts
├── application/
│   ├── GetQuestionUseCase.ts
│   └── SubmitAnswerUseCase.ts
├── domain/
│   ├── entities/
│   │   └── question.ts
│   ├── interface/
│   │   └── IQuestionRepository.ts
│   └── value-objects/
│       ├── choice.ts
│       └── questionId.ts
├── infrastructure/
│   └── persistence/
│       ├── DenoKvQuestionRepository.ts
│       ├── MockQuestionRepository.ts
│       └── QuestionMapper.ts
├── main.ts
├── seed.ts
└── deno.json
```

## Code Details

### Presentation Layer (`main.ts`)

The entry point of the application sets up the dependency injection, defines the
route handlers, and starts the server with the custom router.

```typescript
import { createGetQuestionUseCase } from "./application/GetQuestionUseCase.ts";
import { createSubmitAnswerUseCase } from "./application/SubmitAnswerUseCase.ts";
import { createQuestionId } from "./domain/value-objects/questionId.ts";
import { createDenoKvQuestionRepository } from "./infrastructure/persistence/DenoKvQuestionRepository.ts";
import { createRouter, type Handler } from "./lib/router.ts";

// A helper function to create JSON responses.
const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

// --- Composition Root ---
const questionRepo = createDenoKvQuestionRepository();
const getQuestionUseCase = createGetQuestionUseCase(questionRepo);
const submitAnswerUseCase = createSubmitAnswerUseCase(questionRepo);

// --- Route Handlers ---

const getQuestionHandler: Handler = async (_req, match) => {
  const { id } = match.pathname.groups;
  const questionId = createQuestionId(id!);
  const question = await getQuestionUseCase(questionId);

  if (!question) {
    return jsonResponse({ error: "Question not found" }, 404);
  }

  // Exclude correct answer details from this endpoint.
  const publicChoices = question.choices.map(({ label, text }) => ({
    label,
    text,
  }));
  const publicQuestion = {
    id: question.id,
    sentence: question.sentence,
    choices: publicChoices,
  };

  return jsonResponse(publicQuestion);
};

const submitAnswerHandler: Handler = async (req, match) => {
  const { id } = match.pathname.groups;
  const questionId = createQuestionId(id!);

  try {
    const body = (await req.json()) as { submittedLabel: string };
    const { submittedLabel } = body;
    if (typeof submittedLabel !== "string") {
      return jsonResponse({ error: "submittedLabel must be a string" }, 400);
    }

    const result = await submitAnswerUseCase(questionId, submittedLabel);

    if (!result) {
      return jsonResponse({ error: "Question not found" }, 404);
    }

    return jsonResponse(result);
  } catch (_error) {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }
};

// --- Server ---
console.log("Server starting...");

const router = createRouter();
router.get("/questions/:id", getQuestionHandler);
router.post("/questions/:id/answer", submitAnswerHandler);

Deno.serve(router.fetch);
```
