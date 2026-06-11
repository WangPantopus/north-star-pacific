import { getAnswerLabels, getSelections, getSingleAnswer } from "./questions";
import type {
  LeanType,
  ReadinessBand,
  ScanAnswers,
  ScanResult,
  ScanRoute,
  ZoneId,
  ZoneResult,
} from "./types";

const ALL_ZONES: ZoneId[] = [
  "PROD",
  "OPS",
  "CX",
  "DATA",
  "GLUE",
  "RESCUE",
];

const Q6_ALIGNMENT: Record<string, ZoneId[]> = {
  revenue: ["PROD", "CX"],
  cost_burn: ["OPS", "GLUE"],
  shipping_speed: ["PROD", "RESCUE"],
  retention: ["CX", "DATA"],
  more_without_hiring: ["OPS", "GLUE"],
};

const Q5_IMPACT: Record<string, Partial<Record<ZoneId, number>>> = {
  support_tickets: { CX: 3 },
  manual_entry: { GLUE: 3, OPS: 1 },
  reporting: { DATA: 3 },
  sales_followup: { OPS: 2, GLUE: 1 },
  content_docs: { OPS: 2 },
  onboarding: { CX: 2, GLUE: 1 },
  internal_questions: { DATA: 2, OPS: 1 },
};

const Q7_IMPACT: Record<string, Partial<Record<ZoneId, number>>> = {
  clone_support: { CX: 2 },
  clone_sales: { OPS: 2 },
  clone_ops: { OPS: 2, GLUE: 1 },
  clone_engineering: { PROD: 2 },
  clone_analyst: { DATA: 3 },
};

const Q8_IMPACT: Record<string, Partial<Record<ZoneId, number>>> = {
  constantly: { CX: 3, GLUE: 2 },
  daily: { CX: 2, GLUE: 1 },
  sometimes: { CX: 1 },
};

const Q9_IMPACT: Record<string, Partial<Record<ZoneId, number>>> = {
  hours_100_plus: { OPS: 3 },
  hours_40_100: { OPS: 2 },
  hours_10_40: { OPS: 1 },
};

const Q10_IMPACT: Record<string, Partial<Record<ZoneId, number>>> = {
  live_production: { PROD: 1 },
  prototype_never_shipped: { RESCUE: 5 },
  on_roadmap: { PROD: 3 },
  not_applicable: { PROD: 0, RESCUE: 0 },
};

const Q11_IMPACT: Record<string, Partial<Record<ZoneId, number>>> = {
  costing_deals: { PROD: 3 },
  unclear_impact: { PROD: 1 },
};

function emptyZoneScores(): Record<ZoneId, number> {
  return {
    PROD: 0,
    OPS: 0,
    CX: 0,
    DATA: 0,
    GLUE: 0,
    RESCUE: 0,
  };
}

function addImpact(
  scores: Record<ZoneId, number>,
  deltas: Partial<Record<ZoneId, number>>,
): void {
  for (const zone of ALL_ZONES) {
    scores[zone] += deltas[zone] ?? 0;
  }
}

function capImpact(scores: Record<ZoneId, number>): void {
  for (const zone of ALL_ZONES) {
    scores[zone] = Math.min(10, scores[zone]);
  }
}

function applyAlignmentMultiplier(
  scores: Record<ZoneId, number>,
  goal: string | undefined,
): void {
  if (!goal) {
    return;
  }
  const aligned = Q6_ALIGNMENT[goal];
  if (!aligned) {
    return;
  }
  for (const zone of aligned) {
    scores[zone] *= 1.4;
  }
}

