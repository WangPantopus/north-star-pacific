import { describe, expect, it } from "vitest";
import { validateScanAnswers } from "./validateAnswers";

describe("submit API payload validation", () => {
  it("rejects empty answers", () => {
    expect(validateScanAnswers({})).toEqual({ ok: false, error: "missing-q1" });
  });

  it("rejects invalid option ids", () => {
    expect(
      validateScanAnswers({
        q1: "not-a-team",
        q2: "seed",
        q3: "founder_ceo",
        q4: "b2b_saas",
        q5: ["support_tickets"],
        q6: "revenue",
        q7: "clone_support",
        q8: "daily",
        q9: "hours_10_40",
        q10: "on_roadmap",
        q11: "not_yet",
        q12: ["nothing_formal"],
        q13: "havent_tried",
        q14: "modern_saas",
        q15: "dedicated_team",
        q16: "documented",
        q17: ["none"],
        q18: "this_quarter",
        q19: "dedicated_budget",
      }),
    ).toEqual({ ok: false, error: "invalid-q1" });
  });

  it("rejects unexpected keys", () => {
    const valid = validateScanAnswers({
      q1: "team_1_10",
      q2: "bootstrapped",
      q3: "founder_ceo",
      q4: "b2b_saas",
      q5: ["support_tickets"],
      q6: "revenue",
      q7: "clone_support",
      q8: "daily",
      q9: "hours_10_40",
      q10: "on_roadmap",
      q11: "not_yet",
      q12: ["nothing_formal"],
      q13: "havent_tried",
      q14: "modern_saas",
      q15: "dedicated_team",
      q16: "documented",
      q17: ["none"],
      q18: "this_quarter",
      q19: "dedicated_budget",
      honeypot: "spam",
    });
    expect(valid).toEqual({ ok: false, error: "unexpected-answer-key" });
  });
});
