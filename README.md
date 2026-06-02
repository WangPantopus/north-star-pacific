# North Star Pacific

Marketing site + lead/booking flow for North Star Pacific — a business-technology partner for growing businesses.

Built with **React 19 + TypeScript + Vite**, deployed on **Vercel**.

## Local development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (tsc) + production build
npm run lint     # eslint
```

> The lead API (`/api/lead`) only runs under Vercel's serverless runtime. With plain `npm run dev` the form gracefully falls back to a prefilled email, so no lead is ever lost. To exercise the function locally, use `vercel dev`.

## How the lead / booking flow works

- **Booking section** — the `BookAudit` component in `src/App.tsx` (anchor `#book`): the lead-capture form plus optional "Book a call" and "Start your audit" buttons. Every site CTA points here.
- **`api/lead.ts`** — Vercel serverless function. Emails you each lead via [Resend](https://resend.com), sends the lead an autoresponder, and returns `503` (→ the form uses a prefilled `mailto:` fallback) when email isn't configured yet. Includes a honeypot spam field.
- **`src/config.ts`** — single source of truth for the booking link, payment link, contact email, and audit price. Each is overridable via a `VITE_*` env var.

## Going live

See **[GO-LIVE.md](GO-LIVE.md)** for the step-by-step: Resend (email delivery), Cal.com/Calendly (scheduler), Stripe (payment link), and the exact Vercel environment variables.

> ⚠️ Replace the placeholder domain `northstarpacific.com` (in `index.html`, `public/sitemap.xml`, and `public/robots.txt`) with your real live domain before launch.

## What's where

| Path | What |
|------|------|
| `src/App.tsx`, `src/App.css` | The single-page site |
| `api/lead.ts` | Lead serverless function (Resend + autoresponder) |
| `src/config.ts` | Booking / payment / contact config |
| `public/privacy.html`, `public/terms.html` | Legal pages |
| `public/og.png`, `apple-touch-icon.png`, `icon-512.png`, `site.webmanifest` | Social image + app icons |
| `public/robots.txt`, `public/sitemap.xml` | SEO |
| `templates/` | Sales docs: Proposal, SOW, Growth Audit report, Lead triage checklist |

Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS) are set in `vercel.json`.

## Deploy

Configured for Vercel via `vercel.json` (build: `npm run build`, output: `dist`). Push to the connected repo, or run `vercel --prod`.
