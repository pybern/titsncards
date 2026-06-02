"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PricePoint } from "@/lib/types";
import { formatUSD, formatDate, cn } from "@/lib/utils";

type Range = "1M" | "3M" | "6M" | "1Y" | "All";
const ranges: { key: Range; days: number }[] = [
  { key: "1M", days: 30 },
  { key: "3M", days: 90 },
  { key: "6M", days: 182 },
  { key: "1Y", days: 365 },
  { key: "All", days: 9999 },
];

const PAD = { top: 16, right: 12, bottom: 24, left: 52 };

export function PriceChart({
  history,
  height = 340,
  className,
}: {
  history: PricePoint[];
  height?: number;
  className?: string;
}) {
  const [range, setRange] = useState<Range>("3M");
  const [width, setWidth] = useState(720);
  const [hover, setHover] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = useMemo(() => {
    const days = ranges.find((r) => r.key === range)!.days;
    return history.slice(Math.max(0, history.length - days));
  }, [history, range]);

  const { line, area, points, min, max, up } = useMemo(() => {
    const prices = data.map((d) => d.p);
    const lo = Math.min(...prices);
    const hi = Math.max(...prices);
    const pad = (hi - lo) * 0.12 || hi * 0.1 || 1;
    const min = Math.max(0, lo - pad);
    const max = hi + pad;
    const range = max - min || 1;
    const innerW = width - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;
    const pts = data.map((d, i) => {
      const x = PAD.left + (i / (data.length - 1 || 1)) * innerW;
      const y = PAD.top + innerH - ((d.p - min) / range) * innerH;
      return [x, y] as const;
    });
    const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${PAD.left},${PAD.top + innerH} ${line} ${(PAD.left + innerW).toFixed(1)},${PAD.top + innerH}`;
    return {
      line,
      area,
      points: pts,
      min,
      max,
      up: prices[prices.length - 1] >= prices[0],
    };
  }, [data, width, height]);

  const color = up ? "var(--color-up)" : "var(--color-down)";
  const innerH = height - PAD.top - PAD.bottom;

  function onMove(e: React.MouseEvent) {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const innerW = width - PAD.left - PAD.right;
    const ratio = (x - PAD.left) / innerW;
    const idx = Math.round(ratio * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  }

  const gridLines = 4;
  const hoverPt = hover != null ? points[hover] : null;
  const hoverData = hover != null ? data[hover] : null;

  return (
    <div className={cn("panel p-4", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            Sale price
          </span>
        </div>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => {
                setRange(r.key);
                setHover(null);
              }}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition",
                range === r.key
                  ? "bg-gold/15 text-gold-bright"
                  : "text-muted hover:bg-white/5 hover:text-ink",
              )}
            >
              {r.key}
            </button>
          ))}
        </div>
      </div>

      <div ref={wrapRef} className="relative w-full" style={{ height }}>
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines + y labels */}
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = PAD.top + (innerH / gridLines) * i;
            const val = max - ((max - min) / gridLines) * i;
            return (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={width - PAD.right}
                  y2={y}
                  stroke="var(--color-hairline)"
                  strokeOpacity="0.4"
                  strokeDasharray="3 4"
                />
                <text
                  x={PAD.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[var(--color-muted)] text-[10px]"
                >
                  {formatUSD(val, { compact: true })}
                </text>
              </g>
            );
          })}

          {/* x labels (start / mid / end) */}
          {data.length > 1 &&
            [0, Math.floor(data.length / 2), data.length - 1].map((i, k) => {
              const x = points[i][0];
              return (
                <text
                  key={k}
                  x={x}
                  y={height - 6}
                  textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"}
                  className="fill-[var(--color-muted)] text-[10px]"
                >
                  {formatDate(data[i].t, { month: "short", day: "numeric", year: undefined })}
                </text>
              );
            })}

          <polygon points={area} fill="url(#chart-area)" />
          <polyline
            points={line}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* hover crosshair */}
          {hoverPt && (
            <g>
              <line
                x1={hoverPt[0]}
                y1={PAD.top}
                x2={hoverPt[0]}
                y2={PAD.top + innerH}
                stroke="var(--color-gold)"
                strokeOpacity="0.5"
              />
              <circle cx={hoverPt[0]} cy={hoverPt[1]} r="4.5" fill={color} stroke="#0a0f1d" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* tooltip */}
        {hoverPt && hoverData && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-gold/40 bg-abyss/95 px-3 py-1.5 text-center shadow-xl"
            style={{
              left: Math.max(60, Math.min(width - 60, hoverPt[0])),
              top: Math.max(0, hoverPt[1] - 52),
            }}
          >
            <p className="font-display text-sm font-bold text-gold-bright">
              {formatUSD(hoverData.p)}
            </p>
            <p className="text-[10px] text-muted">{formatDate(hoverData.t)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
