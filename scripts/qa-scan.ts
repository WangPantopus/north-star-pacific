/**
 * P20 QA — Playwright checks against preview server.
 * Usage: npm run preview &  npx tsx scripts/qa-scan.ts
 */
import { chromium } from "playwright";
import { SCAN_STORAGE_KEY } from "../src/scan/constants";
import {
  bootstrappedSupportPain,
  scatteredDataAnalytics,
  seriesAOpsHeavy,
  softQualifiedExplorer,
  stalledPrototype,
} from "../src/lib/scan/fixtures";
import { bandDisplayName } from "../src/lib/scan/reportTemplates";
import { getSurfacedZones, getTopZone, scoreScan } from "../src/lib/scan/score";
import type { ScanAnswers } from "../src/lib/scan/types";

const PERSONAS = [
  {
    name: "(a) Series A ops-heavy",
    answers: seriesAOpsHeavy,
    expect: { readiness: 100, route: "qualified", top: "OPS", cta: "qualified" as const },
  },
  {
    name: "(b) Stalled prototype",
    answers: stalledPrototype,
    expect: { readiness: 78, route: "qualified", surfaced: ["RESCUE"], cta: "qualified" as const },
  },
  {
    name: "(c) Bootstrapped nurture",
    answers: bootstrappedSupportPain,
    expect: { readiness: 56, route: "nurture", top: "CX", lean: "buy", cta: "nurture" as const },
  },
  {
    name: "(d) Scattered DATA",
    answers: scatteredDataAnalytics,
    expect: { readiness: 40, route: "qualified", top: "DATA", lean: "wait", cta: "qualified" as const },
  },
  {
    name: "(e) Soft-qualified",
    answers: softQualifiedExplorer,
    expect: { readiness: 86, route: "soft_qualified", top: "OPS", cta: "soft_qualified" as const },
  },
];

function makePartialSession(answers: ScanAnswers) {
  return {
    step: "partial" as const,
    questionIndex: 18,
    answers,
    result: scoreScan(answers),
  };
}

function makeReportPayload(answers: ScanAnswers, id: string, port: number) {
  const result = scoreScan(answers);
  return {
    ok: true,
    report: {
      id,
      createdAt: new Date().toISOString(),
      contact: { email: "qa@example.com", firstName: "QA", company: "Test Co" },
      result,
      bookingUrl: `https://calendly.com/example?scan_id=${id}`,
      auditBooked: false,
      reportUrl: `http://127.0.0.1:${port}/scan/r/${id}`,
    },
  };
}

async function waitForServer(url: string, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`Server not ready: ${url}`);
}

async function hasHorizontalScroll(page: import("playwright").Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
}

const failures: string[] = [];
const passes: string[] = [];

function pass(msg: string) {
  passes.push(msg);
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string) {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
}

