import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

// --- Type Definitions ---

interface Choice {
  label: string;
  text: string;
}

interface Question {
  id: string;
  sentence: string;
  choices: Choice[];
}

interface AnswerResult {
  wasCorrect: boolean;
  correctAnswerLabel: string;
}

// --- API Fetcher ---

const API_BASE_URL = "http://localhost:8000";

const fetchQuestion = async (id: string): Promise<Question> => {
  const response = await fetch(`${API_BASE_URL}/questions/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const submitAnswer = async (
  id: string,
  submittedLabel: string,
): Promise<AnswerResult> => {
  const response = await fetch(`${API_BASE_URL}/questions/${id}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ submittedLabel }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// --- UI Components ---

function App() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState("q1");

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setResult(null);
        setSelectedChoice(null);
        const q = await fetchQuestion(questionId);
        setQuestion(q);
      } catch (err) {
        setError("Failed to fetch question. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestion();
  }, [questionId]);

  const handleSubmit = async () => {
    if (!selectedChoice || !question) return;

    try {
      const res = await submitAnswer(question.id, selectedChoice);
      setResult(res);
    } catch (err) {
      setError("Failed to submit answer.");
      console.error(err);
    }
  };

  const handleNextQuestion = () => {
    // This is a simple way to go to the next question.
    // A more robust solution might get the next question's ID from the server.
    const currentNum = parseInt(questionId.replace("q", ""), 10);
    setQuestionId(`q${currentNum + 1}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">TOEIC Part 5 Quiz</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {question && !isLoading && !error && (
          <div>
            <p className="text-lg mb-4">{question.sentence}</p>
            <div className="space-y-2">
              {question.choices.map((choice) => (
                <button
                  key={choice.label}
                  onClick={() => setSelectedChoice(choice.label)}
                  className={`block w-full text-left p-4 rounded-lg border ${
                    selectedChoice === choice.label
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  disabled={!!result}
                >
                  {choice.label}. {choice.text}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              disabled={!selectedChoice || !!result}
            >
              Submit
            </button>

            {result && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  result.wasCorrect ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <h2 className="text-xl font-bold">
                  {result.wasCorrect ? "Correct!" : "Incorrect"}
                </h2>
                <p>
                  The correct answer is:{" "}
                  <strong>{result.correctAnswerLabel}</strong>
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
