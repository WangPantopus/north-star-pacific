import { Link } from "react-router-dom";
import { AUDIT_PRICE } from "../config";
import { markScanBooked } from "../lib/scan/api";
import {
  bandDisplayName,
  isAuditRoute,
  leanDisplayName,
  nurtureClosingLine,
  nurtureCtaHeadline,
  nurtureNewsletterLabel,
  nurtureStarterPointers,
  qualifiedCtaBody,
  qualifiedCtaHeadline,
  SCAN_CANT_KNOW_COPY,
  verdictBody,
  verdictHeadline,
  zoneCardTitle,
  zoneTypicalOutcome,
  zoneWhyFlagged,
} from "../lib/scan/reportTemplates";
import type { StoredScanReport } from "../lib/scan/reportStorage";
import { getSurfacedZones, getTopZone } from "../lib/scan/score";
import { OpportunityMap } from "./OpportunityMap";
import { ReadinessDial } from "./ReadinessDial";

type ScanReportProps = {
  report: StoredScanReport;
};

export function ScanReport({ report }: ScanReportProps) {
  const { result, contact } = report;
  const topZone = getTopZone(result);
  const surfacedZones = getSurfacedZones(result);
  const bookingHref = report.bookingUrl || "/#book";
  const bookingExternal = Boolean(report.bookingUrl);

  const handleBookClick = () => {
    markScanBooked(report.id);
  };

  return (
    <article className="scan-report">
      <header className="scan-report-verdict">
        <div className="scan-report-verdict-grid">
          <ReadinessDial
            score={result.readiness}
            bandLabel={bandDisplayName(result.band)}
            size="lg"
          />
          <div className="scan-report-verdict-copy">
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" />
              {contact.company}
            </p>
            <h1 className="scan-report-headline">{verdictHeadline(result)}</h1>
            {topZone ? (
              <p className="scan-report-verdict-body">
                {verdictBody(result, topZone)}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section className="scan-report-section" aria-labelledby="scan-zones-title">
        <h2 className="scan-section-title" id="scan-zones-title">
          Your top opportunity zones
        </h2>
        <div className="scan-zone-cards">
          {surfacedZones.map((zone, index) => (
            <div className="scan-zone-card" key={zone.id}>
              <div className="scan-zone-card-head">
                <h3 className="scan-zone-card-title">
                  {zoneCardTitle(index, zone)}
                </h3>
                <span className={`scan-lean-badge lean-${zone.lean}`}>
                  {leanDisplayName(zone.lean)}
                </span>
              </div>
              <p className="scan-zone-why">{zoneWhyFlagged(zone)}</p>
              <p className="scan-zone-typical">{zoneTypicalOutcome(zone)}</p>
              <p className="scan-zone-lean">{zone.leanReason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="scan-report-section" aria-labelledby="scan-map-title">
        <h2 className="scan-section-title" id="scan-map-title">
          The full map
        </h2>
        <OpportunityMap zones={result.zones} />
      </section>

      <section
        className="scan-report-section scan-candor"
        aria-labelledby="scan-candor-title"
      >
        <h2 className="scan-section-title" id="scan-candor-title">
          What this scan can&apos;t know
        </h2>
        <p className="scan-candor-copy">{SCAN_CANT_KNOW_COPY}</p>
      </section>

      <section
        className="scan-report-section scan-cta"
        aria-labelledby="scan-cta-title"
        role="region"
        aria-label="Next steps CTA"
      >
        {isAuditRoute(result.route) ? (
          <div className="scan-cta-qualified">
            {result.route === "soft_qualified" && topZone ? (
              <div className="scan-cta-nurture-block">
                <h2 className="scan-cta-headline" id="scan-cta-title">
                  {nurtureCtaHeadline()}
                </h2>
                <ul className="scan-cta-pointers">
                  {nurtureStarterPointers(topZone).map((pointer) => (
                    <li key={pointer}>{pointer}</li>
                  ))}
                </ul>
                <form
                  className="scan-newsletter-form"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <label className="field-label" htmlFor="scan-soft-newsletter">
                    {nurtureNewsletterLabel()}
                  </label>
                  <div className="scan-newsletter-row">
                    <input
                      id="scan-soft-newsletter"
                      className="field-input"
                      type="email"
                      defaultValue={contact.email}
                      placeholder="you@company.com"
                    />
                    <button className="btn btn-ghost" type="submit">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            <h2
              className={`scan-cta-headline${result.route === "soft_qualified" ? " scan-cta-headline-secondary" : ""}`}
              id={result.route === "soft_qualified" ? undefined : "scan-cta-title"}
            >
              {qualifiedCtaHeadline(AUDIT_PRICE)}
            </h2>
            <p className="scan-cta-body">{qualifiedCtaBody()}</p>
            <div className="scan-cta-actions">
              <a
                className="btn btn-primary"
                href={bookingHref}
                onClick={handleBookClick}
                {...(bookingExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                Book the AI Opportunity Audit
              </a>
              <Link className="btn btn-ghost" to="/sample-audit">
                See a sample audit <span className="arr">→</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="scan-cta-nurture">
            <h2 className="scan-cta-headline" id="scan-cta-title">
              {nurtureCtaHeadline()}
            </h2>
            {topZone ? (
              <ul className="scan-cta-pointers">
                {nurtureStarterPointers(topZone).map((pointer) => (
                  <li key={pointer}>{pointer}</li>
                ))}
              </ul>
            ) : null}
            <form
              className="scan-newsletter-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="field-label" htmlFor="scan-newsletter-email">
                {nurtureNewsletterLabel()}
              </label>
              <div className="scan-newsletter-row">
                <input
                  id="scan-newsletter-email"
                  className="field-input"
                  type="email"
                  defaultValue={contact.email}
                  placeholder="you@company.com"
                />
                <button className="btn btn-primary" type="submit">
                  Subscribe
                </button>
              </div>
            </form>
            <p className="scan-cta-closing">{nurtureClosingLine()}</p>
          </div>
        )}
      </section>
    </article>
  );
}
