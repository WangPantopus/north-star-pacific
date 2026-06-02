# North Star Pacific — Sales document templates

Ready-to-send Word templates for converting a lead into paid work.

| File | When you use it |
|------|-----------------|
| `North_Star_Pacific_Proposal_Template.docx` | After a lead comes in — send this to win the engagement (usually the Growth Audit). |
| `North_Star_Pacific_Statement_of_Work_Template.docx` | Once they say yes — this scopes the work, sets acceptance criteria and payment, and gets signed. |
| `North_Star_Pacific_Growth_Audit_Template.docx` | The report you hand the client *during* the audit — technology map, pain map, opportunity scorecard, top-3 recommendations, recommended first project, and a 30/90-day roadmap. The roadmap then feeds a Proposal + SOW for the build. |
| `North_Star_Pacific_Lead_Triage_Checklist.docx` | **Internal.** Run it on each inbound lead before replying — capture their form answers, weigh fit signals vs watch-outs, decide (strong / possible / pass), and take the next action. Includes a ready-to-send first-reply snippet. |

## How to use

1. Open the file in Word (or Google Docs / Pages).
2. Replace every **`[bracketed placeholder]`** with the specifics for that client.
3. Delete the small italic *"For a build engagement…"* helper notes once you've adapted the section.
4. Export to PDF and send.

## Before first use — global find & replace

- `[your-email]` — in the footer of both docs → your real contact email.
- The Proposal's price table already matches your published pricing; update if your prices change.
- The SOW's bracketed fields (fee, payment split, dates, decision maker, deliverables + acceptance criteria) are filled per engagement.

## Notes

- The SOW implements the blueprint's scope-control rules: written scope, acceptance criteria per deliverable, a named client decision maker, a change-request process, and an access-control/data-flow review for sensitive integrations.
- These are practical business templates, not legal advice — have a lawyer review the SOW terms (IP, liability, termination) before relying on them at scale.
- Source generator: `/tmp/nsp-docs/build.js` (re-run to regenerate if you want to tweak styling).