function computeZoneImpact(answers: ScanAnswers): Record<ZoneId, number> {
  const scores = emptyZoneScores();

  for (const selection of getSelections(answers, "q5")) {
    addImpact(scores, Q5_IMPACT[selection] ?? {});
  }

  const clone = getSingleAnswer(answers, "q7");
  if (clone) {
    addImpact(scores, Q7_IMPACT[clone] ?? {});
  }

  const waitFrequency = getSingleAnswer(answers, "q8");
  if (waitFrequency) {
    addImpact(scores, Q8_IMPACT[waitFrequency] ?? {});
  }

  const hours = getSingleAnswer(answers, "q9");
  if (hours) {
    addImpact(scores, Q9_IMPACT[hours] ?? {});
  }

  const aiStatus = getSingleAnswer(answers, "q10");
  if (aiStatus) {
    addImpact(scores, Q10_IMPACT[aiStatus] ?? {});
  }

  const competitors = getSingleAnswer(answers, "q11");
  if (competitors) {
    addImpact(scores, Q11_IMPACT[competitors] ?? {});
  }

  applyAlignmentMultiplier(scores, getSingleAnswer(answers, "q6"));

  const model = getSingleAnswer(answers, "q4");
  if (model === "ecommerce_dtc") {
    scores.CX += 1;
  }

  if (model === "services_agency") {
    const allowsProd =
      aiStatus === "on_roadmap" || aiStatus === "prototype_never_shipped";
    if (!allowsProd) {
      scores.PROD = Math.min(scores.PROD, 4);
    }
  }

  capImpact(scores);
  return scores;
}

function computeZoneEffort(answers: ScanAnswers): Record<ZoneId, number> {
  const effort: Record<ZoneId, number> = {
    PROD: 2,
    OPS: 2,
    CX: 2,
    DATA: 2,
    GLUE: 2,
    RESCUE: 2,
  };

  const dataLocation = getSingleAnswer(answers, "q14");
  switch (dataLocation) {
    case "modern_saas":
      effort.CX -= 1;
      effort.OPS -= 1;
      effort.GLUE -= 1;
      break;
    case "scattered":
      for (const zone of ALL_ZONES) {
        effort[zone] += 1;
      }
      effort.DATA += 2;
      break;
    case "spreadsheets":
      effort.DATA += 1;
      break;
    case "custom_dbs":
      effort.GLUE += 1;
      break;
  }

  const engineering = getSingleAnswer(answers, "q15");
  if (engineering === "no_engineers") {
    effort.PROD += 1;
    effort.RESCUE += 1;
  }

  const processes = getSingleAnswer(answers, "q16");
  if (processes === "varies") {
    effort.OPS += 1;
    effort.CX += 1;
  } else if (processes === "documented") {
    effort.OPS -= 1;
  }

  const constraints = getSelections(answers, "q17");
  if (constraints.includes("regulated")) {
    for (const zone of ALL_ZONES) {
      effort[zone] += 1;
    }
  }
  if (constraints.includes("sensitive_data")) {
    effort.CX += 1;
  }

  for (const zone of ALL_ZONES) {
    effort[zone] = Math.max(1, Math.min(5, effort[zone]));
  }

  return effort;
}

function computeReadiness(answers: ScanAnswers): number {
  let score = 0;

  const dataLocation = getSingleAnswer(answers, "q14");
  switch (dataLocation) {
    case "modern_saas":
      score += 25;
      break;
    case "custom_dbs":
      score += 18;
      break;
    case "spreadsheets":
      score += 12;
      break;
    case "scattered":
      score += 5;
      break;
  }

  const processes = getSingleAnswer(answers, "q16");
  switch (processes) {
    case "documented":
      score += 20;
      break;
    case "in_heads":
      score += 12;
      break;
    case "varies":
      score += 5;
      break;
  }

  const engineering = getSingleAnswer(answers, "q15");
  switch (engineering) {
    case "dedicated_team":
      score += 15;
      break;
    case "no_bandwidth":
      score += 10;
      break;
    case "no_engineers":
      score += 6;
      break;
  }

  const tried = getSelections(answers, "q12");
  const hasStructuredExperience =
    tried.includes("internal_pilot") ||
    tried.includes("hired_owner") ||
    tried.includes("vendor_tool");
  const hasAdHocOnly =
    (tried.includes("chatgpt_adhoc") || tried.includes("coding_copilots")) &&
    !hasStructuredExperience;

  if (hasStructuredExperience) {
    score += 15;
  } else if (hasAdHocOnly) {
    score += 8;
  } else if (tried.includes("nothing_formal") || tried.length === 0) {
    score += 4;
  }

  const budget = getSingleAnswer(answers, "q19");
  switch (budget) {
    case "dedicated_budget":
      score += 12;
      break;
    case "roi_contingent":
      score += 8;
      break;
    case "no_budget":
      score += 2;
      break;
  }

  const timeline = getSingleAnswer(answers, "q18");
  switch (timeline) {
    case "this_quarter":
      score += 13;
      break;
    case "next_6_months":
      score += 8;
      break;
    case "just_exploring":
      score += 3;
      break;
  }

  return Math.min(100, score);
}

