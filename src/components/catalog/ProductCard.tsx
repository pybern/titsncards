import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Product } from "@/lib/types";
import { CardArt } from "./CardArt";
import { QuickAdd } from "./AddToCart";
import { RarityBadge, ColorPill } from "@/components/ui/Badge";
import { formatUSD, formatPct, pctClass, cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const change = product.market?.change24hPct ?? 0;
  const isSealed = product.kind !== "single";

  return (
    <div
      className={cn(
        "panel glow-hover group flex flex-col overflow-hidden p-0",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block"
        aria-label={product.name}
      >
        <div className="relative aspect-[5/7] w-full overflow-hidden">
          <CardArt
            product={product}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.inStock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-md border border-down/60 bg-black/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-down">
                Sold Out
              </span>
            </div>
          )}
          {product.trending && (
            <span className="absolute right-2 top-9 rounded-md bg-crimson/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
              Hot
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center gap-1.5">
          {product.rarity && <RarityBadge rarity={product.rarity} />}
          {product.color && !isSealed && <ColorPill color={product.color} />}
          {isSealed && (
            <span className="rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
              {product.kind.replace("-", " ")}
            </span>
          )}
        </div>

        <Link href={`/product/${product.slug}`} className="min-w-0">
          <h3 className="line-clamp-1 font-display text-sm font-bold text-ink transition group-hover:text-gold-bright">
            {product.name}
          </h3>
          <p className="line-clamp-1 text-xs text-muted">
            {product.subtitle ?? product.cardNumber ?? product.releaseCode}
          </p>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="font-display text-lg font-bold text-gold-gradient">
              {formatUSD(product.price)}
            </p>
            {product.market && (
              <p
                className={cn(
                  "flex items-center gap-0.5 text-[11px] font-semibold",
                  pctClass(change),
                )}
              >
                {change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPct(change)} <span className="text-muted">24h</span>
              </p>
            )}
          </div>
          <QuickAdd product={product} />
        </div>
      </div>
    </div>
  );
}
