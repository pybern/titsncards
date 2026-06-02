import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { Sparkline } from "./Sparkline";
import { formatUSD, formatPct, pctClass, cn } from "@/lib/utils";

export function MoverCard({ product }: { product: Product }) {
  const m = product.market!;
  const up = m.change24hPct >= 0;
  return (
    <Link
      href={`/market/${product.slug}`}
      className="panel glow-hover flex items-center gap-3 p-3"
    >
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-ink">
          {product.name}
        </p>
        <p className="font-mono text-[10px] text-muted">
          {product.cardNumber ?? product.releaseCode}
        </p>
        <p className="mt-1 font-display text-base font-bold text-gold-gradient">
          {formatUSD(m.lastSale)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Sparkline data={m.history.slice(-30)} width={84} height={30} positive={up} />
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-bold",
            pctClass(m.change24hPct),
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {formatPct(m.change24hPct)}
        </span>
      </div>
    </Link>
  );
}
