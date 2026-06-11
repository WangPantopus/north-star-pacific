import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitScan } from "../lib/scan/api";
import {
  bandDisplayName,
  emailGateButtonLabel,
  emailGateHeading,
  emailGateMicrocopy,
  partialZoneTeaser,
  zoneDisplayName,
} from "../lib/scan/reportTemplates";
import { saveReport } from "../lib/scan/reportStorage";
import { getTopZone } from "../lib/scan/score";
import type { ScanAnswers, ScanResult } from "../lib/scan/types";
import { ReadinessDial } from "./ReadinessDial";

type ScanPartialResultProps = {
  result: ScanResult;
  answers: ScanAnswers;
  onBack: () => void;
};

export function ScanPartialResult({
  result,
  answers,
  onBack,
}: ScanPartialResultProps) {
  const navigate = useNavigate();
  const topZone = getTopZone(result);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedFirst = firstName.trim();
    const trimmedCompany = company.trim();

    if (!trimmedEmail || !trimmedFirst || !trimmedCompany) {
      setError("Work email, first name, and company are required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Enter a valid work email.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await submitScan({
        answers,
        email: trimmedEmail,
        firstName: trimmedFirst,
        company: trimmedCompany,
      });

      if (!response.ok || !response.id) {
        setError(
          response.error === "rate-limited"
            ? "Too many submissions from this network. Try again in an hour."
            : response.error === "storage-not-configured"
              ? "Report storage is not configured yet. Please try again later."
              : "Could not save your report. Please try again.",
        );
        return;
      }

      saveReport({
        id: response.id,
        answers,
        result,
        contact: {
          email: trimmedEmail,
          firstName: trimmedFirst,
          company: trimmedCompany,
        },
        createdAt: new Date().toISOString(),
        reportUrl: response.reportUrl,
      });

      navigate(`/scan/r/${response.id}`);
    } catch {
      setError("Could not save your report. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="scan-panel scan-partial">
      <button className="scan-back-btn" type="button" onClick={onBack} disabled={submitting}>
        ← Back
      </button>

      <p className="eyebrow">
        <span className="dot" aria-hidden="true" />
        Your scan result
      </p>

      <div className="scan-partial-hero">
        <ReadinessDial
          score={result.readiness}
          bandLabel={bandDisplayName(result.band)}
          size="lg"
        />
        <div className="scan-partial-copy">
          <h1 className="scan-title">Here&apos;s what we found</h1>
          {topZone ? (
            <>
              <p className="scan-partial-zone">
                Highest-leverage zone:{" "}
                <strong>{zoneDisplayName(topZone.id, true)}</strong>
              </p>
              <p className="scan-partial-teaser">
                {partialZoneTeaser(result, topZone)}
              </p>
            </>
          ) : null}
        </div>
      </div>

      <div className="scan-gate-card">
        <h2 className="scan-gate-title">{emailGateHeading()}</h2>
        <p className="scan-gate-micro">{emailGateMicrocopy()}</p>

        <form className="scan-gate-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field-label" htmlFor="scan-email">
              Work email <span className="req">*</span>
            </label>
            <input
              id="scan-email"
              className="field-input"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="scan-first-name">
                First name <span className="req">*</span>
              </label>
              <input
                id="scan-first-name"
                className="field-input"
                type="text"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="scan-company">
                Company <span className="req">*</span>
              </label>
              <input
                id="scan-company"
                className="field-input"
                type="text"
                name="company"
                autoComplete="organization"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          {error ? <p className="scan-gate-error">{error}</p> : null}

          <button
            className="btn btn-primary scan-gate-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Saving your report…" : emailGateButtonLabel()}
          </button>
        </form>
      </div>
    </div>
  );
}
