import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchScanReport } from "../lib/scan/api";
import { loadReport, type StoredScanReport } from "../lib/scan/reportStorage";
import { ScanHeader } from "./ScanLayout";
import { ScanReport } from "./ScanReport";
import "./scan.css";

function ScanReportMissing() {
  return (
    <div className="scan-panel scan-missing">
      <p className="eyebrow">
        <span className="dot" aria-hidden="true" />
        Report unavailable
      </p>
      <h1 className="scan-title">We couldn&apos;t load this report</h1>
      <p className="scan-lead">
        This link may be invalid, or the report may no longer be available.
        Take the scan again to generate a fresh map.
      </p>
      <Link className="btn btn-primary" to="/scan">
        Take the scan
      </Link>
    </div>
  );
}

function ScanReportLoader({ id }: { id: string }) {
  const [report, setReport] = useState<StoredScanReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const api = await fetchScanReport(id);
      if (cancelled) {
        return;
      }

      if (api.ok && api.report) {
        setReport(api.report);
        setLoading(false);
        return;
      }

      const cached = loadReport(id);
      if (cached) {
        setReport(cached);
        setLoading(false);
        return;
      }

      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    document.title = report
      ? `Your AI opportunity map — ${report.contact.company}`
      : loading
        ? "Loading your report — North Star Pacific"
        : "Report not found — North Star Pacific";
    return () => {
      document.title =
        "North Star Pacific — AI, built into your business and shipped";
    };
  }, [report, loading]);

  if (loading) {
    return (
      <div className="scan-panel scan-loading" aria-live="polite">
        <p className="eyebrow">
          <span className="dot" aria-hidden="true" />
          Loading
        </p>
        <h1 className="scan-title">Pulling up your opportunity map</h1>
        <p className="scan-lead">Re-scoring from your saved answers…</p>
      </div>
    );
  }

  if (!report) {
    return <ScanReportMissing />;
  }

  return <ScanReport report={report} />;
}

export default function ScanReportPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="scan-page">
      <a className="skip-link" href="#scan-main">
        Skip to report
      </a>
      <div className="grain" aria-hidden="true" />
      <ScanHeader />
      <main id="scan-main" className="scan-main scan-main-report" tabIndex={-1}>
        {id ? <ScanReportLoader id={id} /> : <ScanReportMissing />}
      </main>
    </div>
  );
}
