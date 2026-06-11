# The AI Opportunity Scan — Full Product Spec
### North Star Pacific · The productized front door
**Status:** v1 spec, ready to build · **Companion to:** north-star-pacific-ai-wedge-rebuild.md

---

## 1. What this is, and the one insight that makes it work

The Scan is a self-serve, ~5-minute interactive assessment that lives on the NSP site. A visitor answers 19 questions about their company, their pain, and their stack. They get back a personalized mini opportunity map: their **AI Readiness Score**, their **top 2–3 opportunity zones** plotted on the same impact-vs-effort grid the real audit uses, and an honest **buy / build / wait** lean on each — plus exactly what a real audit would verify that a 19-question scan can't.

It is the $2,500 AI Opportunity Audit *in trailer form*. Impressive, genuinely useful, and honestly incomplete.

**The insight that makes this more than a lead magnet:** the Scan does four jobs at once.

1. **Funnel.** "Take the 5-minute scan" is a radically lower-friction cold-outbound CTA than "book a $2,500 audit." It converts strangers into qualified, segmented leads.
2. **Demo of craft.** The Scan itself is a shipped, production AI-adjacent product on day one. It goes in the Work section. A consultancy whose lead magnet is a polished working system — not an ebook — *is the pitch*. This is why it cannot be a Typeform.
3. **Intake automation.** Every Scan completion becomes the pre-read for the audit call. The audit starts warm ("we reviewed your scan — let's go deeper on the two zones it flagged") and saves you ~an hour of discovery per engagement. You're productizing the front door and the delivery at the same time.
4. **Content engine.** Aggregate, anonymized Scan data becomes your AI point of view: "We scanned 50 funded companies. 62% lose 40+ hours a week to work AI could absorb. Here's what's actually stopping them." That's the inbound flywheel the wedge doc calls for.

---

## 2. Product principles (the rules that keep it honest)

1. **Demonstrate the thinking, don't give away the audit.** The Scan gives directional zones and honest leans. The audit gives company-specific build plans, real costs, real timelines. The report explicitly names what the Scan *can't* know — that candor is the bridge, not a weakness.
2. **Ask about work, never about tech.** No "do you use RAG?" questions. Every question is about hours, numbers, bottlenecks, and frustrations. The respondent should feel *seen*, not quizzed.
3. **Never invent their numbers.** The report uses ranges and "companies like yours typically…" framing. No fabricated ROI figures. The brand is honesty; the Scan must embody it.
4. **Tell some people no.** Respondents who aren't a fit get a genuinely useful report and a non-audit path (resources, newsletter). "We'll tell you what to skip" has to be true at the top of the funnel too — and it protects your solo-founder time.
5. **Five minutes, hard ceiling.** One question per screen, visible progress, no required free-text. Friction is the enemy of completion; completion is the product.

---

## 3. The flow

```
Entry (site CTA / outbound link / LinkedIn)
  → Intro screen (what you'll get, "5 minutes, 19 questions, no email to start")
  → Section A: Context (4 q)
  → Section B: Where the pain is (5 q)
  → Section C: Product & AI ambitions (4 q)
  → Section D: Feasibility (4 q)
  → Section E: Intent (2 q)
  → INSTANT PARTIAL RESULT (no gate): Readiness Score + band + #1 zone name
  → Email gate: "Get your full opportunity map" → email + name + company
  → Full report (web page + emailed PDF/link)
  → CTA routing:
       Qualified  → Book the AI Opportunity Audit (Calendly, scan attached)
       Nurture    → Starter resources + newsletter + "when you're ready"
```

Design notes: same navigation-console visual system as the site. The partial result *before* the gate is deliberate — proving value first lifts email capture dramatically, and withholding everything reads as bait.

---

## 4. The question set

Answer options in brackets. Every question feeds scoring (Section 5); the mapping column shows what it drives. Zones: **PROD** (AI in your product), **OPS** (operations automation), **CX** (customer-facing AI), **DATA** (data & insights), **GLUE** (automations & integrations), **RESCUE** (pilot to production).

### Section A — Context (qualification & sizing)

| # | Question | Options | Feeds |
|---|---|---|---|
| 1 | How big is your team? | 1–10 · 11–25 · 26–80 · 80+ | Routing, narrative |
| 2 | Which best describes your company? | Bootstrapped/pre-seed · Seed-funded · Series A or later · Established/profitable | Routing |
| 3 | What's your role? | Founder/CEO · Exec (COO/CTO/VP) · Engineering lead · Ops/CS lead · Other | Routing, report voice |
| 4 | What's your business model? | B2B SaaS · Services/agency · Marketplace · E-commerce/DTC · Other | Zone applicability |

### Section B — Where the pain is (impact signal)

