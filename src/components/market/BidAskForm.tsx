"use client";

import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useStore } from "@/lib/store";
import { formatUSD, cn } from "@/lib/utils";

type Side = "buy" | "sell";

export function BidAskForm({ product }: { product: Product }) {
  const m = product.market!;
  const [side, setSide] = useState<Side>("buy");
  const [price, setPrice] = useState(String(side === "buy" ? m.bid : m.ask));
  const [expiry, setExpiry] = useState("30");
  const addToCart = useStore((s) => s.addToCart);

  function switchSide(s: Side) {
    setSide(s);
    setPrice(String(s === "buy" ? m.bid : m.ask));
  }

  const priceNum = parseFloat(price) || 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast({
      kind: "success",
      title: side === "buy" ? "Bid placed (simulated)" : "Ask placed (simulated)",
      description: `${product.name} @ ${formatUSD(priceNum)} · ${expiry}-day expiry`,
    });
  }

  return (
    <div className="panel p-5">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg border border-hairline p-1">
        <button
          onClick={() => switchSide("buy")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-bold transition",
            side === "buy" ? "bg-up/15 text-up" : "text-muted hover:text-ink",
          )}
        >
          <ArrowDownToLine className="h-4 w-4" /> Buy
        </button>
        <button
          onClick={() => switchSide("sell")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-bold transition",
            side === "sell" ? "bg-down/15 text-down" : "text-muted hover:text-ink",
          )}
        >
          <ArrowUpFromLine className="h-4 w-4" /> Sell
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-black/20 p-3 text-sm">
          <span className="text-muted">
            {side === "buy" ? "Lowest Ask" : "Highest Bid"}
          </span>
          <span className="font-display font-bold text-ink">
            {formatUSD(side === "buy" ? m.ask : m.bid)}
          </span>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Your {side === "buy" ? "bid" : "ask"} price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-sm text-muted">$</span>
            <input
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
              className="h-11 w-full rounded-lg border border-hairline bg-panel-light pl-7 pr-3 text-sm text-ink focus:border-gold/60 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Order expires in
          </label>
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="h-11 w-full rounded-lg border border-hairline bg-panel-light px-3 text-sm text-ink focus:border-gold/60 focus:outline-none"
          >
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
          </select>
        </div>

        <Button
          type="submit"
          variant={side === "buy" ? "gold" : "secondary"}
          className="w-full"
        >
          Place {side === "buy" ? "Bid" : "Ask"} · {formatUSD(priceNum)}
        </Button>

        {side === "buy" && product.inStock > 0 && (
          <button
            type="button"
            onClick={() => {
              addToCart(product.id);
              toast({
                kind: "success",
                title: "Added to your hold",
                description: `Buy now at ${formatUSD(product.price)}`,
              });
            }}
            className="w-full rounded-lg border border-hairline py-2.5 text-sm font-semibold text-muted transition hover:border-gold/40 hover:text-ink"
          >
            Or buy now at ask · {formatUSD(product.price)}
          </button>
        )}
        <p className="text-center text-[11px] text-muted">
          All orders are simulated for this demo.
        </p>
      </form>
    </div>
  );
}
