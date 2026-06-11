import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";
import { seriesAOpsHeavy } from "../src/lib/scan/fixtures";
import { scoreScan } from "../src/lib/scan/score";

const port = 4173;
const base = `http://127.0.0.1:${port}`;

async function main() {
  const slug = "qaops01";
  const result = scoreScan(seriesAOpsHeavy);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.route("**/api/scan/report*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        report: {
          id: slug,
          createdAt: new Date().toISOString(),
          contact: { email: "qa@example.com", firstName: "QA", company: "Test Co" },
          result,
          bookingUrl: "https://calendly.com/example?scan_id=" + slug,
        },
      }),
    });
  });

  await page.goto(`${base}/scan/r/${slug}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".scan-report");

  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );

  console.log(`REPORT axe violations: ${results.violations.length} total, ${serious.length} serious/critical`);
  if (serious.length) {
    for (const v of serious) {
      console.error(`  - ${v.id}: ${v.description} (${v.nodes.length} nodes)`);
    }
    process.exit(1);
  }

  // Lighthouse-style proxy: 0 serious violations ≈ high a11y score (component tests + axe)
  console.log("REPORT accessibility: pass (0 serious/critical axe violations @390px)");
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
