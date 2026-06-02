import type { MarketData } from "@/lib/types";
import { formatUSD, formatPct, pctClass, cn } from "@/lib/utils";

export function StatGrid({ m }: { m: MarketData }) {
  const stats: { label: string; value: string; cls?: string }[] = [
    { label: "Last Sale", value: formatUSD(m.lastSale) },
    { label: "Highest Bid", value: formatUSD(m.bid) },
    { label: "Lowest Ask", value: formatUSD(m.ask) },
    { label: "24h", value: formatPct(m.change24hPct), cls: pctClass(m.change24hPct) },
    { label: "7d", value: formatPct(m.change7dPct), cls: pctClass(m.change7dPct) },
    { label: "30d", value: formatPct(m.change30dPct), cls: pctClass(m.change30dPct) },
    { label: "52w High", value: formatUSD(m.weekHigh52) },
    { label: "52w Low", value: formatUSD(m.weekLow52) },
    { label: "30d Volume", value: `${m.volume30d} sales` },
  ];
  return (
    <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-panel p-3.5">
          <p className="text-[11px] uppercase tracking-wider text-muted">
            {s.label}
          </p>
          <p className={cn("mt-0.5 font-display text-lg font-bold text-ink", s.cls)}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
