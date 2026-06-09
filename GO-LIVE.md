# Go-live setup — booking, payments & lead email

Your site already works today: the enquiry form falls back to emailing you directly, so no lead is ever lost. These steps switch on the *full* flow (email delivery and a scheduler button). Total time: ~15–20 minutes.

All of this is configured by **environment variables in Vercel** — no code changes. After setting them, **redeploy**.

> Where to set them: Vercel → your project → **Settings → Environment Variables** → add each one → **Deployments → Redeploy**.

---

## 1. Lead email — so form submissions hit your inbox

Right now a real submission shows the user a prefilled email to you (the fallback). Turn on automatic delivery:

1. Create a free account at **[resend.com](https://resend.com)**.
2. Verify a sending domain (recommended), or use Resend's onboarding sender to start.
3. Create an **API key**.
4. Add these env vars in Vercel:

   | Variable | Value |
   |----------|-------|
   | `RESEND_API_KEY` | your Resend key |
   | `LEAD_TO_EMAIL` | `north-star-pacific@pantopus.com` |
   | `LEAD_FROM_EMAIL` *(optional)* | `North Star Pacific <north-star-pacific@pantopus.com>` |

5. Redeploy.

✅ Now a form submission emails you and shows the user the success screen (no more mailto fallback). The code path lives in [api/lead.ts](api/lead.ts).

---

## 2. Scheduler — the "Book an AI Opportunity Call" button

1. Create a free account at **[cal.com](https://cal.com)** (or Calendly).
2. Make an event type, e.g. **"AI Opportunity Call"**, 20 min.
3. Copy its public link, e.g. `https://cal.com/your-handle/ai-opportunity-call`.
4. Add the env var → redeploy:

   | Variable | Value |
   |----------|-------|
   | `VITE_BOOKING_URL` | your Cal.com/Calendly link |

✅ The "Book an AI Opportunity Call" button appears automatically wherever it's wired in [config.ts](src/config.ts).

---

## 3. Paid audit — direct payment (optional, disabled by default)

> ⚠️ **Keep `VITE_PAYMENT_LINK` empty** until the AI Opportunity Audit has a fixed scope, clear terms, and a reliable pre-purchase qualification flow. The audit scope can vary materially; direct payment should only be enabled when you have a standardized SKU.

When ready:

1. In **[Stripe](https://dashboard.stripe.com)**, create a Product: **"AI Opportunity Audit"**, price **$2,500** (or your fixed entry scope).
2. Create a **Payment Link** for it.
3. Add the env var → redeploy:

   | Variable | Value |
   |----------|-------|
   | `VITE_PAYMENT_LINK` | your Stripe Payment Link |

---

## Build-time vs. runtime (why redeploy matters)

- **`VITE_*`** vars (`VITE_BOOKING_URL`, `VITE_PAYMENT_LINK`, `VITE_CONTACT_EMAIL`, `VITE_AUDIT_PRICE`) are baked into the site **at build time** → you **must redeploy** after changing them.
- **`RESEND_API_KEY` / `LEAD_TO_EMAIL`** are read by the serverless function **at request time** → redeploy is still the clean way to apply them.

---

## Don't forget — legal placeholders

In [public/privacy.html](public/privacy.html) and [public/terms.html](public/terms.html):
- Contact email on the site is `north-star-pacific@pantopus.com` (override with `VITE_CONTACT_EMAIL` if needed).
- Set the governing-law jurisdiction in `terms.html` (search `GOVERNING LAW`).

---

## Smoke test (after deploying)

- [ ] Open the live site, scroll to **"Start a conversation"**.
- [ ] Submit the form with a test entry → you see the success screen **and** an email lands in `LEAD_TO_EMAIL`.
- [ ] "Book an AI Opportunity Call" opens your scheduler.
- [ ] `/privacy.html` and `/terms.html` load and show the right email.

---

### Want me to wire it instead?
Once you've created the accounts, just paste me the **booking link** (and confirm the contact email), and I'll set the config, redeploy locally to verify, and run the smoke test with you.
