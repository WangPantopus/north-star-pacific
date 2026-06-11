/** @vitest-environment happy-dom */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import {
  bootstrappedSupportPain,
  scatteredDataAnalytics,
  seriesAOpsHeavy,
  softQualifiedExplorer,
  stalledPrototype,
} from "../lib/scan/fixtures";
import {
  bandDisplayName,
  leanDisplayName,
  nurtureCtaHeadline,
  qualifiedCtaHeadline,
  verdictHeadline,
  zoneCardTitle,
} from "../lib/scan/reportTemplates";
import { getSurfacedZones, getTopZone, scoreScan } from "../lib/scan/score";
import type { ScanAnswers } from "../lib/scan/types";
import { ScanReport } from "./ScanReport";

afterEach(() => {
  cleanup();
});

function renderReport(answers: ScanAnswers, id = "qa-test") {
  const result = scoreScan(answers);
  return render(
    <MemoryRouter>
      <ScanReport
        report={{
          id,
          answers,
          result,
          contact: {
            email: "qa@example.com",
            firstName: "QA",
            company: "Test Co",
          },
          createdAt: new Date().toISOString(),
          bookingUrl: "https://calendly.com/example?scan_id=qa-test",
        }}
      />
    </MemoryRouter>,
  );
}

describe("ScanReport UI — five fixture personas", () => {
  it("(a) Series A ops-heavy — score, zones, qualified CTA", () => {
    const result = scoreScan(seriesAOpsHeavy);
    const top = getTopZone(result);
    const surfaced = getSurfacedZones(result);

    renderReport(seriesAOpsHeavy);

    expect(screen.getByText(verdictHeadline(result))).toBeInTheDocument();
    expect(screen.getByText(String(result.readiness))).toBeInTheDocument();
    expect(screen.getByText(bandDisplayName(result.band))).toBeInTheDocument();
    expect(screen.getByText(zoneCardTitle(0, surfaced[0]))).toBeInTheDocument();
    expect(top?.id).toBe("OPS");
    expect(screen.getAllByText(leanDisplayName("build")).length).toBeGreaterThan(0);

    expect(screen.getByText(qualifiedCtaHeadline("$2,500"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Book the AI Opportunity Audit/i })).toBeInTheDocument();
    expect(screen.queryByText(nurtureCtaHeadline())).not.toBeInTheDocument();
  });

  it("(b) Stalled prototype — RESCUE surfaced, qualified CTA", () => {
    const result = scoreScan(stalledPrototype);
    const rescue = result.zones.find((zone) => zone.id === "RESCUE");

    renderReport(stalledPrototype);

    expect(screen.getByText(verdictHeadline(result))).toBeInTheDocument();
    expect(result.readiness).toBe(78);
    expect(rescue?.surfaced).toBe(true);
    expect(screen.getByText(/Zone \d+ — Pilot to production/i)).toBeInTheDocument();
    expect(screen.getAllByText(leanDisplayName("build")).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Book the AI Opportunity Audit/i })).toBeInTheDocument();
    expect(screen.queryByText(nurtureCtaHeadline())).not.toBeInTheDocument();
  });

  it("(c) Bootstrapped support pain — CX buy lean, nurture CTA only", () => {
    const result = scoreScan(bootstrappedSupportPain);
    const top = getTopZone(result);

    renderReport(bootstrappedSupportPain);

    expect(result.route).toBe("nurture");
    expect(top?.lean).toBe("buy");
    expect(screen.getByText(leanDisplayName("buy"))).toBeInTheDocument();
    expect(screen.getByText(nurtureCtaHeadline())).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Book the AI Opportunity Audit/i })).not.toBeInTheDocument();
    expect(screen.queryByText(qualifiedCtaHeadline("$2,500"))).not.toBeInTheDocument();
  });

  it("(d) Scattered data — DATA wait lean, qualified CTA", () => {
    const result = scoreScan(scatteredDataAnalytics);
    const top = getTopZone(result);

    renderReport(scatteredDataAnalytics);

    expect(top?.id).toBe("DATA");
    expect(screen.getByText(leanDisplayName("wait"))).toBeInTheDocument();
    expect(screen.getAllByText(/scattered data/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Book the AI Opportunity Audit/i })).toBeInTheDocument();
    expect(screen.queryByText(nurtureCtaHeadline())).not.toBeInTheDocument();
  });

  it("(e) Soft-qualified explorer — nurture first, audit second", () => {
    const result = scoreScan(softQualifiedExplorer);

    renderReport(softQualifiedExplorer);

    expect(result.route).toBe("soft_qualified");
    expect(screen.getByText(nurtureCtaHeadline())).toBeInTheDocument();
    expect(screen.getByText(qualifiedCtaHeadline("$2,500"))).toBeInTheDocument();

    const cta = document.querySelector(".scan-cta");
    expect(cta).toBeTruthy();
    const headings = within(cta as HTMLElement).getAllByRole("heading", { level: 2 });
    expect(headings[0]).toHaveTextContent(nurtureCtaHeadline());
    expect(headings[1]).toHaveTextContent(qualifiedCtaHeadline("$2,500"));
  });
});

describe("ScanReport CTA routing invariants", () => {
  it("nurture route never shows audit booking CTA", () => {
    renderReport(bootstrappedSupportPain);
    expect(screen.queryByRole("link", { name: /Book the AI Opportunity Audit/i })).toBeNull();
    expect(screen.queryByText(qualifiedCtaHeadline("$2,500"))).toBeNull();
  });

  it("qualified route never shows nurture headline", () => {
    renderReport(seriesAOpsHeavy);
    expect(screen.queryByText(nurtureCtaHeadline())).toBeNull();
  });
});
