"use client";

import { ShoppingCart } from "lucide-react";
import { useStore, selectCartCount } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";

export function CartButton() {
  const count = useStore(selectCartCount);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const hydrated = useHydrated();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-panel-light text-ink transition hover:border-gold/60 hover:text-gold-bright"
      aria-label="Open cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {hydrated && count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold text-white ring-2 ring-abyss">
          {count}
        </span>
      )}
    </button>
  );
}
