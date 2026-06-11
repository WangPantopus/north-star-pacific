/**
 * Voice rule: direct, specific, honest about limits. If a sentence could appear
 * in a generic AI consultancy's lead magnet, cut it.
 */
import type {
  LeanType,
  ReadinessBand,
  ScanResult,
  ScanRoute,
  ZoneId,
  ZoneResult,
} from "./types";

export type ReportContact = {
  email: string;
  firstName: string;
  company: string;
};

const BAND_LABELS: Record<ReadinessBand, string> = {
  ai_ready: "AI-Ready Builder",
  strong_foundation: "Strong Foundation",
  quick_wins: "Quick Wins First",
  foundations_first: "Foundations First",
};

const ZONE_LABELS: Record<ZoneId, string> = {
  PROD: "AI in your product",
  OPS: "operations automation",
  CX: "customer-facing AI",
  DATA: "data & insights",
  GLUE: "automations & integrations",
  RESCUE: "pilot to production",
};

const ZONE_LABELS_TITLE: Record<ZoneId, string> = {
  PROD: "AI in your product",
  OPS: "Operations automation",
  CX: "Customer-facing AI",
  DATA: "Data & insights",
  GLUE: "Automations & integrations",
  RESCUE: "Pilot to production",
};

const LEAN_LABELS: Record<LeanType, string> = {
  buy: "BUY",
  build: "BUILD",
  wait: "WAIT",
  hybrid: "HYBRID",
};

const BAND_OPENINGS: Record<ReadinessBand, string> = {
  ai_ready:
    "You're set up to move — data, process, and intent line up.",
  strong_foundation:
    "You have the data and the processes to put AI to work now — what's missing is the build.",
  quick_wins:
    "There are real wins on the table — a focused first build beats a broad AI program.",
  foundations_first:
    "Honest read: shore up data and process foundations first, then AI pays off faster.",
};

const VERDICT_SECOND_SENTENCE: Record<
  ReadinessBand,
  Partial<Record<ZoneId, string>>
> = {
  ai_ready: {
    OPS: "The scan flags {zone} as your highest-leverage zone: {echo}, and your stack makes most of it automatable.",
    PROD: "The scan flags {zone} as your highest-leverage zone: {echo} — differentiation you can't buy off the shelf.",
    CX: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    DATA: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    GLUE: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    RESCUE: "The scan flags {zone} as your highest-leverage zone: {echo} — the expensive part is already built.",
  },
  strong_foundation: {
    OPS: "The scan flags {zone} as your highest-leverage zone: {echo}, and your stack makes most of it automatable.",
    PROD: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    CX: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    DATA: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    GLUE: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    RESCUE: "The scan flags {zone} as your highest-leverage zone: {echo}.",
  },
  quick_wins: {
    OPS: "The scan flags {zone} as your highest-leverage zone: {echo} — a tight first automation beats a sprawling program.",
    PROD: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    CX: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    DATA: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    GLUE: "The scan flags {zone} as your highest-leverage zone: {echo}.",
    RESCUE: "The scan flags {zone} as your highest-leverage zone: {echo}.",
  },
  foundations_first: {
    OPS: "The scan flags {zone} as your highest-leverage zone: {echo} — but fix data and handoffs before you scale automation.",
    PROD: "The scan flags {zone} as your highest-leverage zone: {echo} — product AI still needs clean inputs underneath.",
    CX: "The scan flags {zone} as your highest-leverage zone: {echo} — start narrow once the basics are stable.",
    DATA: "The scan flags {zone} as your highest-leverage zone: {echo} — scattered data has to come first.",
    GLUE: "The scan flags {zone} as your highest-leverage zone: {echo} — wire the basics before you add intelligence.",
    RESCUE: "The scan flags {zone} as your highest-leverage zone: {echo} — reliability work still needs a sane data floor.",
  },
};

