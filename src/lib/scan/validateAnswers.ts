import { SCAN_QUESTIONS } from "./questions";
import type { QuestionId, ScanAnswers } from "./types";

const QUESTION_IDS = SCAN_QUESTIONS.map((question) => question.id);
const OPTION_IDS = new Map(
  SCAN_QUESTIONS.map((question) => [
    question.id,
    new Set(question.options.map((option) => option.id)),
  ]),
);

export type ValidateAnswersResult =
  | { ok: true; answers: ScanAnswers }
  | { ok: false; error: string };

export function validateScanAnswers(payload: unknown): ValidateAnswersResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "invalid-answers" };
  }

  const raw = payload as Record<string, unknown>;
  const answers: ScanAnswers = {};

  for (const questionId of QUESTION_IDS) {
    if (!(questionId in raw)) {
      return { ok: false, error: `missing-${questionId}` };
    }
  }

  for (const key of Object.keys(raw)) {
    if (!QUESTION_IDS.includes(key as QuestionId)) {
      return { ok: false, error: "unexpected-answer-key" };
    }
  }

  for (const question of SCAN_QUESTIONS) {
    const value = raw[question.id];
    const validOptions = OPTION_IDS.get(question.id);
    if (!validOptions) {
      return { ok: false, error: "invalid-question-config" };
    }

    if (question.multiSelect) {
      if (!Array.isArray(value) || value.length === 0) {
        return { ok: false, error: `invalid-${question.id}` };
      }
      if (
        question.maxSelections &&
        value.length > question.maxSelections
      ) {
        return { ok: false, error: `too-many-${question.id}` };
      }
      const selections = value as unknown[];
      if (
        !selections.every(
          (item) => typeof item === "string" && validOptions.has(item),
        )
      ) {
        return { ok: false, error: `invalid-${question.id}` };
      }
      answers[question.id] = selections as string[];
      continue;
    }

    if (typeof value !== "string" || !validOptions.has(value)) {
      return { ok: false, error: `invalid-${question.id}` };
    }
    answers[question.id] = value;
  }

  return { ok: true, answers };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWorkEmail(email: unknown): string | null {
  if (typeof email !== "string") {
    return null;
  }
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || trimmed.length > 254 || !EMAIL_RE.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function validateNameField(value: unknown, maxLength = 120): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }
  return trimmed;
}
