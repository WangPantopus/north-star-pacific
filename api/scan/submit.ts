import { getSurfacedZones, getTopZone, scoreScan } from "../../src/lib/scan/score";
import {
  buildBookingUrl,
  scanEmailBody,
  scanEmailSubject,
  isAuditRoute,
} from "../../src/lib/scan/reportTemplates";
import { createScanSlug } from "../../src/lib/scan/slug";
import {
  validateNameField,
  validateScanAnswers,
  validateWorkEmail,
} from "../../src/lib/scan/validateAnswers";
import { getClientIp, parseJsonBody, siteOrigin, type ApiReq, type ApiRes } from "../_lib/http";
import { checkRateLimit } from "../_lib/rateLimit";
import { sendPlainEmail } from "../_lib/resend";
import { insertScanResponse } from "../_lib/supabase";

type SubmitBody = {
  answers?: unknown;
  email?: unknown;
  firstName?: unknown;
  company?: unknown;
};

async function insertWithUniqueSlug(
  row: Omit<Parameters<typeof insertScanResponse>[0], "id">,
): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const slug = createScanSlug();
    try {
      await insertScanResponse({ ...row, id: slug });
      return slug;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("409") || message.includes("23505")) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("slug-collision");
}

export default async function handler(req: ApiReq, res: ApiRes) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(`scan-submit:${ip}`)) {
    return res.status(429).json({ ok: false, error: "rate-limited" });
  }

  const body = parseJsonBody(req.body) as SubmitBody | null;
  if (!body) {
    return res.status(400).json({ ok: false, error: "invalid-json" });
  }

  const validatedAnswers = validateScanAnswers(body.answers);
  if (!validatedAnswers.ok) {
    return res.status(400).json({ ok: false, error: validatedAnswers.error });
  }

  const email = validateWorkEmail(body.email);
  const firstName = validateNameField(body.firstName);
  const company = validateNameField(body.company);

  if (!email || !firstName || !company) {
    return res.status(400).json({ ok: false, error: "invalid-contact-fields" });
  }

  const result = scoreScan(validatedAnswers.answers);
  const surfacedZones = getSurfacedZones(result).map((zone) => ({
    id: zone.id,
    impact: zone.impact,
    effort: zone.effort,
    priority: zone.priority,
    lean: zone.lean,
    surfaced: zone.surfaced,
  }));

  let slug: string;
  try {
    slug = await insertWithUniqueSlug({
      answers: validatedAnswers.answers,
      readiness: result.readiness,
      band: result.band,
      surfaced_zones: surfacedZones,
      route: result.route,
      email,
      first_name: firstName,
      company,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "storage-failed";
    if (message === "supabase-not-configured") {
      console.error("Scan submit: Supabase not configured");
      return res.status(503).json({ ok: false, error: "storage-not-configured" });
    }
    console.error("Scan submit storage error", error);
    return res.status(502).json({ ok: false, error: "storage-failed" });
  }

  const origin = siteOrigin();
  const reportUrl = `${origin}/scan/r/${slug}`;
  const topZone = getTopZone(result);
  const calendlyUrl = process.env.CALENDLY_URL?.trim() ?? "";
  const bookingUrl =
    topZone && isAuditRoute(result.route) && calendlyUrl
      ? buildBookingUrl(calendlyUrl, slug)
      : null;

  if (topZone) {
    try {
      await sendPlainEmail({
        to: email,
        subject: scanEmailSubject(topZone),
        text: scanEmailBody({
          firstName,
          result,
          topZone,
          reportUrl,
          bookingUrl,
        }),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "email-failed";
      if (message === "email-not-configured") {
        console.info("Scan saved; email not configured", { slug, email });
      } else {
        console.error("Scan email failed (non-fatal)", error);
      }
    }
  }

  return res.status(200).json({ ok: true, id: slug, reportUrl });
}
