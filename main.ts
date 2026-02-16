import { createGetQuestionUseCase } from './application/GetQuestionUseCase.ts';
import { createSubmitAnswerUseCase } from './application/SubmitAnswerUseCase.ts';
import { createQuestionId } from './domain/value-objects/questionId.ts';
import { createDenoKvQuestionRepository } from './infrastructure/persistence/DenoKvQuestionRepository.ts';
import { createRouter, type Handler } from './lib/router.ts';

// A helper function to create JSON responses.
const jsonResponse = (data: unknown, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
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
    return jsonResponse({ error: 'Question not found' }, 404);
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
    if (typeof submittedLabel !== 'string') {
      return jsonResponse({ error: 'submittedLabel must be a string' }, 400);
    }

    const result = await submitAnswerUseCase(questionId, submittedLabel);

    if (!result) {
      return jsonResponse({ error: 'Question not found' }, 404);
    }

    return jsonResponse(result);
  } catch (_error) {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }
};

// --- Server ---
console.log('Server starting...');

const router = createRouter();
router.get('/questions/:id', getQuestionHandler);
router.post('/questions/:id/answer', submitAnswerHandler);

Deno.serve(router.fetch);