| # | Question | Options | Feeds |
|---|---|---|---|
| 5 | Where does your team lose the most hours each week? *(pick up to 3)* | Support tickets & customer questions · Manual data entry & handoffs between tools · Reporting & spreadsheet wrangling · Sales follow-up & outreach · Writing content/docs/proposals · Customer onboarding · Answering the same internal questions | Impact: CX/GLUE/DATA/OPS per selection |
| 6 | What's the #1 number you're trying to move this year? | Revenue growth · Cost / burn · Shipping speed · Retention/churn · Doing more without hiring | Impact multiplier |
| 7 | If you could clone one person tomorrow, whose work would the clone do? | Support · Sales · Ops/admin · Engineering · Analyst/reporting | Impact: zone tiebreaker |
| 8 | How often are customers waiting on something a human at your company has to do manually? | Constantly · Daily · Sometimes · Rarely | Impact: CX, GLUE |
| 9 | Rough guess: hours per week your team spends on repetitive work a clear set of rules could describe? | Under 10 · 10–40 · 40–100 · 100+ | Impact: OPS (and headline stat) |

### Section C — Product & AI ambitions

| # | Question | Options | Feeds |
|---|---|---|---|
| 10 | Where do AI features stand in your product? | Live in production · We built a prototype that never fully shipped · On the roadmap, not started · Not really applicable to our product | PROD impact; **RESCUE trigger** |
| 11 | Are competitors shipping AI features? | Yes, and it's costing us deals · Yes, but unclear impact · Not yet · Don't know | PROD impact, urgency |
| 12 | What have you already tried with AI? *(pick all)* | ChatGPT/Claude ad-hoc · Coding copilots · An internal pilot or hackathon project · Assigned/hired someone to "figure out AI" · Bought a vendor tool · Nothing formal yet | Readiness, narrative |
| 13 | What's stopped AI efforts from sticking so far? | Haven't really tried · No time to build it properly · Couldn't trust the outputs · It was never wired into our actual tools · Nobody owns it · Our data was a mess | Readiness, objection handling in report |

### Section D — Feasibility (effort signal)

| # | Question | Options | Feeds |
|---|---|---|---|
| 14 | Where does your operational data mostly live? | A modern SaaS stack (CRM, helpdesk, etc.) · Spreadsheets · Custom/internal databases · Honestly, scattered everywhere | Effort: all zones; DATA gate |
| 15 | Engineering capacity for AI work? | Dedicated team with bandwidth · Engineers, but zero bandwidth · No engineers in-house | Effort, framing (build *with* vs *for*) |
| 16 | How standardized are your core processes? | Documented and consistent · Consistent, but they live in people's heads · Honestly, varies by person | Effort: OPS/CX |
| 17 | Any constraints we should know about? *(pick all)* | Regulated industry / compliance · Sensitive customer data · None of these · Not sure | Effort modifier, report caveats |

### Section E — Intent (qualification)

| # | Question | Options | Feeds |
|---|---|---|---|
| 18 | If the scan surfaces a high-leverage opportunity, when would you want it live? | This quarter · Next 6 months · Just exploring for now | Routing |
| 19 | Budget reality: how would you fund an AI build with a clear ROI case? | We have dedicated budget · We'd find budget for clear ROI · No budget this year | Routing |

---

## 5. The scoring model (deterministic, unit-testable)

Three outputs: **(a)** a per-zone Impact score, **(b)** a per-zone Effort score, **(c)** a global AI Readiness Score. All pure functions of the answers — no LLM in the scoring path.

### 5a. Zone Impact (0–10 per zone)

Base points per answer (sum, cap at 10):

- **Q5 selections:** Support tickets → CX +3 · Manual entry/handoffs → GLUE +3, OPS +1 · Reporting → DATA +3 · Sales follow-up → OPS +2, GLUE +1 · Content/docs → OPS +2 · Onboarding → CX +2, GLUE +1 · Internal questions → DATA +2, OPS +1
- **Q7 clone:** Support → CX +2 · Sales → OPS +2 · Ops/admin → OPS +2, GLUE +1 · Engineering → PROD +2 · Analyst → DATA +3
- **Q8:** Constantly → CX +3, GLUE +2 · Daily → CX +2, GLUE +1 · Sometimes → CX +1
- **Q9:** 100+ → OPS +3 · 40–100 → OPS +2 · 10–40 → OPS +1
- **Q10:** Live in production → PROD +1 (expand) · Prototype never shipped → **RESCUE +5** · On roadmap → PROD +3 · N/A → PROD = 0, RESCUE = 0 (zones hidden)
- **Q11:** Costing us deals → PROD +3 · Unclear impact → PROD +1
- **Q4 model gate:** Services/agency → PROD capped at 4 unless Q10 = roadmap/prototype; E-comm → CX +1

