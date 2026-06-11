import { Link } from "react-router-dom";

export function ScanHeader() {
  return (
    <header className="scan-header">
      <div className="scan-header-shell">
        <Link className="scan-header-brand" to="/" aria-label="North Star Pacific home">
          <svg className="header-star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1 14.1 9.9 23 12 14.1 14.1 12 23 9.9 14.1 1 12 9.9 9.9Z" />
          </svg>
          <span>North Star Pacific</span>
        </Link>
        <span className="scan-header-tag">AI Opportunity Scan</span>
      </div>
    </header>
  );
}
