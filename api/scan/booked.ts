import { type ApiReq, type ApiRes } from "../_lib/http";
import { markScanBooked } from "../_lib/supabase";

const SLUG_RE = /^[a-z0-9]{8,12}$/;

type BookedReq = ApiReq & {
  query?: Record<string, string | string[] | undefined>;
};

export default async function handler(req: BookedReq, res: ApiRes) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  }

  const rawId = req.query?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (typeof id !== "string" || !SLUG_RE.test(id)) {
    return res.status(400).json({ ok: false, error: "invalid-id" });
  }

  try {
    const updated = await markScanBooked(id);
    if (!updated) {
      return res.status(502).json({ ok: false, error: "update-failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "storage-failed";
    if (message === "supabase-not-configured") {
      return res.status(503).json({ ok: false, error: "storage-not-configured" });
    }
    console.error("Scan booked update error", error);
    return res.status(502).json({ ok: false, error: "storage-failed" });
  }
}