function readinessBand(score: number): ReadinessBand {
  if (score >= 75) {
    return "ai_ready";
  }
  if (score >= 50) {
    return "strong_foundation";
  }
  if (score >= 25) {
    return "quick_wins";
  }
  return "foundations_first";
}

function isSmallTeam(answers: ScanAnswers): boolean {
  return getSingleAnswer(answers, "q1") === "team_1_10";
}

function isLargeTeam(answers: ScanAnswers): boolean {
  const team = getSingleAnswer(answers, "q1");
  return team === "team_26_80" || team === "team_80_plus";
}

function hasProductAiAmbition(answers: ScanAnswers): boolean {
  const status = getSingleAnswer(answers, "q10");
  return status === "live_production" || status === "prototype_never_shipped";
}

function hasOnboardingPain(answers: ScanAnswers): boolean {
  return getSelections(answers, "q5").includes("onboarding");
}

function hasSensitiveData(answers: ScanAnswers): boolean {
  return getSelections(answers, "q17").includes("sensitive_data");
}

function hasScatteredData(answers: ScanAnswers): boolean {
  return getSingleAnswer(answers, "q14") === "scattered";
}

function hasModernStack(answers: ScanAnswers): boolean {
  return getSingleAnswer(answers, "q14") === "modern_saas";
}

function hasDocumentedProcesses(answers: ScanAnswers): boolean {
  return getSingleAnswer(answers, "q16") === "documented";
}

function hasVariedProcesses(answers: ScanAnswers): boolean {
  return getSingleAnswer(answers, "q16") === "varies";
}

function hasSimpleHandoffs(answers: ScanAnswers): boolean {
  return getSelections(answers, "q5").includes("manual_entry");
}

function isRescueTriggered(answers: ScanAnswers): boolean {
  return getSingleAnswer(answers, "q10") === "prototype_never_shipped";
}

function computeLean(
  zone: ZoneId,
  answers: ScanAnswers,
): { lean: LeanType; leanReason: string } {
  if (zone === "PROD") {
    return {
      lean: "build",
      leanReason:
        "It's your product — no vendor sells your differentiation. This is a build.",
    };
  }

  if (zone === "RESCUE") {
    return {
      lean: "build",
      leanReason:
        "The expensive part is done. The last mile — reliability, integration, real use — is exactly what kills prototypes, and exactly what we do.",
    };
  }

  if (zone === "DATA" && hasScatteredData(answers)) {
    return {
      lean: "wait",
      leanReason:
        "Fix the foundation first; AI on top of scattered data automates confusion. Foundations work is itself a scoped engagement.",
    };
  }

  if (
    zone === "CX" &&
    isSmallTeam(answers) &&
    !hasProductAiAmbition(answers)
  ) {
    return {
      lean: "buy",
      leanReason:
        "At your volume, start with an off-the-shelf support AI. Building custom isn't worth it yet — here's when that flips.",
    };
  }

  if (
    zone === "CX" &&
    (isLargeTeam(answers) || hasSensitiveData(answers) || hasOnboardingPain(answers))
  ) {
    return {
      lean: "build",
      leanReason:
        "Your scale, data sensitivity, or onboarding pain calls for custom CX AI wired into your stack.",
    };
  }

  if (zone === "OPS" && hasDocumentedProcesses(answers) && hasModernStack(answers)) {
    return {
      lean: "build",
      leanReason:
        "Rule-describable work + clean processes + a modern stack is the single best feasibility profile we see. High-confidence build.",
    };
  }

  if ((zone === "OPS" || zone === "CX") && hasVariedProcesses(answers)) {
    return {
      lean: "build",
      leanReason:
        "Build — but standardize the process inside the project. That's real consulting insight, not a footnote.",
    };
  }

  if (zone === "GLUE" && hasModernStack(answers) && hasSimpleHandoffs(answers)) {
    return {
      lean: "hybrid",
      leanReason:
        "Some of this is honestly a Zapier afternoon — we'll tell you which parts. The rest needs real engineering.",
    };
  }

  if (zone === "OPS" || zone === "GLUE") {
    return {
      lean: "build",
      leanReason:
        "Operations automation at your profile typically needs custom wiring into your workflows.",
    };
  }

  if (zone === "CX") {
    return {
      lean: "build",
      leanReason:
        "Customer-facing AI at your profile typically needs custom wiring into your stack.",
    };
  }

  if (zone === "DATA") {
    return {
      lean: "build",
      leanReason:
        "Data and insights work at your profile typically needs a focused build on top of your existing sources.",
    };
  }

  return {
    lean: "build",
    leanReason: "This zone calls for a focused build tailored to your business.",
  };
}

