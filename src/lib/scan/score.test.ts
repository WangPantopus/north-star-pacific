import { describe, expect, it } from "vitest";
import {
  bootstrappedSupportPain,
  foundationsFirst,
  largeTeamCxBuild,
  largeTeamNoBudget,
  marketplaceGlueHybrid,
  prodCompetitorPressure,
  scatteredDataAnalytics,
  seriesAOpsHeavy,
  softQualifiedExplorer,
  stalledPrototype,
} from "./fixtures";
import { getSurfacedZones, getTopZone, scoreScan } from "./score";
import { SCAN_QUESTIONS } from "./questions";
import type { ZoneId } from "./types";

function surfacedSummary(answers: Parameters<typeof scoreScan>[0]) {
  const result = scoreScan(answers);
  return {
    result,
    top: getTopZone(result),
    surfaced: getSurfacedZones(result).map((zone) => ({
      id: zone.id,
      impact: zone.impact,
      effort: zone.effort,
      priority: zone.priority,
      lean: zone.lean,
    })),
  };
}

function zoneLean(
  result: ReturnType<typeof scoreScan>,
  id: ZoneId,
): string | undefined {
  return result.zones.find((zone) => zone.id === id)?.lean;
}

describe("questions.ts", () => {
  it("defines exactly 19 questions q1 through q19", () => {
    expect(SCAN_QUESTIONS).toHaveLength(19);
    expect(SCAN_QUESTIONS.map((question) => question.id)).toEqual([
      "q1",
      "q2",
      "q3",
      "q4",
      "q5",
      "q6",
      "q7",
      "q8",
      "q9",
      "q10",
      "q11",
      "q12",
      "q13",
      "q14",
      "q15",
      "q16",
      "q17",
      "q18",
      "q19",
    ]);
  });

  it("marks multi-select questions per spec", () => {
    const multi = SCAN_QUESTIONS.filter((question) => question.multiSelect).map(
      (question) => question.id,
    );
    expect(multi).toEqual(["q5", "q12", "q17"]);
    expect(SCAN_QUESTIONS.find((question) => question.id === "q5")?.maxSelections).toBe(
      3,
    );
  });
});

