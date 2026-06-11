import { scoreScan } from "../../src/lib/scan/score";
import { buildBookingUrl, isAuditRoute } from "../../src/lib/scan/reportTemplates";
import type { ScanAnswers } from "../../src/lib/scan/types";
import { siteOrigin, type ApiReq, type ApiRes } from "../_lib/http";
import { fetchScanResponse } from "../_lib/supabase";

const SLUG_RE = /^[a-z0-9]{8,12}$/;

type ReportReq = ApiReq & {
  query?: Record<string, string | string[] | undefined>;
};

export default async function handler(req: ReportReq, res: ApiRes) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  }

  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (typeof id !== "string" || !SLUG_RE.test(id)) {
    return res.status(400).json({ ok: false, error: "invalid-id" });
  }

  let row;
  try {
    row = await fetchScanResponse(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "storage-failed";
    if (message === "supabase-not-configured") {
      return res.status(503).json({ ok: false, error: "storage-not-configured" });
    }
    console.error("Scan report fetch error", error);
    return res.status(502).json({ ok: false, error: "storage-failed" });
  }

  if (!row) {
    return res.status(404).json({ ok: false, error: "not-found" });
  }

  const answers = row.answers as ScanAnswers;
  const result = scoreScan(answers);
  const calendlyUrl = process.env.CALENDLY_URL?.trim() ?? "";
  const bookingUrl =
    isAuditRoute(result.route) && calendlyUrl
      ? buildBookingUrl(calendlyUrl, row.id)
      : null;

  return res.status(200).json({
    ok: true,
    report: {
      id: row.id,
      createdAt: row.created_at,
      contact: {
        email: row.email,
        firstName: row.first_name,
        company: row.company,
      },
      result,
      bookingUrl,
      auditBooked: row.audit_booked,
      reportUrl: `${siteOrigin()}/scan/r/${row.id}`,
    },
  });
}