function buildEchoes(zone: ZoneId, answers: ScanAnswers): string[] {
  const echoes: string[] = [];
  const q5 = getSelections(answers, "q5");

  const zonePainMap: Partial<Record<ZoneId, string[]>> = {
    CX: ["support_tickets", "onboarding"],
    GLUE: ["manual_entry", "sales_followup", "onboarding"],
    DATA: ["reporting", "internal_questions"],
    OPS: [
      "manual_entry",
      "sales_followup",
      "content_docs",
      "internal_questions",
    ],
  };

  const painIds = zonePainMap[zone];
  if (painIds) {
    for (const id of painIds) {
      if (q5.includes(id)) {
        const label = getAnswerLabels("q5", id)[0];
        if (label) {
          echoes.push(`you said ${label.toLowerCase()} eats the most hours`);
        }
      }
    }
  }

  const clone = getSingleAnswer(answers, "q7");
  const cloneZoneMap: Record<string, ZoneId> = {
    clone_support: "CX",
    clone_sales: "OPS",
    clone_ops: "OPS",
    clone_engineering: "PROD",
    clone_analyst: "DATA",
  };
  if (clone && cloneZoneMap[clone] === zone) {
    const label = getAnswerLabels("q7", clone)[0];
    if (label) {
      echoes.push(`you'd clone your ${label.toLowerCase()} person first`);
    }
  }

  const waitFrequency = getSingleAnswer(answers, "q8");
  if (zone === "CX" || zone === "GLUE") {
    if (waitFrequency === "constantly") {
      echoes.push(
        "customers are constantly waiting on manual work from your team",
      );
    } else if (waitFrequency === "daily") {
      echoes.push("customers wait on manual work from your team daily");
    } else if (waitFrequency === "sometimes") {
      echoes.push("customers sometimes wait on manual work from your team");
    }
  }

  const hours = getSingleAnswer(answers, "q9");
  if (zone === "OPS" && hours) {
    const label = getAnswerLabels("q9", hours)[0];
    if (label) {
      echoes.push(
        `you said your team spends ${label.toLowerCase()} hours a week on rule-describable work`,
      );
    }
  }

  const goal = getSingleAnswer(answers, "q6");
  const goalZones = goal ? Q6_ALIGNMENT[goal] : undefined;
  if (goal && goalZones?.includes(zone)) {
    const label = getAnswerLabels("q6", goal)[0];
    if (label) {
      echoes.push(`your #1 goal this year is ${label.toLowerCase()}`);
    }
  }

  const aiStatus = getSingleAnswer(answers, "q10");
  if (zone === "PROD" && aiStatus) {
    const label = getAnswerLabels("q10", aiStatus)[0];
    if (label) {
      echoes.push(`you said AI features are: ${label.toLowerCase()}`);
    }
  }

  if (zone === "RESCUE" && aiStatus === "prototype_never_shipped") {
    echoes.push(
      "you built a prototype that never fully shipped — the warmest rescue signal we see",
    );
  }

  const competitors = getSingleAnswer(answers, "q11");
  if (zone === "PROD" && competitors === "costing_deals") {
    echoes.push("competitor AI features are costing you deals");
  }

  if (zone === "DATA" && hasScatteredData(answers)) {
    echoes.push("your operational data is scattered everywhere");
  }

  if (
    (zone === "OPS" || zone === "CX") &&
    getSingleAnswer(answers, "q16") === "varies"
  ) {
    echoes.push("your core processes vary by person");
  }

  if (
    zone === "OPS" &&
    getSingleAnswer(answers, "q16") === "documented" &&
    hasModernStack(answers)
  ) {
    echoes.push("your processes are documented and your stack is modern SaaS");
  }

  return echoes;
}

