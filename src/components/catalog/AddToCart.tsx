"use client";

import { useState } from "react";
import { ShoppingCart, Check, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  className,
  size = "md",
  label = "Add to hold",
}: {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const addToCart = useStore((s) => s.addToCart);
  const soldOut = product.inStock <= 0;

  return (
    <Button
      variant="gold"
      size={size}
      className={className}
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
      <ShoppingCart className="h-4 w-4" />
      {soldOut ? "Sold out" : label}
    </Button>
  );
}

/** Compact icon-only quick add used on product cards. */
export function QuickAdd({ product }: { product: Product }) {
  const addToCart = useStore((s) => s.addToCart);
  const [added, setAdded] = useState(false);
  const soldOut = product.inStock <= 0;

  return (
    <button
      disabled={soldOut}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
        toast({
          kind: "success",
          title: "Added to your hold",
          description: `${product.name} · ${product.releaseCode}`,
        });
      }}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
        soldOut
          ? "cursor-not-allowed border-hairline text-muted opacity-50"
          : "border-gold/50 bg-gold/10 text-gold-bright hover:bg-gold hover:text-abyss",
      )}
      aria-label="Add to cart"
      title={soldOut ? "Sold out" : "Add to hold"}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