**Alignment multiplier (Q6):** the zone that most directly serves their #1 number gets ×1.4 — Revenue → PROD, CX · Cost/burn → OPS, GLUE · Shipping speed → PROD, RESCUE · Retention → CX, DATA · More without hiring → OPS, GLUE. (Apply after summing, before capping.)

### 5b. Zone Effort (1 = easy … 5 = hard)

Start every zone at 2, then:

- **Q14:** Modern SaaS stack → CX/OPS/GLUE −1 · Scattered → all zones +1, DATA +2 · Spreadsheets → DATA +1 · Custom DBs → GLUE +1
- **Q15:** No engineers in-house → PROD +1, RESCUE +1 (note: framed as "we build it for you," not a disqualifier) · Dedicated team → all −0 (they could DIY; report says so honestly)
- **Q16:** Varies by person → OPS +1, CX +1 · Documented → OPS −1
- **Q17:** Compliance/regulated → all +1 · Sensitive data → CX +1
- Clamp 1–5.

### 5c. Priority & selection

`Priority(zone) = Impact × (6 − Effort)`. Rank zones; surface the **top 2–3** (only zones with Impact ≥ 4; if RESCUE triggered, it always surfaces — a stalled prototype is the single warmest signal in the funnel). All six zones still plot on the 2×2 grid (x = effort, y = impact) so the report visually mirrors the real audit deliverable.

### 5d. AI Readiness Score (0–100, the headline number)

| Component | Max | Rule |
|---|---|---|
| Data readiness | 25 | Modern stack 25 · Custom DBs 18 · Spreadsheets 12 · Scattered 5 |
| Process clarity | 20 | Documented 20 · In heads 12 · Varies 5 |
| Engineering capacity | 15 | Dedicated 15 · No bandwidth 10 · None in-house 6 |
| AI experience | 15 | Any pilot/vendor/owner 12–15 · Ad-hoc ChatGPT only 8 · Nothing 4 |
| Commitment | 25 | Budget (Q19): 12/8/2 + Timeline (Q18): 13/8/3 |

**Bands:** 75–100 **AI-Ready Builder** · 50–74 **Strong Foundation** · 25–49 **Quick Wins First** · 0–24 **Foundations First**. The band drives the report's opening verdict and tone.

### 5e. Buy / build / wait leans (the honesty engine)

Rules per surfaced zone — and yes, some outputs say "don't hire us yet":

