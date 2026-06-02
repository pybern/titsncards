"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";
import { resolveCart, computeTotals, FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import { CardArt } from "@/components/catalog/CardArt";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatUSD } from "@/lib/utils";
import { OrderSummary } from "@/components/commerce/OrderSummary";

export default function CartPage() {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const hydrated = useHydrated();

  const lines = resolveCart(cart);
  const totals = computeTotals(lines);
  const toFree = FREE_SHIPPING_THRESHOLD - totals.subtotal;

  if (!hydrated) {
    return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-black text-gold-gradient sm:text-4xl">
        Your Hold
      </h1>
      <p className="mt-1 text-muted">
        {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} ready to
        set sail.
      </p>

      {lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<ShoppingCart className="h-7 w-7" />}
            title="Your hold is empty"
            description="Load up on packs, boxes, and singles before you set sail."
            action={
              <Button href="/releases" variant="gold">
                Browse releases
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* lines */}
          <div className="space-y-3">
            {toFree > 0 && (
              <div className="panel p-4">
                <p className="text-sm text-muted">
                  Add{" "}
                  <span className="font-bold text-gold-bright">
                    {formatUSD(toFree)}
                  </span>{" "}
                  more for free shipping.
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-bright transition-all"
                    style={{
                      width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {lines.map(({ product, qty, lineTotal }) => (
              <div
                key={product.id}
                className="panel flex gap-4 p-4"
              >
                <Link href={`/product/${product.slug}`} className="shrink-0">
                  <CardArt product={product} showLabel={false} className="h-28 w-20" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${product.slug}`}
                        className="line-clamp-1 font-display font-bold text-ink hover:text-gold-bright"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted">
                        {product.subtitle ?? product.cardNumber ?? product.releaseCode}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {formatUSD(product.price)} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-muted transition hover:text-down"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 rounded-md border border-hairline">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink"
                        aria-label="Decrease"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-ink">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted hover:text-ink"
                        aria-label="Increase"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-display text-lg font-bold text-gold-bright">
                      {formatUSD(lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* summary */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <OrderSummary totals={totals} />
            <Button href="/checkout" variant="gold" className="mt-4 w-full">
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Button>
            <Link
              href="/releases"
              className="mt-3 block text-center text-sm text-muted hover:text-ink"
            >
              Continue browsing
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