function computeRoute(
  answers: ScanAnswers,
  readiness: number,
): ScanRoute {
  const stage = getSingleAnswer(answers, "q2");
  const budget = getSingleAnswer(answers, "q19");
  const timeline = getSingleAnswer(answers, "q18");

  const qualifiedStage =
    stage === "seed" ||
    stage === "series_a_plus" ||
    stage === "established";
  const qualifiedBudget =
    budget === "dedicated_budget" || budget === "roi_contingent";
  const notExploring = timeline !== "just_exploring";

  if ((qualifiedStage || isLargeTeam(answers)) && qualifiedBudget && notExploring) {
    return "qualified";
  }

  if (
    timeline === "just_exploring" &&
    stage === "series_a_plus" &&
    readiness >= 75
  ) {
    return "soft_qualified";
  }

  return "nurture";
}

function headlineStat(answers: ScanAnswers): string | null {
  const hours = getSingleAnswer(answers, "q9");
  if (!hours || hours === "hours_under_10") {
    return null;
  }
  return getAnswerLabels("q9", hours)[0] ?? null;
}

function selectSurfacedZones(
  zones: ZoneResult[],
  rescueTriggered: boolean,
): void {
  const eligible = zones
    .filter((zone) => zone.impact >= 4)
    .sort((a, b) => b.priority - a.priority);

  const surfacedIds = new Set<ZoneId>();
  for (const zone of eligible.slice(0, 3)) {
    surfacedIds.add(zone.id);
  }

  if (rescueTriggered) {
    surfacedIds.add("RESCUE");
  }

  for (const zone of zones) {
    zone.surfaced = surfacedIds.has(zone.id);
  }
}

export function scoreScan(answers: ScanAnswers): ScanResult {
  const impact = computeZoneImpact(answers);
  const effort = computeZoneEffort(answers);
  const readiness = computeReadiness(answers);
  const rescueTriggered = isRescueTriggered(answers);

  const zones: ZoneResult[] = ALL_ZONES.map((id) => {
    const zoneImpact = Math.round(impact[id] * 10) / 10;
    const zoneEffort = effort[id];
    const priority = zoneImpact * (6 - zoneEffort);
    const { lean, leanReason } = computeLean(id, answers);

    return {
      id,
      impact: zoneImpact,
      effort: zoneEffort,
      priority,
      surfaced: false,
      lean,
      leanReason,
      echoes: buildEchoes(id, answers),
    };
  });

  selectSurfacedZones(zones, rescueTriggered);

  return {
    readiness,
    band: readinessBand(readiness),
    zones,
    route: computeRoute(answers, readiness),
    headlineStat: headlineStat(answers),
  };
}

export function getSurfacedZones(result: ScanResult): ZoneResult[] {
  return result.zones
    .filter((zone) => zone.surfaced)
    .sort((a, b) => b.priority - a.priority);
}

export function getTopZone(result: ScanResult): ZoneResult | undefined {
  return getSurfacedZones(result)[0];
}
