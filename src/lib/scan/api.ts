import type { ScanAnswers } from "./types";
import type { StoredScanReport } from "./reportStorage";

export type ScanSubmitPayload = {
  answers: ScanAnswers;
  email: string;
  firstName: string;
  company: string;
};

export type ScanSubmitResponse = {
  ok: boolean;
  id?: string;
  reportUrl?: string;
  error?: string;
};

export type ScanReportResponse = {
  ok: boolean;
  report?: StoredScanReport & {
    bookingUrl: string | null;
    auditBooked?: boolean;
    reportUrl?: string;
  };
  error?: string;
};

export async function submitScan(
  payload: ScanSubmitPayload,
): Promise<ScanSubmitResponse> {
  const response = await fetch("/api/scan/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ScanSubmitResponse;
  if (!response.ok) {
    return { ok: false, error: data.error ?? "submit-failed" };
  }
  return data;
}

export async function fetchScanReport(id: string): Promise<ScanReportResponse> {
  const response = await fetch(
    `/api/scan/report?id=${encodeURIComponent(id)}`,
  );
  const data = (await response.json()) as ScanReportResponse;
  if (!response.ok) {
    return { ok: false, error: data.error ?? "fetch-failed" };
  }
  return data;
}

export function markScanBooked(id: string): void {
  const url = `/api/scan/booked?id=${encodeURIComponent(id)}`;
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon(url);
    return;
  }
  void fetch(url, { method: "POST", keepalive: true });
}
