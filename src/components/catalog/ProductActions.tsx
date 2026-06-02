"use client";

import { useRouter } from "next/navigation";
import { Heart, Zap, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/components/providers/StoreProvider";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useStore((s) => s.addToCart);
  const watchlist = useStore((s) => s.watchlist);
  const toggleWatch = useStore((s) => s.toggleWatch);
  const hydrated = useHydrated();
  const soldOut = product.inStock <= 0;
  const watched = hydrated && watchlist.includes(product.id);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="gold"
          size="lg"
          className="flex-1"
          disabled={soldOut}
          onClick={() => {
            addToCart(product.id);
            toast({
              kind: "success",
              title: "Added to your hold",
              description: `${product.name} · ${product.releaseCode}`,
            });
          }}
        >
          <ShoppingCart className="h-5 w-5" />
          {soldOut ? "Sold out" : "Add to hold"}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={soldOut}
          onClick={() => {
            addToCart(product.id);
            router.push("/checkout");
          }}
        >
          <Zap className="h-5 w-5" />
          Buy now
        </Button>
      </div>
      <button
        onClick={() => {
          toggleWatch(product.id);
          toast({
            kind: "info",
            title: watched ? "Removed from watchlist" : "Added to watchlist",
            description: product.name,
          });
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition",
          watched
            ? "border-crimson/50 bg-crimson/10 text-crimson-bright"
            : "border-hairline bg-panel-light text-muted hover:border-gold/40 hover:text-ink",
        )}
      >
        <Heart className={cn("h-4 w-4", watched && "fill-current")} />
        {watched ? "On your watchlist" : "Add to watchlist"}
      </button>
    </div>
  );
}