/** Range claims copied verbatim from the spec — no invented numbers elsewhere. */
const ZONE_TYPICAL_OUTCOMES: Record<ZoneId, string> = {
  OPS: "Companies with this profile typically reclaim 30–60% of the flagged hours within a quarter of shipping.",
  PROD:
    "Product teams that ship here typically see AI show up in demos and renewals before it shows up in ops metrics.",
  CX: "Teams at your stage typically see fewer repeat tickets and faster first responses once support AI is wired in.",
  DATA:
    "Once data lives in one place, analytics and AI on top tend to compound — the audit checks whether you're there yet.",
  GLUE:
    "Some handoffs are honestly an afternoon of integration work; the rest needs engineering — we'll tell you which is which.",
  RESCUE:
    "Teams with a stalled prototype typically unblock production in weeks, not quarters, once the last mile is scoped.",
};

const NURTURE_POINTERS: Record<ZoneId, string[]> = {
  PROD: [
    "Ship one narrow AI feature customers can touch — not a platform rewrite.",
    "Benchmark competitor AI in your sales calls; note what prospects ask for by name.",
    "Pick a single user workflow and prototype against real data before you hire for it.",
  ],
  OPS: [
    "List the three workflows that eat the most hours — if you can't describe them, AI can't automate them yet.",
    "Start with one documented process in your existing SaaS stack before buying new tools.",
    "Track hours on rule-describable work for two weeks; that's your ROI numerator.",
  ],
  CX: [
    "Try an off-the-shelf support AI on one channel before building custom.",
    "Pull your top twenty ticket types — if they're repetitive, you're ready for automation.",
    "Measure time-to-first-response before and after any pilot; keep the bar honest.",
  ],
  DATA: [
    "Pick one source of truth for operational metrics before layering AI on top.",
    "Retire one spreadsheet that three people maintain differently.",
    "Document the five questions leadership asks every week — that's your first dashboard.",
  ],
  GLUE: [
    "Map handoffs between your top three tools on paper before automating them.",
    "Try Zapier on the simplest handoff; keep a list of what breaks at volume.",
    "Name an owner for integrations — nobody owns it means nothing sticks.",
  ],
  RESCUE: [
    "List what broke when the prototype met real users — that's the real scope.",
    "Run the prototype against production data once; note every manual workaround.",
    "Define 'shipped' as one paying customer using it weekly, not a demo.",
  ],
};

export const SCAN_CANT_KNOW_COPY =
  "A 19-question scan can rank zones. It can't see your actual data, talk to your team, read your codebase, or price a build. The full AI Opportunity Audit does — and turns your top zone into a concrete build plan: what we'd build, how it wires into your stack, real cost, real timeline, and an honest buy/build/wait call you can hold us to.";

export const MAP_CAPTION_COPY =
  "This is the same map the full audit produces — built from 19 answers instead of two weeks inside your business.";

export function bandDisplayName(band: ReadinessBand): string {
  return BAND_LABELS[band];
}

export function zoneDisplayName(zoneId: ZoneId, titled = false): string {
  return titled ? ZONE_LABELS_TITLE[zoneId] : ZONE_LABELS[zoneId];
}

export function leanDisplayName(lean: LeanType): string {
  return LEAN_LABELS[lean];
}

function formatEchoClause(zone: ZoneResult, headlineStat: string | null): string {
  if (zone.echoes.length > 0) {
    return zone.echoes.slice(0, 2).join(", ");
  }
  if (headlineStat && zone.id === "OPS") {
    return `you said your team spends ${headlineStat.toLowerCase()} hours a week on rule-describable work`;
  }
  return "your answers point to real leverage here";
}

function fillVerdictTemplate(
  template: string,
  zone: ZoneResult,
  headlineStat: string | null,
): string {
  return template
    .replaceAll("{zone}", zoneDisplayName(zone.id))
    .replaceAll("{echo}", formatEchoClause(zone, headlineStat));
}

export function verdictHeadline(result: ScanResult): string {
  return `Your AI Readiness Score: ${result.readiness} — ${bandDisplayName(result.band)}.`;
}

export function verdictBody(result: ScanResult, topZone: ZoneResult): string {
  const opening = BAND_OPENINGS[result.band];
  const template =
    VERDICT_SECOND_SENTENCE[result.band][topZone.id] ??
    `The scan flags {zone} as your highest-leverage zone: {echo}.`;
  const second = fillVerdictTemplate(template, topZone, result.headlineStat);
  return `${opening} ${second}`;
}