async function main() {
  const port = 4173;
  const base = `http://127.0.0.1:${port}`;
  await waitForServer(`${base}/scan`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  console.log("\n=== P20 QA — UI personas (390px) ===\n");

  for (const persona of PERSONAS) {
    const result = scoreScan(persona.answers);
    const top = getTopZone(result);
    const surfaced = getSurfacedZones(result).map((z) => z.id);

    if (result.readiness !== persona.expect.readiness) {
      fail(`${persona.name}: readiness ${result.readiness} !== ${persona.expect.readiness}`);
    } else {
      pass(`${persona.name}: readiness ${result.readiness}`);
    }

    if (result.route !== persona.expect.route) {
      fail(`${persona.name}: route ${result.route} !== ${persona.expect.route}`);
    }

    if (persona.expect.top && top?.id !== persona.expect.top) {
      fail(`${persona.name}: top zone ${top?.id} !== ${persona.expect.top}`);
    } else if (persona.expect.top) {
      pass(`${persona.name}: top zone ${top?.id}`);
    }

    if (persona.expect.surfaced) {
      for (const zoneId of persona.expect.surfaced) {
        if (!surfaced.includes(zoneId)) {
          fail(`${persona.name}: ${zoneId} not surfaced`);
        } else {
          pass(`${persona.name}: ${zoneId} surfaced`);
        }
      }
    }

    if (persona.expect.lean && top?.lean !== persona.expect.lean) {
      fail(`${persona.name}: lean ${top?.lean} !== ${persona.expect.lean}`);
    } else if (persona.expect.lean) {
      pass(`${persona.name}: lean ${top?.lean}`);
    }

    await page.goto(`${base}/scan`);
    await page.evaluate(
      ({ key, session }) => sessionStorage.setItem(key, JSON.stringify(session)),
      { key: SCAN_STORAGE_KEY, session: makePartialSession(persona.answers) },
    );
    await page.reload();
    await page.waitForSelector(".scan-dial-score");

    const dialScore = await page.locator(".scan-dial-score").textContent();
    if (dialScore?.trim() !== String(result.readiness)) {
      fail(`${persona.name}: dial shows ${dialScore}, expected ${result.readiness}`);
    } else {
      pass(`${persona.name}: partial dial score ${dialScore}`);
    }

    const bandText = await page.locator(".scan-dial-band").textContent();
    if (!bandText?.includes(bandDisplayName(result.band).split(" ")[0])) {
      fail(`${persona.name}: dial band mismatch (${bandText})`);
    } else {
      pass(`${persona.name}: partial dial band rendered`);
    }

    if (await hasHorizontalScroll(page)) {
      fail(`${persona.name}: horizontal scroll on partial @390px`);
    } else {
      pass(`${persona.name}: no horizontal scroll on partial`);
    }

    const slug = `qa${persona.expect.top?.toLowerCase() ?? "x"}01`;
    await page.route("**/api/scan/report*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(makeReportPayload(persona.answers, slug, port)),
      });
    });

    await page.goto(`${base}/scan/r/${slug}`);
    await page.waitForSelector(".scan-report-headline");

    const headline = await page.locator(".scan-report-headline").textContent();
    if (!headline?.includes(String(result.readiness))) {
      fail(`${persona.name}: report headline missing score`);
    } else {
      pass(`${persona.name}: report headline score`);
    }

    const hasBook =
      (await page.getByRole("link", { name: /Book the AI Opportunity Audit/i }).count()) > 0;
    const hasNurture =
      (await page.getByText(/Honestly\? You don't need/i).count()) > 0;

    if (persona.expect.cta === "nurture") {
      if (hasBook) fail(`${persona.name}: nurture route shows book CTA`);
      else pass(`${persona.name}: nurture route hides book CTA`);
      if (!hasNurture) fail(`${persona.name}: nurture route missing nurture copy`);
      else pass(`${persona.name}: nurture route shows nurture copy`);
    } else if (persona.expect.cta === "qualified") {
      if (!hasBook) fail(`${persona.name}: qualified route missing book CTA`);
      else pass(`${persona.name}: qualified route shows book CTA`);
      if (hasNurture) fail(`${persona.name}: qualified route shows nurture copy`);
      else pass(`${persona.name}: qualified route hides nurture copy`);
    } else if (persona.expect.cta === "soft_qualified") {
      if (!hasBook) fail(`${persona.name}: soft-qualified missing book CTA`);
      else pass(`${persona.name}: soft-qualified shows book CTA (secondary)`);
      if (!hasNurture) fail(`${persona.name}: soft-qualified missing nurture copy`);
      else pass(`${persona.name}: soft-qualified shows nurture copy first`);
    }

    if (await hasHorizontalScroll(page)) {
      fail(`${persona.name}: horizontal scroll on report @390px`);
    } else {
      pass(`${persona.name}: no horizontal scroll on report`);
    }

    await page.unrouteAll();
  }

  console.log("\n=== Mobile layout checks ===\n");
  await page.goto(`${base}/scan`, { waitUntil: "networkidle" });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Start the scan/i }).click();
  await page.waitForSelector(".scan-question-prompt");
  if (await hasHorizontalScroll(page)) fail("horizontal scroll on q1 @390px");
  else pass("no horizontal scroll on q1 @390px");

  await page.route("**/api/scan/report*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(makeReportPayload(seriesAOpsHeavy, "layouttest1", port)),
    });
  });
  await page.goto(`${base}/scan/r/layouttest1`);
  await page.waitForSelector(".scan-map");
  if (await hasHorizontalScroll(page)) fail("horizontal scroll on map/report @390px");
  else pass("no horizontal scroll on map/report @390px");

  console.log("\n=== Session persistence ===\n");
  await page.unrouteAll();
  await page.goto(`${base}/scan`);
  await page.evaluate(
    ({ key, session }) => sessionStorage.setItem(key, JSON.stringify(session)),
    {
      key: SCAN_STORAGE_KEY,
      session: {
        step: "question",
        questionIndex: 7,
        answers: { q1: "team_1_10", q2: "bootstrapped" },
        result: null,
      },
    },
  );
  await page.reload();
  const q8visible = await page.locator(".scan-question-prompt").textContent();
  if (!q8visible?.toLowerCase().includes("waiting")) {
    fail(`refresh persistence: expected q8, got: ${q8visible?.slice(0, 60)}`);
  } else {
    pass("refresh mid-flow restores question step");
  }

  console.log("\n=== Bad slug ===\n");
  await page.route("**/api/scan/report*", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, error: "not-found" }),
    });
  });
  await page.goto(`${base}/scan/r/invalidslug1`);
  await page.waitForSelector(".scan-missing");
  const missing = await page.locator(".scan-missing").textContent();
  if (!missing?.toLowerCase().includes("couldn't load")) {
    fail("bad slug: missing friendly error");
  } else {
    pass("bad slug shows clean missing state");
  }

  await browser.close();

  console.log(`\n=== Summary: ${passes.length} passed, ${failures.length} failed ===\n`);
  if (failures.length) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
