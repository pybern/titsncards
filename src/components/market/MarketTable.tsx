"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Line, Product } from "@/lib/types";
import { CardArt } from "@/components/catalog/CardArt";
import { Sparkline } from "./Sparkline";
import { formatUSD, formatPct, pctClass, cn } from "@/lib/utils";

type SortKey = "name" | "last" | "bid" | "ask" | "c24" | "c7" | "vol";
type Dir = "asc" | "desc";

const lineFilters: { key: Line | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "OP", label: "OP" },
  { key: "PRB", label: "PRB" },
  { key: "SPC", label: "SPC" },
];

function val(p: Product, key: SortKey): number | string {
  const m = p.market!;
  switch (key) {
    case "name": return p.name.toLowerCase();
    case "last": return m.lastSale;
    case "bid": return m.bid;
    case "ask": return m.ask;
    case "c24": return m.change24hPct;
    case "c7": return m.change7dPct;
    case "vol": return m.volume30d;
  }
}

export function MarketTable({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [line, setLine] = useState<Line | "ALL">("ALL");
  const [sort, setSort] = useState<SortKey>("vol");
  const [dir, setDir] = useState<Dir>("desc");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (line !== "ALL" && p.line !== line) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        (p.cardNumber?.toLowerCase().includes(query) ?? false) ||
        p.releaseCode.toLowerCase().includes(query)
      );
    });
    const sorted = [...filtered].sort((a, b) => {
      const av = val(a, sort);
      const bv = val(b, sort);
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [products, q, line, sort, dir]);

  function toggleSort(key: SortKey) {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter the index…"
            className="h-10 w-full rounded-lg border border-hairline bg-panel-light pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-gold/60 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-hairline p-1">
          {lineFilters.map((l) => (
            <button
              key={l.key}
              onClick={() => setLine(l.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-bold transition",
                line === l.key ? "bg-gold/15 text-gold-bright" : "text-muted hover:text-ink",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-[11px] uppercase tracking-wider text-muted">
                <Th>Item</Th>
                <Th sortable onClick={() => toggleSort("last")} active={sort === "last"} dir={dir} className="text-right">Last</Th>
                <Th sortable onClick={() => toggleSort("bid")} active={sort === "bid"} dir={dir} className="text-right">Bid</Th>
                <Th sortable onClick={() => toggleSort("ask")} active={sort === "ask"} dir={dir} className="text-right">Ask</Th>
                <Th sortable onClick={() => toggleSort("c24")} active={sort === "c24"} dir={dir} className="text-right">24h</Th>
                <Th sortable onClick={() => toggleSort("c7")} active={sort === "c7"} dir={dir} className="text-right">7d</Th>
                <Th sortable onClick={() => toggleSort("vol")} active={sort === "vol"} dir={dir} className="text-right">Vol</Th>
                <Th className="text-right">30d</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const m = p.market!;
                return (
                  <tr
                    key={p.id}
                    className="group border-b border-hairline/60 transition hover:bg-white/[0.03]"
                  >
                    <td className="p-3">
                      <Link href={`/market/${p.slug}`} className="flex items-center gap-3">
                        <CardArt product={p} showLabel={false} className="h-12 w-8 shrink-0" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-semibold text-ink group-hover:text-gold-bright">
                            {p.name}
                          </p>
                          <p className="font-mono text-[11px] text-muted">
                            {p.cardNumber ?? p.releaseCode}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="p-3 text-right font-display font-bold text-gold-bright">
                      {formatUSD(m.lastSale)}
                    </td>
                    <td className="p-3 text-right text-ink">{formatUSD(m.bid)}</td>
                    <td className="p-3 text-right text-ink">{formatUSD(m.ask)}</td>
                    <td className={cn("p-3 text-right font-semibold", pctClass(m.change24hPct))}>
                      {formatPct(m.change24hPct)}
                    </td>
                    <td className={cn("p-3 text-right font-semibold", pctClass(m.change7dPct))}>
                      {formatPct(m.change7dPct)}
                    </td>
                    <td className="p-3 text-right text-muted">{m.volume30d}</td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Sparkline data={m.history.slice(-30)} width={90} height={28} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-muted">
                    No items match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-2 text-right text-xs text-muted">{rows.length} items tracked</p>
    </div>
  );
}

function Th({
  children,
  className,
  sortable,
  active,
  dir,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  active?: boolean;
  dir?: Dir;
  onClick?: () => void;
}) {
  return (
    <th className={cn("p-3 font-semibold", className)}>
      {sortable ? (
        <button
          onClick={onClick}
          className={cn(
            "inline-flex items-center gap-1 transition hover:text-ink",
            active && "text-gold-bright",
            className?.includes("text-right") && "flex-row-reverse",
          )}
        >
          {children}
          {active ? (
            dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}
