import type { QuestionId, ScanQuestion } from "./types";

export const SCAN_QUESTIONS: ScanQuestion[] = [
  {
    id: "q1",
    section: "A",
    prompt: "How big is your team?",
    multiSelect: false,
    options: [
      { id: "team_1_10", label: "1–10" },
      { id: "team_11_25", label: "11–25" },
      { id: "team_26_80", label: "26–80" },
      { id: "team_80_plus", label: "80+" },
    ],
  },
  {
    id: "q2",
    section: "A",
    prompt: "Which best describes your company?",
    multiSelect: false,
    options: [
      { id: "bootstrapped", label: "Bootstrapped/pre-seed" },
      { id: "seed", label: "Seed-funded" },
      { id: "series_a_plus", label: "Series A or later" },
      { id: "established", label: "Established/profitable" },
    ],
  },
  {
    id: "q3",
    section: "A",
    prompt: "What's your role?",
    multiSelect: false,
    options: [
      { id: "founder_ceo", label: "Founder/CEO" },
      { id: "exec", label: "Exec (COO/CTO/VP)" },
      { id: "eng_lead", label: "Engineering lead" },
      { id: "ops_cs_lead", label: "Ops/CS lead" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q4",
    section: "A",
    prompt: "What's your business model?",
    multiSelect: false,
    options: [
      { id: "b2b_saas", label: "B2B SaaS" },
      { id: "services_agency", label: "Services/agency" },
      { id: "marketplace", label: "Marketplace" },
      { id: "ecommerce_dtc", label: "E-commerce/DTC" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q5",
    section: "B",
    prompt: "Where does your team lose the most hours each week?",
    multiSelect: true,
    maxSelections: 3,
    options: [
      { id: "support_tickets", label: "Support tickets & customer questions" },
      {
        id: "manual_entry",
        label: "Manual data entry & handoffs between tools",
      },
      { id: "reporting", label: "Reporting & spreadsheet wrangling" },
      { id: "sales_followup", label: "Sales follow-up & outreach" },
      { id: "content_docs", label: "Writing content/docs/proposals" },
      { id: "onboarding", label: "Customer onboarding" },
      { id: "internal_questions", label: "Answering the same internal questions" },
    ],
  },
  {
    id: "q6",
    section: "B",
    prompt: "What's the #1 number you're trying to move this year?",
    multiSelect: false,
    options: [
      { id: "revenue", label: "Revenue growth" },
      { id: "cost_burn", label: "Cost / burn" },
      { id: "shipping_speed", label: "Shipping speed" },
      { id: "retention", label: "Retention/churn" },
      { id: "more_without_hiring", label: "Doing more without hiring" },
    ],
  },
  {
    id: "q7",
    section: "B",
    prompt: "If you could clone one person tomorrow, whose work would the clone do?",
    multiSelect: false,
    options: [
      { id: "clone_support", label: "Support" },
      { id: "clone_sales", label: "Sales" },
      { id: "clone_ops", label: "Ops/admin" },
      { id: "clone_engineering", label: "Engineering" },
      { id: "clone_analyst", label: "Analyst/reporting" },
    ],
  },
  {
    id: "q8",
    section: "B",
    prompt:
      "How often are customers waiting on something a human at your company has to do manually?",
    multiSelect: false,
    options: [
      { id: "constantly", label: "Constantly" },
      { id: "daily", label: "Daily" },
      { id: "sometimes", label: "Sometimes" },
      { id: "rarely", label: "Rarely" },
    ],
  },
  {
    id: "q9",
    section: "B",
    prompt:
      "Rough guess: hours per week your team spends on repetitive work a clear set of rules could describe?",
    multiSelect: false,
    options: [
      { id: "hours_under_10", label: "Under 10" },
      { id: "hours_10_40", label: "10–40" },
      { id: "hours_40_100", label: "40–100" },
      { id: "hours_100_plus", label: "100+" },
    ],
  },
  {
    id: "q10",
    section: "C",
    prompt: "Where do AI features stand in your product?",
    multiSelect: false,
    options: [
      { id: "live_production", label: "Live in production" },
      {
        id: "prototype_never_shipped",
        label: "We built a prototype that never fully shipped",
      },
      { id: "on_roadmap", label: "On the roadmap, not started" },
      { id: "not_applicable", label: "Not really applicable to our product" },
    ],
  },
  {
    id: "q11",
    section: "C",
    prompt: "Are competitors shipping AI features?",
    multiSelect: false,
    options: [
      { id: "costing_deals", label: "Yes, and it's costing us deals" },
      { id: "unclear_impact", label: "Yes, but unclear impact" },
      { id: "not_yet", label: "Not yet" },
      { id: "dont_know", label: "Don't know" },
    ],
  },
  {
    id: "q12",
    section: "C",
    prompt: "What have you already tried with AI?",
    multiSelect: true,
    options: [
      { id: "chatgpt_adhoc", label: "ChatGPT/Claude ad-hoc" },
      { id: "coding_copilots", label: "Coding copilots" },
      { id: "internal_pilot", label: "An internal pilot or hackathon project" },
      {
        id: "hired_owner",
        label: 'Assigned/hired someone to "figure out AI"',
      },
      { id: "vendor_tool", label: "Bought a vendor tool" },
      { id: "nothing_formal", label: "Nothing formal yet" },
    ],
  },
  {
    id: "q13",
    section: "C",
    prompt: "What's stopped AI efforts from sticking so far?",
    multiSelect: false,
    options: [
      { id: "havent_tried", label: "Haven't really tried" },
      { id: "no_time", label: "No time to build it properly" },
      { id: "trust_outputs", label: "Couldn't trust the outputs" },
      { id: "not_wired", label: "It was never wired into our actual tools" },
      { id: "nobody_owns", label: "Nobody owns it" },
      { id: "data_mess", label: "Our data was a mess" },
    ],
  },
  {
    id: "q14",
    section: "D",
    prompt: "Where does your operational data mostly live?",
    multiSelect: false,
    options: [
      { id: "modern_saas", label: "A modern SaaS stack (CRM, helpdesk, etc.)" },
      { id: "spreadsheets", label: "Spreadsheets" },
      { id: "custom_dbs", label: "Custom/internal databases" },
      { id: "scattered", label: "Honestly, scattered everywhere" },
    ],
  },
  {
    id: "q15",
    section: "D",
    prompt: "Engineering capacity for AI work?",
    multiSelect: false,
    options: [
      { id: "dedicated_team", label: "Dedicated team with bandwidth" },
      { id: "no_bandwidth", label: "Engineers, but zero bandwidth" },
      { id: "no_engineers", label: "No engineers in-house" },
    ],
  },
  {
    id: "q16",
    section: "D",
    prompt: "How standardized are your core processes?",
    multiSelect: false,
    options: [
      { id: "documented", label: "Documented and consistent" },
      { id: "in_heads", label: "Consistent, but they live in people's heads" },
      { id: "varies", label: "Honestly, varies by person" },
    ],
  },
  {
    id: "q17",
    section: "D",
    prompt: "Any constraints we should know about?",
    multiSelect: true,
    options: [
      { id: "regulated", label: "Regulated industry / compliance" },
      { id: "sensitive_data", label: "Sensitive customer data" },
      { id: "none", label: "None of these" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q18",
    section: "E",
    prompt:
      "If the scan surfaces a high-leverage opportunity, when would you want it live?",
    multiSelect: false,
    options: [
      { id: "this_quarter", label: "This quarter" },
      { id: "next_6_months", label: "Next 6 months" },
      { id: "just_exploring", label: "Just exploring for now" },
    ],
  },
  {
    id: "q19",
    section: "E",
    prompt:
      "Budget reality: how would you fund an AI build with a clear ROI case?",
    multiSelect: false,
    options: [
      { id: "dedicated_budget", label: "We have dedicated budget" },
      { id: "roi_contingent", label: "We'd find budget for clear ROI" },
      { id: "no_budget", label: "No budget this year" },
    ],
  },
];

const questionMap = new Map(SCAN_QUESTIONS.map((question) => [question.id, question]));

export function getQuestion(id: QuestionId): ScanQuestion {
  const question = questionMap.get(id);
  if (!question) {
    throw new Error(`Unknown question id: ${id}`);
  }
  return question;
}

export function getOptionLabel(
  questionId: QuestionId,
  optionId: string,
): string | undefined {
  return getQuestion(questionId).options.find((option) => option.id === optionId)
    ?.label;
}

export function getAnswerLabels(
  questionId: QuestionId,
  answer: string | string[] | undefined,
): string[] {
  if (!answer) {
    return [];
  }
  const ids = Array.isArray(answer) ? answer : [answer];
  return ids
    .map((id) => getOptionLabel(questionId, id))
    .filter((label): label is string => Boolean(label));
}

export function getSelections(
  answers: Partial<Record<QuestionId, string | string[]>>,
  questionId: QuestionId,
): string[] {
  const value = answers[questionId];
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function getSingleAnswer(
  answers: Partial<Record<QuestionId, string | string[]>>,
  questionId: QuestionId,
): string | undefined {
  const value = answers[questionId];
  if (!value) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}
