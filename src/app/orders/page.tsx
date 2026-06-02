"use client";

import Link from "next/link";
import { Package, Heart, Tag, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";
import { getProductById } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CardArt } from "@/components/catalog/CardArt";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { BannerRibbon } from "@/components/ui/Panel";
import { formatUSD, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const listings = useStore((s) => s.listings);
  const watchlist = useStore((s) => s.watchlist);
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6" />;
  }

  const watched = watchlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const nothing = orders.length === 0 && listings.length === 0 && watched.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-black text-gold-gradient sm:text-4xl">
        Captain&apos;s Log
      </h1>
      <p className="mt-1 text-muted">
        Your orders, market listings, and watchlist — all in one place.
      </p>

      {nothing ? (
        <div className="mt-8">
          <EmptyState
            icon={<Package className="h-7 w-7" />}
            title="No history yet"
            description="Place an order, list a card for sale, or add cards to your watchlist to see them here."
            action={
              <div className="flex gap-3">
                <Button href="/releases" variant="gold">Browse releases</Button>
                <Button href="/market" variant="secondary">Open market</Button>
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {/* orders */}
          {orders.length > 0 && (
            <section>
              <BannerRibbon eyebrow="Purchases" className="mb-5">
                <span className="inline-flex items-center gap-2">
                  <Package className="h-5 w-5" /> Orders
                </span>
              </BannerRibbon>
              <div className="space-y-3">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/checkout/success/${o.id}`}
                    className="panel glow-hover flex items-center gap-4 p-4"
                  >
                    <div className="flex -space-x-3">
                      {o.items.slice(0, 3).map((it) => {
                        const p = getProductById(it.productId);
                        return p ? (
                          <CardArt
                            key={it.productId}
                            product={p}
                            showLabel={false}
                            className="h-16 w-11 ring-2 ring-abyss"
                          />
                        ) : null;
                      })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-bold text-gold-bright">
                        {o.id}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(o.createdAt)} · {o.items.length} item
                        {o.items.length === 1 ? "" : "s"} · {o.paymentBrandMasked}
                      </p>
                    </div>
                    <span className="font-display text-lg font-bold text-ink">
                      {formatUSD(o.total)}
                    </span>
                    <span className="rounded-md bg-up/15 px-2 py-0.5 text-[11px] font-bold uppercase text-up">
                      {o.status}
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* listings */}
          {listings.length > 0 && (
            <section>
              <BannerRibbon eyebrow="Selling" className="mb-5">
                <span className="inline-flex items-center gap-2">
                  <Tag className="h-5 w-5" /> Your Listings
                </span>
              </BannerRibbon>
              <div className="space-y-3">
                {listings.map((l) => {
                  const p = getProductById(l.productId);
                  return (
                    <div key={l.id} className="panel flex items-center gap-4 p-4">
                      {p && (
                        <Link href={`/product/${p.slug}`}>
                          <CardArt product={p} showLabel={false} className="h-16 w-11" />
                        </Link>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-semibold text-ink">
                          {l.productName}
                        </p>
                        <p className="text-xs text-muted">
                          Listed {formatDate(l.createdAt)} · Condition {l.condition} · Qty {l.qty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-gold-bright">
                          {formatUSD(l.askPrice)}
                        </p>
                        <p className="text-[11px] text-muted">ask</p>
                      </div>
                      <span className="rounded-md bg-sea/15 px-2 py-0.5 text-[11px] font-bold uppercase text-sea-bright">
                        Active
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* watchlist */}
          {watched.length > 0 && (
            <section>
              <BannerRibbon eyebrow="Tracking" className="mb-5">
                <span className="inline-flex items-center gap-2">
                  <Heart className="h-5 w-5" /> Watchlist
                </span>
              </BannerRibbon>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {watched.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
