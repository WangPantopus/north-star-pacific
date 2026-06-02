/**
 * Vercel serverless function — receives lead-form submissions from the site.
 *
 * Works in tiers so the site is never broken:
 *   - Email configured  -> sends you the lead via Resend, returns 200.
 *   - Not configured    -> returns 503 so the browser falls back to a prefilled
 *                          mailto: link (no lead is ever lost).
 *
 * To enable email delivery, set these environment variables in Vercel
 * (Project -> Settings -> Environment Variables), then redeploy:
 *   RESEND_API_KEY   - API key from https://resend.com
 *   LEAD_TO_EMAIL    - inbox where leads should land (e.g. your email)
 *   LEAD_FROM_EMAIL  - optional verified sender; defaults to Resend's sandbox
 *
 * This file is built and run by Vercel, not by the frontend Vite build, so it
 * is intentionally excluded from the app's tsconfig and eslint config.
 */

// Minimal request/response typing — Vercel supplies the real Node types at deploy.
type Req = {
  method?: string;
  body?: unknown;
};
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type LeadBody = {
  name?: string;
  email?: string;
  business?: string;
  need?: string;
  pain?: string;
  tools?: string;
  budget?: string;
  timeline?: string;
  company_website?: string; // honeypot
};

function parseBody(raw: unknown): LeadBody {
  if (raw && typeof raw === "object") return raw as LeadBody;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as LeadBody;
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  }

  const body = parseBody(req.body);

  // Honeypot: a bot filled the hidden field. Pretend success, send nothing.
  if (body.company_website) {
    return res.status(200).json({ ok: true });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const need = (body.need ?? "").trim();

  if (!name || !email || !need) {
    return res.status(400).json({ ok: false, error: "missing-required-fields" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;

  // Email isn't set up yet — tell the client so it can fall back to mailto.
  if (!apiKey || !to) {
    console.info("Lead received (email not configured):", { name, email, need });
    return res.status(503).json({ ok: false, error: "email-not-configured" });
  }

  const from =
    process.env.LEAD_FROM_EMAIL ?? "North Star Pacific <onboarding@resend.dev>";

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Business: ${body.business || "—"}`,
    `Needs help with: ${need}`,
    `Budget: ${body.budget || "—"}`,
    `Timeline: ${body.timeline || "—"}`,
    `Current tools: ${body.tools || "—"}`,
    "",
    "Biggest pain:",
    body.pain || "—",
  ].join("\n");

  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New audit lead — ${name}${body.business ? ` (${body.business})` : ""}`,
        text,
      }),
    });

    if (!resp.ok) {
      console.error("Resend error", resp.status, await resp.text());
      return res.status(502).json({ ok: false, error: "send-failed" });
    }

    // Best-effort acknowledgement to the lead. Sending to an arbitrary recipient
    // requires a verified domain in Resend; if that's not set up yet this fails
    // quietly and the founder notification above has already gone out.
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [email],
          subject: "Thanks — we got your message · North Star Pacific",
          text: [
            `Hi ${name.split(" ")[0] || "there"},`,
            "",
            "Thanks for reaching out to North Star Pacific. We've received your message and will get back to you within one business day.",
            "",
            `What you told us you need: ${need}`,
            "",
            "If anything is urgent, just reply to this email.",
            "",
            "— North Star Pacific",
            "Business technology for growing businesses",
          ].join("\n"),
        }),
      });
    } catch (ackErr) {
      console.error("Lead autoresponder failed (non-fatal)", ackErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Lead handler error", err);
    return res.status(502).json({ ok: false, error: "send-failed" });
  }
}
