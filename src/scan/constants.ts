import type { ScanSection } from "../lib/scan/types";

export type ScanSectionMeta = {
  id: ScanSection;
  label: string;
  startIndex: number;
};

export const SCAN_SECTIONS: ScanSectionMeta[] = [
  { id: "A", label: "Context", startIndex: 0 },
  { id: "B", label: "Pain", startIndex: 4 },
  { id: "C", label: "Ambitions", startIndex: 9 },
  { id: "D", label: "Feasibility", startIndex: 13 },
  { id: "E", label: "Intent", startIndex: 17 },
];

export const SCAN_STORAGE_KEY = "nsp-scan-flow";
