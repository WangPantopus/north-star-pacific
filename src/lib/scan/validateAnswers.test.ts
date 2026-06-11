import { describe, expect, it } from "vitest";
import { seriesAOpsHeavy } from "./fixtures";
import {
  validateNameField,
  validateScanAnswers,
  validateWorkEmail,
} from "./validateAnswers";

describe("validateScanAnswers", () => {
  it("accepts a complete valid fixture", () => {
    const result = validateScanAnswers(seriesAOpsHeavy);
    expect(result.ok).toBe(true);
  });

  it("rejects missing questions", () => {
    const result = validateScanAnswers({ q1: "team_1_10" });
    expect(result).toEqual({ ok: false, error: "missing-q2" });
  });

  it("rejects invalid option ids", () => {
    const result = validateScanAnswers({
      ...seriesAOpsHeavy,
      q1: "not-a-team",
    });
    expect(result).toEqual({ ok: false, error: "invalid-q1" });
  });
});

describe("contact validation", () => {
  it("validates email and names", () => {
    expect(validateWorkEmail("person@company.com")).toBe("person@company.com");
    expect(validateWorkEmail("bad-email")).toBeNull();
    expect(validateNameField("  Ada  ")).toBe("Ada");
    expect(validateNameField("")).toBeNull();
  });
});
