import type { Metadata } from "next";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getTrackerProducts, getMovers } from "@/lib/catalog";
import { MarketTable } from "@/components/market/MarketTable";
import { MoverCard } from "@/components/market/MoverCard";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Market — Price Tracker",
  description:
    "Live-style price tracking for One Piece TCG singles and sealed product. Last sales, bids, asks, and full history — StockX for pirates.",
  path: "/market",
  image: "/img/market-banner.webp",
});

export default function MarketPage() {
  const tracked = getTrackerProducts();
  const { gainers, losers } = getMovers(4);

  return (
    <div>
      {/* hero banner */}
      <section className="relative overflow-hidden border-b border-hairline">
        <Image
          src="/img/market-banner.webp"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/70 to-abyss/30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
            The Exchange
          </p>
          <h1 className="mt-1 font-display text-4xl font-black text-gold-gradient sm:text-5xl">
            Price Tracker
          </h1>
          <p className="mt-3 max-w-2xl text-ink/90">
            Track the market like a Yonko. Real-time-style last sales, highest
            bids, lowest asks, and full price history across {tracked.length}{" "}
            cards and sealed products.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        {/* movers */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-up">
              <TrendingUp className="h-5 w-5" /> Top Gainers (24h)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {gainers.map((p) => (
                <MoverCard key={p.id} product={p} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-down">
              <TrendingDown className="h-5 w-5" /> Top Losers (24h)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {losers.map((p) => (
                <MoverCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* full index */}
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold text-ink">
            The Index
          </h2>
          <MarketTable products={tracked} />
        </div>
      </div>
    </div>
  );
}
