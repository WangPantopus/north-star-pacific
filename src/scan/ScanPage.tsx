import { type KeyboardEvent, useRef } from "react";
import { SCAN_QUESTIONS } from "../lib/scan/questions";
import type { ScanQuestion } from "../lib/scan/types";
import { SCAN_SECTIONS } from "./constants";
import { ScanHeader } from "./ScanLayout";
import { ScanPartialResult } from "./ScanPartialResult";
import { useScanFlow } from "./useScanFlow";
import { useScanPageMeta } from "./useScanPageMeta";
import "./scan.css";

function ScanProgressBar({
  questionIndex,
  activeSectionId,
  activeSectionLabel,
}: {
  questionIndex: number;
  activeSectionId: string;
  activeSectionLabel: string;
}) {
  const progress =
    ((questionIndex + 1) / SCAN_QUESTIONS.length) * 100;

  return (
    <div className="scan-progress" aria-label="Scan progress">
      <div className="scan-progress-meta">
        <span className="scan-progress-count">
          {questionIndex + 1} / {SCAN_QUESTIONS.length}
        </span>
        <span className="scan-progress-section">{activeSectionLabel}</span>
      </div>
      <div className="scan-progress-track">
        <div
          className="scan-progress-fill"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={SCAN_QUESTIONS.length}
          aria-valuenow={questionIndex + 1}
        />
        {SCAN_SECTIONS.map((section) => {
          const markerPosition =
            (section.startIndex / SCAN_QUESTIONS.length) * 100;
          const isActive = section.id === activeSectionId;
          const isComplete = questionIndex >= section.startIndex;

          return (
            <span
              key={section.id}
              className={`scan-progress-marker${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
              style={{ left: `${markerPosition}%` }}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <div className="scan-progress-labels" aria-hidden="true">
        {SCAN_SECTIONS.map((section) => (
          <span
            key={section.id}
            className={section.id === activeSectionId ? "is-active" : undefined}
          >
            {section.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScanIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="scan-panel scan-intro">
      <p className="eyebrow">
        <span className="dot" aria-hidden="true" />
        Free · 5 minutes
      </p>
      <h1 className="scan-title">The AI Opportunity Scan</h1>
      <p className="scan-lead">
        19 questions. About 5 minutes. Your top AI opportunities, mapped — no
        email needed to start.
      </p>

      <div className="scan-section-preview" aria-label="Scan sections">
        {SCAN_SECTIONS.map((section, index) => (
          <span key={section.id} className="scan-section-chip">
            {section.label}
            {index < SCAN_SECTIONS.length - 1 ? (
              <span className="scan-section-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </span>
        ))}
      </div>

      <button className="btn btn-primary scan-start-btn" type="button" onClick={onStart}>
        Start the scan
      </button>
    </div>
  );
}

function getSelections(
  question: ScanQuestion,
  answers: ReturnType<typeof useScanFlow>["answers"],
): string[] {
  const value = answers[question.id];
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function ScanQuestionScreen({
  question,
  questionIndex,
  answers,
  onSelectSingle,
  onToggleMulti,
  onContinueMulti,
  onBack,
}: {
  question: ScanQuestion;
  questionIndex: number;
  answers: ReturnType<typeof useScanFlow>["answers"];
  onSelectSingle: (optionId: string) => void;
  onToggleMulti: (optionId: string) => void;
  onContinueMulti: () => void;
  onBack: () => void;
}) {
  const selections = getSelections(question, answers);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const sectionMeta = SCAN_SECTIONS.find(
    (section) => section.id === question.section,
  );
  const sectionLabel = sectionMeta?.label ?? question.section;

  const getFocusedIndex = () =>
    optionRefs.current.findIndex(
      (element) => element === document.activeElement,
    );

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const lastIndex = question.options.length - 1;
    const focusedIndex = getFocusedIndex();
    const currentIndex = focusedIndex >= 0 ? focusedIndex : 0;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      const next = currentIndex >= lastIndex ? 0 : currentIndex + 1;
      focusOption(next);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = currentIndex <= 0 ? lastIndex : currentIndex - 1;
      focusOption(next);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = question.options[currentIndex];
      if (!option) {
        return;
      }
      if (question.multiSelect) {
        onToggleMulti(option.id);
      } else {
        onSelectSingle(option.id);
      }
    }
  };

  const canContinue = question.multiSelect && selections.length > 0;
  const maxHint =
    question.maxSelections && question.multiSelect
      ? ` · pick up to ${question.maxSelections}`
      : "";

  return (
    <div className="scan-panel scan-question">
      <ScanProgressBar
        questionIndex={questionIndex}
        activeSectionId={question.section}
        activeSectionLabel={sectionLabel}
      />

      <button className="scan-back-btn" type="button" onClick={onBack}>
        ← Back
      </button>

      <p className="eyebrow scan-question-eyebrow">
        <span className="dot" aria-hidden="true" />
        {sectionLabel}
        {question.multiSelect ? " · select all that apply" : ""}
        {maxHint}
      </p>

      <h2 className="scan-question-prompt" id={`scan-question-${question.id}`}>
        {question.prompt}
      </h2>

      <div
        key={question.id}
        className="scan-options"
        role={question.multiSelect ? "group" : "radiogroup"}
        aria-labelledby={`scan-question-${question.id}`}
        onKeyDown={handleKeyDown}
      >
        {question.options.map((option, index) => {
          const isSelected = selections.includes(option.id);
          const isDisabled =
            question.multiSelect &&
            Boolean(question.maxSelections) &&
            !isSelected &&
            selections.length >= (question.maxSelections ?? Infinity);

          return (
            <button
              key={option.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              className={`scan-option${isSelected ? " is-selected" : ""}`}
              role={question.multiSelect ? "checkbox" : "radio"}
              aria-checked={isSelected}
              disabled={isDisabled}
              autoFocus={index === 0}
              onClick={() => {
                if (question.multiSelect) {
                  onToggleMulti(option.id);
                  return;
                }
                onSelectSingle(option.id);
              }}
            >
              <span className="scan-option-indicator" aria-hidden="true">
                {question.multiSelect ? (
                  <span className={`scan-check${isSelected ? " is-on" : ""}`} />
                ) : (
                  <span className={`scan-radio${isSelected ? " is-on" : ""}`} />
                )}
              </span>
              <span className="scan-option-label">{option.label}</span>
            </button>
          );
        })}
      </div>

      {question.multiSelect ? (
        <div className="scan-question-actions">
          <button
            className="btn btn-primary"
            type="button"
            disabled={!canContinue}
            onClick={onContinueMulti}
          >
            Continue
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function ScanPage() {
  const flow = useScanFlow();
  useScanPageMeta("/scan");

  return (
    <div className="scan-page">
      <a className="skip-link" href="#scan-main">
        Skip to scan
      </a>
      <div className="grain" aria-hidden="true" />
      <ScanHeader />
      <main id="scan-main" className="scan-main" tabIndex={-1}>
        {flow.step === "intro" ? <ScanIntro onStart={flow.start} /> : null}

        {flow.step === "question" && flow.currentQuestion ? (
          <ScanQuestionScreen
            question={flow.currentQuestion}
            questionIndex={flow.questionIndex}
            answers={flow.answers}
            onSelectSingle={flow.selectSingle}
            onToggleMulti={flow.toggleMulti}
            onContinueMulti={flow.continueMulti}
            onBack={flow.goBack}
          />
        ) : null}

        {flow.step === "partial" && flow.result ? (
          <ScanPartialResult
            result={flow.result}
            answers={flow.answers}
            onBack={flow.goBack}
          />
        ) : null}
      </main>
    </div>
  );
}
