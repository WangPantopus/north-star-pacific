export type ScanSection = "A" | "B" | "C" | "D" | "E";

export type ZoneId = "PROD" | "OPS" | "CX" | "DATA" | "GLUE" | "RESCUE";

export type ReadinessBand =
  | "ai_ready"
  | "strong_foundation"
  | "quick_wins"
  | "foundations_first";

export type LeanType = "buy" | "build" | "wait" | "hybrid";

export type ScanRoute = "qualified" | "nurture" | "soft_qualified";

export type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11"
  | "q12"
  | "q13"
  | "q14"
  | "q15"
  | "q16"
  | "q17"
  | "q18"
  | "q19";

export type ScanAnswers = Partial<Record<QuestionId, string | string[]>>;

export type ZoneResult = {
  id: ZoneId;
  impact: number;
  effort: number;
  priority: number;
  surfaced: boolean;
  lean: LeanType;
  leanReason: string;
  echoes: string[];
};

export type ScanResult = {
  readiness: number;
  band: ReadinessBand;
  zones: ZoneResult[];
  route: ScanRoute;
  headlineStat: string | null;
};

export type ScanOption = {
  id: string;
  label: string;
};

export type ScanQuestion = {
  id: QuestionId;
  section: ScanSection;
  prompt: string;
  multiSelect: boolean;
  maxSelections?: number;
  options: ScanOption[];
};
