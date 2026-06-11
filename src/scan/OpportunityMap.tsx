import { MAP_CAPTION_COPY } from "../lib/scan/reportTemplates";
import type { ZoneResult } from "../lib/scan/types";

const PLOT = {
  left: 56,
  right: 344,
  top: 36,
  bottom: 244,
};

function scaleX(effort: number): number {
  const min = 1;
  const max = 5;
  const ratio = (effort - min) / (max - min);
  return PLOT.left + ratio * (PLOT.right - PLOT.left);
}

function scaleY(impact: number): number {
  const min = 0;
  const max = 10;
  const ratio = (impact - min) / (max - min);
  return PLOT.bottom - ratio * (PLOT.bottom - PLOT.top);
}

type OpportunityMapProps = {
  zones: ZoneResult[];
};

export function OpportunityMap({ zones }: OpportunityMapProps) {
  return (
    <figure className="scan-map-figure">
      <svg
        className="scan-map"
        viewBox="0 0 400 280"
        role="img"
        aria-label="Impact versus effort map of all six opportunity zones"
      >
        <defs>
          <linearGradient id="scan-map-grid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(234,241,251,0.08)" />
            <stop offset="100%" stopColor="rgba(234,241,251,0.02)" />
          </linearGradient>
        </defs>

        <rect
          x={PLOT.left}
          y={PLOT.top}
          width={PLOT.right - PLOT.left}
          height={PLOT.bottom - PLOT.top}
          fill="url(#scan-map-grid)"
          stroke="rgba(234,241,251,0.14)"
          rx="8"
        />

        <line
          x1={PLOT.left}
          x2={PLOT.right}
          y1={(PLOT.top + PLOT.bottom) / 2}
          y2={(PLOT.top + PLOT.bottom) / 2}
          stroke="rgba(234,241,251,0.1)"
          strokeDasharray="4 6"
        />
        <line
          x1={(PLOT.left + PLOT.right) / 2}
          x2={(PLOT.left + PLOT.right) / 2}
          y1={PLOT.top}
          y2={PLOT.bottom}
          stroke="rgba(234,241,251,0.1)"
          strokeDasharray="4 6"
        />

        <text
          x={PLOT.left}
          y={18}
          className="scan-map-axis-label"
          textAnchor="start"
        >
          Higher impact ↑
        </text>
        <text
          x={PLOT.right}
          y={268}
          className="scan-map-axis-label"
          textAnchor="end"
        >
          Higher effort →
        </text>

        <text
          x={PLOT.left + 8}
          y={PLOT.top + 14}
          className="scan-map-quadrant"
          textAnchor="start"
        >
          Quick wins
        </text>
        <text
          x={PLOT.right - 8}
          y={PLOT.top + 14}
          className="scan-map-quadrant"
          textAnchor="end"
        >
          Strategic builds
        </text>
        <text
          x={PLOT.left + 8}
          y={PLOT.bottom - 8}
          className="scan-map-quadrant"
          textAnchor="start"
        >
          Low priority
        </text>
        <text
          x={PLOT.right - 8}
          y={PLOT.bottom - 8}
          className="scan-map-quadrant"
          textAnchor="end"
        >
          Hard slog
        </text>

        {zones.map((zone) => {
          const x = scaleX(zone.effort);
          const y = scaleY(zone.impact);
          const highlighted = zone.surfaced;

          return (
            <g key={zone.id} className="scan-map-point-group">
              <circle
                className={`scan-map-dot${highlighted ? " is-surfaced" : ""}`}
                cx={x}
                cy={y}
                r={highlighted ? 8 : 6}
              />
              <text
                className={`scan-map-label${highlighted ? " is-surfaced" : ""}`}
                x={x}
                y={y - 14}
                textAnchor="middle"
              >
                {zone.id}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="scan-map-caption">{MAP_CAPTION_COPY}</figcaption>
    </figure>
  );
}
