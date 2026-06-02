import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrendingUp, TrendingDown, ArrowLeft, ShoppingBag } from "lucide-react";
import {
  getProduct,
  getTrackerProducts,
  getRelatedProducts,
} from "@/lib/catalog";
import { PriceChart } from "@/components/market/PriceChart";
import { StatGrid } from "@/components/market/StatGrid";
import { BidAskForm } from "@/components/market/BidAskForm";
import { MoverCard } from "@/components/market/MoverCard";
import { CardArt } from "@/components/catalog/CardArt";
import { RarityBadge } from "@/components/ui/Badge";
import { formatUSD, formatPct, pctClass, formatDate, cn } from "@/lib/utils";
import { marketMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getTrackerProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return marketMetadata(product);
}

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || !product.market) notFound();
  const m = product.market;
  const up = m.change24hPct >= 0;
  const related = getRelatedProducts(product, 3).filter((p) => p.market);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/market"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold-bright"
      >
        <ArrowLeft className="h-4 w-4" /> Back to market
      </Link>

      {/* header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <CardArt product={product} showLabel={false} className="h-28 w-20 shrink-0" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {product.rarity && <RarityBadge rarity={product.rarity} />}
            <Link
              href={`/releases/${product.releaseCode}`}
              className="font-mono text-xs text-gold/90 hover:text-gold-bright"
            >
              {product.cardNumber ?? product.releaseCode}
            </Link>
          </div>
          <h1 className="mt-1 font-display text-3xl font-black text-ink sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-2 flex items-end gap-3">
            <span className="font-display text-3xl font-black text-gold-gradient">
              {formatUSD(m.lastSale)}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 pb-1 text-sm font-bold",
                pctClass(m.change24hPct),
              )}
            >
              {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {formatPct(m.change24hPct)} today
            </span>
          </div>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-panel-light px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-gold/50 hover:text-gold-bright"
        >
          <ShoppingBag className="h-4 w-4" /> Product page
        </Link>
      </div>

      {/* main grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <PriceChart history={m.history} />
          <StatGrid m={m} />

          {/* recent sales */}
          <div className="panel p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-gold-bright">
              Recent Sales
            </h2>
            <div className="overflow-hidden rounded-lg border border-hairline">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-black/20 text-left text-[11px] uppercase tracking-wider text-muted">
                    <th className="p-3">Date</th>
                    <th className="p-3">Condition</th>
                    <th className="p-3 text-right">Sale Price</th>
                  </tr>
                </thead>
                <tbody>
                  {m.recentSales.map((s, i) => (
                    <tr key={i} className="border-b border-hairline/50 last:border-0">
                      <td className="p-3 text-muted">{formatDate(s.t)}</td>
                      <td className="p-3">
                        <span className="rounded border border-hairline bg-black/20 px-1.5 py-0.5 text-[11px] font-semibold text-ink">
                          {s.condition}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold text-ink">
                        {formatUSD(s.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* bid/ask sidebar */}
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <BidAskForm product={product} />
          {related.length > 0 && (
            <div>
              <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted">
                Related Markets
              </h3>
              <div className="space-y-3">
                {related.map((p) => (
                  <MoverCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
