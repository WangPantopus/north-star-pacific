type ReadinessDialProps = {
  score: number;
  bandLabel: string;
  size?: "md" | "lg";
};

export function ReadinessDial({
  score,
  bandLabel,
  size = "md",
}: ReadinessDialProps) {
  const radius = size === "lg" ? 72 : 58;
  const stroke = size === "lg" ? 10 : 8;
  const viewBox = 180;
  const center = viewBox / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className={`scan-dial scan-dial-${size}`}
      role="img"
      aria-label={`AI Readiness Score ${score}, ${bandLabel}`}
    >
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} aria-hidden="true">
        <circle
          className="scan-dial-track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className="scan-dial-progress"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="scan-dial-center">
        <span className="scan-dial-score">{score}</span>
        <span className="scan-dial-band">{bandLabel}</span>
      </div>
    </div>
  );
}
