import type { ScanAnswers, ScanResult } from "./types";
import type { ReportContact } from "./reportTemplates";

export type StoredScanReport = {
  id: string;
  answers?: ScanAnswers;
  result: ScanResult;
  contact: ReportContact;
  createdAt: string;
  bookingUrl?: string | null;
  auditBooked?: boolean;
  reportUrl?: string;
};

const REPORT_KEY_PREFIX = "nsp-scan-report-";

export function createReportId(): string {
  return crypto.randomUUID();
}

export function saveReport(report: StoredScanReport): void {
  sessionStorage.setItem(
    `${REPORT_KEY_PREFIX}${report.id}`,
    JSON.stringify(report),
  );
}

export function loadReport(id: string): StoredScanReport | null {
  try {
    const raw = sessionStorage.getItem(`${REPORT_KEY_PREFIX}${id}`);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredReport(parsed) || parsed.id !== id) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function isStoredReport(value: unknown): value is StoredScanReport {
  if (!value || typeof value !== "object") {
    return false;
  }
  const report = value as StoredScanReport;
  return (
    typeof report.id === "string" &&
    typeof report.createdAt === "string" &&
    typeof report.answers === "object" &&
    report.answers !== null &&
    typeof report.result === "object" &&
    report.result !== null &&
    typeof report.contact === "object" &&
    report.contact !== null &&
    typeof report.contact.email === "string" &&
    typeof report.contact.firstName === "string" &&
    typeof report.contact.company === "string"
  );
}
