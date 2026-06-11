import { useCallback, useEffect, useMemo, useState } from "react";
import { SCAN_QUESTIONS } from "../lib/scan/questions";
import { scoreScan } from "../lib/scan/score";
import type { ScanAnswers, ScanResult } from "../lib/scan/types";
import { SCAN_STORAGE_KEY } from "./constants";

export type ScanFlowStep = "intro" | "question" | "partial";

type StoredSession = {
  step: ScanFlowStep;
  questionIndex: number;
  answers: ScanAnswers;
  result: ScanResult | null;
};

function isValidSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== "object") {
    return false;
  }
  const session = value as StoredSession;
  const indexValid =
    typeof session.questionIndex === "number" &&
    session.questionIndex >= 0 &&
    (session.step === "partial" ||
      session.questionIndex < SCAN_QUESTIONS.length);

  return (
    (session.step === "intro" ||
      session.step === "question" ||
      session.step === "partial") &&
    indexValid &&
    typeof session.answers === "object" &&
    session.answers !== null
  );
}

function loadSession(): StoredSession | null {
  try {
    const raw = sessionStorage.getItem(SCAN_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isValidSession(parsed)) {
      return null;
    }
    if (parsed.step === "intro") {
      return null;
    }
    if (parsed.step === "partial" && !parsed.result) {
      parsed.result = scoreScan(parsed.answers);
    }
    if ((parsed as { step: string }).step === "result") {
      parsed.step = "partial";
      if (!parsed.result) {
        parsed.result = scoreScan(parsed.answers);
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(session: StoredSession): void {
  sessionStorage.setItem(SCAN_STORAGE_KEY, JSON.stringify(session));
}

function clearSession(): void {
  sessionStorage.removeItem(SCAN_STORAGE_KEY);
}

const INITIAL_SESSION: StoredSession = {
  step: "intro",
  questionIndex: 0,
  answers: {},
  result: null,
};

export function useScanFlow() {
  const [session, setSession] = useState<StoredSession>(() => {
    return loadSession() ?? INITIAL_SESSION;
  });

  const currentQuestion = useMemo(() => {
    if (session.step !== "question") {
      return null;
    }
    return SCAN_QUESTIONS[session.questionIndex] ?? null;
  }, [session.questionIndex, session.step]);

  useEffect(() => {
    if (session.step === "intro") {
      clearSession();
      return;
    }
    persistSession(session);
  }, [session]);

  const start = useCallback(() => {
    setSession({
      step: "question",
      questionIndex: 0,
      answers: {},
      result: null,
    });
  }, []);

  const restart = useCallback(() => {
    clearSession();
    setSession(INITIAL_SESSION);
  }, []);

  const goToPartial = useCallback((answers: ScanAnswers) => {
    const result = scoreScan(answers);
    setSession({
      step: "partial",
      questionIndex: SCAN_QUESTIONS.length - 1,
      answers,
      result,
    });
  }, []);

  const advance = useCallback(
    (answers: ScanAnswers) => {
      const nextIndex = session.questionIndex + 1;
      if (nextIndex >= SCAN_QUESTIONS.length) {
        goToPartial(answers);
        return;
      }
      setSession((current) => ({
        ...current,
        step: "question",
        questionIndex: nextIndex,
        answers,
        result: null,
      }));
    },
    [goToPartial, session.questionIndex],
  );

  const selectSingle = useCallback(
    (optionId: string) => {
      if (!currentQuestion) {
        return;
      }
      const answers: ScanAnswers = {
        ...session.answers,
        [currentQuestion.id]: optionId,
      };
      advance(answers);
    },
    [advance, currentQuestion, session.answers],
  );

  const toggleMulti = useCallback(
    (optionId: string) => {
      if (!currentQuestion) {
        return;
      }
      const existing = session.answers[currentQuestion.id];
      const current = Array.isArray(existing)
        ? existing
        : existing
          ? [existing]
          : [];
      const isSelected = current.includes(optionId);
      let next = current;

      if (isSelected) {
        next = current.filter((id) => id !== optionId);
      } else if (
        currentQuestion.maxSelections &&
        current.length >= currentQuestion.maxSelections
      ) {
        return;
      } else {
        next = [...current, optionId];
      }

      setSession((state) => ({
        ...state,
        answers: {
          ...state.answers,
          [currentQuestion.id]: next,
        },
      }));
    },
    [currentQuestion, session.answers],
  );

  const continueMulti = useCallback(() => {
    if (!currentQuestion) {
      return;
    }
    const answer = session.answers[currentQuestion.id];
    const selections = Array.isArray(answer) ? answer : answer ? [answer] : [];
    if (selections.length === 0) {
      return;
    }
    advance(session.answers);
  }, [advance, currentQuestion, session.answers]);

  const goBack = useCallback(() => {
    if (session.step === "partial") {
      setSession((current) => ({
        ...current,
        step: "question",
        questionIndex: SCAN_QUESTIONS.length - 1,
        result: null,
      }));
      return;
    }

    if (session.step !== "question") {
      return;
    }

    if (session.questionIndex === 0) {
      setSession(INITIAL_SESSION);
      return;
    }

    setSession((current) => ({
      ...current,
      questionIndex: current.questionIndex - 1,
    }));
  }, [session.questionIndex, session.step]);

  return {
    step: session.step,
    questionIndex: session.questionIndex,
    answers: session.answers,
    result: session.result,
    currentQuestion,
    totalQuestions: SCAN_QUESTIONS.length,
    start,
    restart,
    selectSingle,
    toggleMulti,
    continueMulti,
    goBack,
  };
}