describe("scoreScan personas", () => {
  it("(a) Series A SaaS ops-heavy builder — OPS top, qualified", () => {
    const { result, top, surfaced } = surfacedSummary(seriesAOpsHeavy);

    expect(result.readiness).toBe(100);
    expect(result.band).toBe("ai_ready");
    expect(result.route).toBe("qualified");
    expect(result.headlineStat).toBe("40–100");
    expect(top?.id).toBe("OPS");
    expect(surfaced.map((zone) => zone.id)).toEqual(["OPS", "GLUE"]);
    expect(surfaced[0]).toMatchObject({
      id: "OPS",
      impact: 10,
      effort: 1,
      priority: 50,
      lean: "build",
    });
    expect(zoneLean(result, "GLUE")).toBe("hybrid");
  });

  it("(b) stalled-prototype company — RESCUE surfaced, build lean", () => {
    const { result, surfaced } = surfacedSummary(stalledPrototype);
    const rescue = result.zones.find((zone) => zone.id === "RESCUE");

    expect(result.route).toBe("qualified");
    expect(result.readiness).toBe(78);
    expect(surfaced.some((zone) => zone.id === "RESCUE")).toBe(true);
    expect(rescue).toMatchObject({
      impact: 7,
      effort: 2,
      lean: "build",
      surfaced: true,
    });
    expect(rescue?.leanReason).toContain("last mile");
    expect(rescue?.echoes).toContain(
      "you built a prototype that never fully shipped — the warmest rescue signal we see",
    );
  });

  it("(c) 6-person bootstrapped support pain — CX top, BUY lean, nurture", () => {
    const { result, top, surfaced } = surfacedSummary(bootstrappedSupportPain);

    expect(result.readiness).toBe(56);
    expect(result.band).toBe("strong_foundation");
    expect(result.route).toBe("nurture");
    expect(result.headlineStat).toBeNull();
    expect(top?.id).toBe("CX");
    expect(surfaced).toHaveLength(1);
    expect(surfaced[0]).toMatchObject({
      id: "CX",
      impact: 10,
      effort: 1,
      priority: 50,
      lean: "buy",
    });
    expect(top?.leanReason).toContain("off-the-shelf");
  });

  it("(d) scattered-data analytics-hungry company — DATA surfaced, WAIT lean", () => {
    const { result, top, surfaced } = surfacedSummary(scatteredDataAnalytics);

    expect(result.readiness).toBe(40);
    expect(result.band).toBe("quick_wins");
    expect(top?.id).toBe("DATA");
    expect(surfaced).toEqual([
      expect.objectContaining({
        id: "DATA",
        impact: 10,
        effort: 5,
        priority: 10,
        lean: "wait",
      }),
    ]);
    expect(top?.leanReason).toContain("scattered data");
    expect(top?.echoes).toContain("your operational data is scattered everywhere");
  });

  it("(e) soft-qualified explorer — Series A+ exploring with high readiness", () => {
    const { result, top } = surfacedSummary(softQualifiedExplorer);

    expect(result.readiness).toBe(86);
    expect(result.band).toBe("ai_ready");
    expect(result.route).toBe("soft_qualified");
    expect(top?.id).toBe("OPS");
  });

  it("(f) established marketplace — GLUE hybrid on modern stack handoffs", () => {
    const { result, surfaced } = surfacedSummary(marketplaceGlueHybrid);
    const glue = result.zones.find((zone) => zone.id === "GLUE");

    expect(result.route).toBe("qualified");
    expect(surfaced.map((zone) => zone.id)).toContain("GLUE");
    expect(glue?.lean).toBe("hybrid");
    expect(glue?.leanReason).toContain("Zapier");
  });

  it("(g) PROD competitor pressure — PROD surfaced with build lean", () => {
    const { result, top, surfaced } = surfacedSummary(prodCompetitorPressure);

    expect(result.route).toBe("qualified");
    expect(result.readiness).toBe(96);
    expect(top?.id).toBe("PROD");
    expect(surfaced[0]).toMatchObject({
      id: "PROD",
      impact: 10,
      effort: 2,
      priority: 40,
      lean: "build",
    });
  });

  it("(h) foundations-first profile — low readiness, nurture route", () => {
    const { result, top } = surfacedSummary(foundationsFirst);

    expect(result.readiness).toBe(25);
    expect(result.band).toBe("quick_wins");
    expect(result.route).toBe("nurture");
    expect(top?.id).toBe("OPS");
    expect(top?.impact).toBe(5.6);
  });

  it("(i) large team without budget — nurture despite scale signals", () => {
    const { result, top } = surfacedSummary(largeTeamNoBudget);

    expect(result.readiness).toBe(85);
    expect(result.route).toBe("nurture");
    expect(top?.id).toBe("CX");
    expect(top?.lean).toBe("build");
  });

  it("(j) large team with onboarding pain — CX build lean, qualified", () => {
    const { result, top } = surfacedSummary(largeTeamCxBuild);

    expect(result.readiness).toBe(100);
    expect(result.route).toBe("qualified");
    expect(top?.id).toBe("CX");
    expect(top?.lean).toBe("build");
    expect(top?.leanReason).toContain("onboarding pain");
  });
});

describe("scoreScan mechanics", () => {
  it("always surfaces RESCUE when Q10 is prototype_never_shipped", () => {
    const rescue = scoreScan(stalledPrototype).zones.find(
      (zone) => zone.id === "RESCUE",
    );
    expect(rescue?.surfaced).toBe(true);
  });

  it("hides PROD and RESCUE impact when product AI is not applicable", () => {
    const prod = scoreScan(scatteredDataAnalytics).zones.find(
      (zone) => zone.id === "PROD",
    );
    const rescue = scoreScan(scatteredDataAnalytics).zones.find(
      (zone) => zone.id === "RESCUE",
    );
    expect(prod?.impact).toBe(0);
    expect(rescue?.impact).toBe(0);
    expect(prod?.surfaced).toBe(false);
    expect(rescue?.surfaced).toBe(false);
  });

  it("caps services/agency PROD impact unless roadmap or prototype", () => {
    const agencyNoProd = scoreScan({
      ...prodCompetitorPressure,
      q4: "services_agency",
      q10: "live_production",
      q11: "costing_deals",
    });
    const prod = agencyNoProd.zones.find((zone) => zone.id === "PROD");
    expect(prod?.impact).toBeLessThanOrEqual(4);
  });

  it("applies Q6 alignment multiplier before impact cap", () => {
    const { zones } = scoreScan(seriesAOpsHeavy);
    const ops = zones.find((zone) => zone.id === "OPS");
    expect(ops?.impact).toBe(10);
  });
});