export function partialZoneTeaser(result: ScanResult, topZone: ZoneResult): string {
  const echo = formatEchoClause(topZone, result.headlineStat);
  return `${zoneDisplayName(topZone.id, true)} scored highest — ${echo}.`;
}

export function zoneCardTitle(index: number, zone: ZoneResult): string {
  return `Zone ${index + 1} — ${zoneDisplayName(zone.id, true)}`;
}

export function zoneWhyFlagged(zone: ZoneResult): string {
  if (zone.echoes.length === 0) {
    return "Your answers clustered here on impact and feasibility — this is where the scan sees the most leverage.";
  }
  const joined =
    zone.echoes.length === 1
      ? zone.echoes[0]
      : `${zone.echoes.slice(0, -1).join(", ")}, and ${zone.echoes.at(-1)}`;
  const normalized = joined.charAt(0).toUpperCase() + joined.slice(1);
  return normalized.endsWith(".") ? normalized : `${normalized}.`;
}

export function zoneTypicalOutcome(zone: ZoneResult): string {
  return ZONE_TYPICAL_OUTCOMES[zone.id];
}

export function qualifiedCtaHeadline(auditPrice: string): string {
  return `Book your AI Opportunity Audit — from ${auditPrice}.`;
}

export function qualifiedCtaBody(): string {
  return "Your scan results come with you; we start where it left off.";
}

export function nurtureCtaHeadline(): string {
  return "Honestly? You don't need a $2,500 audit yet.";
}

export function nurtureStarterPointers(topZone: ZoneResult): string[] {
  return NURTURE_POINTERS[topZone.id].slice(0, 3);
}

export function nurtureClosingLine(): string {
  return "When you're funded, bigger, or ready — your scan will be waiting.";
}

export function nurtureNewsletterLabel(): string {
  return "Get occasional notes on what we're seeing across scans — no sequence, no spam.";
}

export function emailGateHeading(): string {
  return "Get your full opportunity map";
}

export function emailGateMicrocopy(): string {
  return "One email with your report link. No sequence, no spam.";
}

export function emailGateButtonLabel(): string {
  return "Show my full report";
}

export function isAuditRoute(route: ScanRoute): boolean {
  return route === "qualified" || route === "soft_qualified";
}

export function buildBookingUrl(baseUrl: string, scanId: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set("scan_id", scanId);
  url.searchParams.set("utm_source", "nsp_scan");
  url.searchParams.set("utm_medium", "report");
  return url.toString();
}

export function scanEmailSubject(topZone: ZoneResult): string {
  return `Your AI opportunity map: ${zoneDisplayName(topZone.id, true)} is your highest-leverage move.`;
}

export function scanEmailBody(args: {
  firstName: string;
  result: ScanResult;
  topZone: ZoneResult;
  reportUrl: string;
  bookingUrl: string | null;
}): string {
  const { firstName, result, topZone, reportUrl, bookingUrl } = args;
  const greeting = `Hi ${firstName},`;
  const scoreLine = `Your AI Readiness Score: ${result.readiness} — ${bandDisplayName(result.band)}.`;
  const zoneLine = `Highest-leverage zone: ${zoneDisplayName(topZone.id, true)}.`;
  const leanLine = `Lean: ${leanDisplayName(topZone.lean)} — ${topZone.leanReason}`;
  const linkLine = `Full report: ${reportUrl}`;

  const ctaLine = isAuditRoute(result.route)
    ? bookingUrl
      ? `Ready to go deeper? Book the AI Opportunity Audit — your scan comes with you: ${bookingUrl}`
      : "Ready to go deeper? Reply to this email and we'll get your AI Opportunity Audit on the calendar — your scan comes with you."
    : `${nurtureCtaHeadline()} Start with the pointers in your report. ${nurtureClosingLine()}`;

  return [
    greeting,
    "",
    "Thanks for taking the AI Opportunity Scan. Here's the short version:",
    "",
    scoreLine,
    zoneLine,
    leanLine,
    "",
    linkLine,
    "",
    ctaLine,
    "",
    "— North Star Pacific",
  ].join("\n");
}
