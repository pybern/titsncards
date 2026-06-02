import type { PricePoint } from "@/lib/types";

/** Tiny inline SVG sparkline for price history. */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  className,
  positive,
}: {
  data: PricePoint[];
  width?: number;
  height?: number;
  className?: string;
  positive?: boolean;
}) {
  if (!data || data.length < 2) return null;
  const prices = data.map((d) => d.p);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const up = positive ?? prices[prices.length - 1] >= prices[0];
  const color = up ? "var(--color-up)" : "var(--color-down)";

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - 2 - ((d.p - min) / range) * (height - 4);
    return [x, y] as const;
  });

  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const gid = `spark-${Math.round(min)}-${Math.round(max)}-${data.length}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
