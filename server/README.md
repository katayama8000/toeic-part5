# TOEIC Part 5 Quiz API

This project is a backend API for a TOEIC Part 5 quiz application, built with
Deno and a clean architecture approach.

It provides endpoints for clients to fetch questions and submit user answers.
The API then validates the user's answer and returns the result.

## Architecture

This project uses a layered architecture inspired by Domain-Driven Design (DDD)
to separate concerns:

- **Domain**: The core business logic, rules, and types.
- **Application**: Orchestrates the use cases of the application.
- **Infrastructure**: Contains concrete implementations for external concerns
  (e.g., mock databases).
- **Presentation**: The entrypoint (`main.ts`) which handles HTTP requests,
  built using Deno's native `Deno.serve`.

## API Endpoints

### 1. Get a Question

Retrieves a single question by its ID. The correct answer is omitted from the
response.

- **URL**: `/questions/:id`
- **Method**: `GET`
- **Success Response (200)**:

```json
{
  "id": "q1",
  "sentence": "The new marketing campaign has been _______ successful.",
  "choices": [
    { "label": "A", "text": "remarkably" },
    { "label": "B", "text": "remarked" },
    { "label": "C", "text": "remarkable" },
    { "label": "D", "text": "remarking" }
  ]
}
```

### 2. Submit an Answer

Submits a user's answer for a specific question and returns the result.

- **URL**: `/questions/:id/answer`
- **Method**: `POST`
- **Request Body**:

```json
{
  "submittedLabel": "A"
}
```

- **Success Response (200)**:

```json
{
  "wasCorrect": true,
  "correctAnswerLabel": "A"
}
```

## Getting Started

This project is built with [Deno](https://deno.com/).

1. **Run the development server:**

   ```sh
   deno task dev
   ```

   The server will start, usually on `http://localhost:8000`.

2. **Test the API (in a separate terminal):**

   - Get question `q1`:
     ```sh
     curl http://localhost:8000/questions/q1
     ```

   - Submit a correct answer for `q1`:
     ```sh
     curl -X POST -H "Content-Type: application/json" -d '{"submittedLabel": "A"}' http://localhost:8000/questions/q1/answer
     ```

   - Submit an incorrect answer for `q1`:
     ```sh
     curl -X POST -H "Content-Type: application/json" -d '{"submittedLabel": "B"}' http://localhost:8000/questions/q1/answer
     ```
