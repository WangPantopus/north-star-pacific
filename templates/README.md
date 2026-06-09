# North Star Pacific — Sales document templates

Ready-to-send Word templates for converting a lead into paid work.

> **Naming note:** Existing `.docx` files may still use "Growth Audit" in the filename. Rename or regenerate them to **AI Opportunity Audit** when you next update the templates.

| File | When you use it |
|------|-----------------|
| `North_Star_Pacific_Proposal_Template.docx` | After a lead comes in — send this to win the engagement (usually the AI Opportunity Audit or the next scoped build). |
| `North_Star_Pacific_Statement_of_Work_Template.docx` | Once they say yes — scopes the work, sets acceptance criteria and payment, and gets signed. |
| `North_Star_Pacific_Growth_Audit_Template.docx` | **Rename to** `North_Star_Pacific_AI_Opportunity_Audit_Template.docx` when updated. The report you hand the client *during* the audit — current AI usage map, workflow and data review, ranked opportunities, buy / build / wait recommendations, enablement and governance requirements, implementation plan, success metrics, and a 30/90-day roadmap. The roadmap then feeds a Proposal + SOW for the build. |
| `North_Star_Pacific_Lead_Triage_Checklist.docx` | **Internal.** Run on each inbound lead before replying. Capture form answers plus: current AI stage, target workflow, data and tool context, adoption blockers, risk flags, and the business metric that would make the work worthwhile. Decide (strong / possible / pass) and take the next action. Includes a ready-to-send first-reply snippet. |

## Published offer ladder (keep templates aligned)

| Offer | Starting from | Role |
|-------|---------------|------|
| AI Opportunity Audit | $2,500 | Front door — one clearly bounded business area |
| AI Team Enablement Sprint | $5,000 | Training, playbooks, guardrails, first repeatable workflows |
| AI Workflow Quick Build | $8,000 | One automation, assistant, integration, or AI feature in production |
| AI Implementation Sprint | $20,000 | Meaningful AI system or modernization across workflows, apps, data |
| Custom AI / Business System | $40,000 | Substantial production system, platform, or app rebuild |
| AI Operating Partner | $5,000/mo | Ongoing enablement, implementation, governance, and optimization |

Final scope and pricing are always confirmed in a written Statement of Work before work begins.

## How to use

1. Open the file in Word (or Google Docs / Pages).
2. Replace every **`[bracketed placeholder]`** with the specifics for that client.
3. Delete the small italic *"For a build engagement…"* helper notes once you've adapted the section.
4. Export to PDF and send.

## Before first use — global find & replace

- `[your-email]` — in the footer of both docs → `north-star-pacific@pantopus.com`.
- **Growth Audit** → **AI Opportunity Audit** anywhere it still appears in template copy.
- **$1,500** → **$2,500** for the entry audit scope (one bounded business area).
- The Proposal's price table should match the published ladder above; update if prices change.
- The SOW's bracketed fields (fee, payment split, dates, decision maker, deliverables + acceptance criteria) are filled per engagement.

## Notes

- The SOW should reflect scope-control rules: written scope, acceptance criteria per deliverable, a named client decision maker, a change-request process, and an access-control/data-flow review before touching sensitive systems or AI tools.
- Lead triage should record the lead's **current AI stage** (from the website form), not just their stated need.
- These are practical business templates, not legal advice — have a lawyer review the SOW terms (IP, liability, termination) before relying on them at scale.
- Source generator: `/tmp/nsp-docs/build.js` (re-run to regenerate if you want to tweak styling).
