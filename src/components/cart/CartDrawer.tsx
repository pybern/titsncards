"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";
import { getProductById } from "@/lib/catalog";
import { formatUSD, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CardArt } from "@/components/catalog/CardArt";

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const hydrated = useHydrated();

  const lines = cart
    .map((item) => ({ item, product: getProductById(item.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce(
    (sum, l) => sum + (l.product?.price ?? 0) * l.item.qty,
    0,
  );

  return (
    <>
      {/* overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      {/* panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col border-l border-gold/30 bg-abyss-light shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-gold-bright">
            <ShoppingCart className="h-5 w-5" /> Your Hold
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-muted transition hover:text-ink"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!hydrated ? null : lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingCart className="h-12 w-12 text-hairline" />
              <p className="font-semibold text-ink">Your hold is empty</p>
              <p className="text-sm text-muted">
                Plunder some packs and singles to fill it up.
              </p>
              <Button href="/releases" variant="secondary" size="sm" onClick={() => setOpen(false)}>
                Browse releases
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map(({ item, product }) => (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-lg border border-hairline bg-panel p-3"
                >
                  <Link
                    href={`/product/${product!.slug}`}
                    onClick={() => setOpen(false)}
                    className="shrink-0"
                  >
                    <CardArt product={product!} className="h-20 w-14" showLabel={false} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product!.slug}`}
                      onClick={() => setOpen(false)}
                      className="line-clamp-1 text-sm font-semibold text-ink hover:text-gold-bright"
                    >
                      {product!.name}
                    </Link>
                    <p className="text-xs text-muted">{product!.subtitle ?? product!.cardNumber ?? product!.releaseCode}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-hairline">
                        <button
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center text-muted hover:text-ink"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.productId, item.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center text-muted hover:text-ink"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gold-bright">
                        {formatUSD(product!.price * item.qty)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="self-start text-muted transition hover:text-down"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hydrated && lines.length > 0 && (
          <div className="border-t border-hairline px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-display text-xl font-bold text-gold-gradient">
                {formatUSD(subtotal)}
              </span>
            </div>
            <Button href="/checkout" variant="gold" className="w-full" onClick={() => setOpen(false)}>
              Set sail to checkout
            </Button>
            <button
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-center text-xs text-muted hover:text-ink"
            >
              Continue browsing
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