- **CX**, team ≤ 10, no product-AI ambition → **Buy lean:** "At your volume, start with an off-the-shelf support AI. Building custom isn't worth it yet — here's when that flips."
- **CX**, 26+ or sensitive data or onboarding pain → **Build:** custom, wired into their stack.
- **PROD** → **Build** by definition (it's *their* product; no vendor sells their differentiation).
- **RESCUE** → **Build:** "The expensive part is done. The last mile — reliability, integration, real use — is exactly what kills prototypes, and exactly what we do."
- **OPS** with documented processes + modern stack → **Build, high confidence** (best feasibility profile in the model).
- **OPS/CX** with "varies by person" processes → **Build, but standardize the process inside the project** (named explicitly — this is real consulting insight, free).
- **DATA** with scattered data → **Wait:** "Fix the foundation first; AI on top of scattered data automates confusion." (Then: foundations are themselves a scoped engagement.)
- **GLUE**, modern stack, simple handoffs → **Buy/Build hybrid:** "Some of this is honestly a Zapier afternoon — we'll tell you which parts. The rest needs real engineering."

### 5f. Lead routing

**Qualified** = (Stage ∈ {Seed, Series A+, Established} **or** team ≥ 26) **and** Q19 ∈ {dedicated, ROI-contingent} **and** Q18 ≠ "just exploring."
Everyone else → **Nurture**. Both get the full report; only the CTA block differs (see 6e). Edge case: "just exploring" but Series A+ with high readiness → soft-qualified (audit CTA shown second, resources first).

---

## 6. The report (web page + emailed link/PDF)

Same visual system as the site. Five sections, in order:

### 6a. The verdict (headline)
Score dial + band + a two-sentence verdict assembled from band + top zone. Sample (Strong Foundation, OPS top):

> **Your AI Readiness Score: 68 — Strong Foundation.**
> You have the data and the processes to put AI to work now — what's missing is the build. The scan flags **operations automation** as your highest-leverage zone: you told us your team burns 40–100 hours a week on rule-describable work, and your stack makes most of it automatable.

### 6b. Your top opportunity zones (2–3 cards)
Each card: zone name · **why the scan flagged it** (echoing *their* answers verbatim — this is what makes it feel bespoke) · what companies like them typically see (ranges only) · the buy/build/wait lean, stated plainly. Sample card:

> **Zone 1 — Operations automation · Lean: BUILD**
> You said manual data entry and reporting eat the most hours, your #1 goal is doing more without hiring, and your processes are documented and consistent. That combination is the single best feasibility profile we see: rule-describable work + clean processes + a modern stack. Companies with this profile typically reclaim 30–60% of the flagged hours within a quarter of shipping. This is a build — no off-the-shelf tool knows your workflows.

### 6c. The full map
The 2×2 (impact vs. effort), all six zones plotted, top zones highlighted in the warm accent. Caption: *"This is the same map the full audit produces — built from 19 answers instead of two weeks inside your business."*

### 6d. What this scan can't know (the bridge)
The candor section, verbatim copy:

> A 19-question scan can rank zones. It can't see your actual data, talk to your team, read your codebase, or price a build. The full AI Opportunity Audit does — and turns your top zone into a concrete build plan: what we'd build, how it wires into your stack, real cost, real timeline, and an honest buy/build/wait call you can hold us to.

### 6e. The CTA block
- **Qualified:** *Book your AI Opportunity Audit — from $2,500. Your scan results come with you; we start where it left off.* [Book] + secondary: [See a sample audit]
- **Nurture:** *Honestly? You don't need a $2,500 audit yet.* → top-zone starter resources + newsletter + "When you're funded/bigger/ready, your scan will be waiting." (This paragraph will get screenshotted and shared. That's the point.)

### 6f. The email they receive
Subject: **Your AI opportunity map: [Top Zone] is your highest-leverage move.** Body: score, top zone, one-line lean, link to full report, CTA matching their route. Plain text, founder voice, no marketing-speak.

---

## 7. Implementation plan

**Architecture (v1):**
- **Frontend:** one React/Next.js route on the NSP site. State machine for the 19 questions, one per screen, progress bar, mobile-first (outbound clicks are mostly mobile).
- **Scoring:** pure TypeScript function `score(answers) → {readiness, band, zones[], leans[], route}`. Deterministic, unit-tested against ~10 fixture personas (write the fixtures from §5 before the UI).
- **Narrative:** v1 ships with template-assembled copy (band + zone + echoed answers slotted into pre-written sentences — §6 samples are the templates). **v1.1** adds one Claude API call that rewrites the verdict and zone-card paragraphs from a strict template + their answers, temperature low, schema-validated. Deterministic skeleton, personalized skin — bespoke feel, zero hallucinated numbers.
- **Storage:** Postgres/Supabase (or Airtable for week one): answers, score, route, email, timestamp. This table *is* the outbound CRM seed and the content-engine dataset.
- **Email:** Resend. **Booking:** Calendly link with scan ID passed through, so every audit call has the pre-read attached automatically.
- **Report:** web page first (shareable URL); PDF export in v1.1, not v1.

**Build order & effort (you, solo):**
1. Scoring function + fixtures — half a day
2. Question flow UI — 1 day
3. Report page + templates — 1 day
4. Email gate, storage, Resend, Calendly pass-through — half a day
**v1 total: ~3 focused days.** v1.1 (Claude narrative + PDF): +1 day.

**Why not a Typeform MVP:** principle #2. The Scan is the proof of "we build and ship." A Typeform proves you can configure a Typeform. The three days are the marketing spend.

---

## 8. Distribution (the Scan is the outbound CTA)

1. **Site:** hero secondary CTA becomes *"Not ready for the audit? Take the 5-minute Scan"*; the Scan also anchors the Work section as shipped proof.
2. **Cold outbound to recently-funded companies** (the wedge doc's channel): the email CTA changes from "book a $2,500 audit" (high friction, stranger) to "here's a 5-minute scan that'll show you your top AI opportunity" (low friction, immediate value). Expect this to multiply outbound conversion — that's the funnel math the whole project rests on.
3. **LinkedIn/content:** every aggregate stat from the response table is a post. Monthly: "What we learned scanning N companies."
4. **The audit call itself:** opens with their scan. Discovery starts at minute zero.

---

## 9. Metrics that decide if it's working

| Metric | Target (first 90 days) |
|---|---|
| Scan start → completion | ≥ 60% |
| Completion → email capture | ≥ 70% |
| Qualified share of completions | ≥ 25% |
| Qualified → audit call booked | 5–10% |
| Audit calls sourced by Scan | The number that matters |

If completion is low → cut questions (B and C compress first). If capture is low → richer partial result before the gate. If qualified-but-no-booking → the report's bridge section (6d) is the suspect.

---

## 10. v2 backlog (explicitly not now)

- Claude-powered free-text question ("describe your messiest workflow") with extraction into the scoring model
- Industry benchmarking ("you vs. other 26–80-person B2B SaaS companies") once N > 50
- Team mode (multiple respondents per company, gap analysis between founder and ops answers — this gap is itself a sellable insight)
- White-label scan as a deliverable inside AI Partner retainers

---

*One rule above all: every word of the report must sound like the audit's author — direct, specific, honest about limits. If a sentence could appear in a generic AI consultancy's lead magnet, cut it.*
