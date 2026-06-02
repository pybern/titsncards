"use client";

import { useMemo, useState } from "react";
import { Search, Tag, X, TrendingUp, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { searchProducts, getMovers } from "@/lib/catalog";
import { CardArt } from "@/components/catalog/CardArt";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { RarityBadge } from "@/components/ui/Badge";
import { formatUSD, cn } from "@/lib/utils";
import type { CardCondition, Product, Listing } from "@/lib/types";

const MARKETPLACE_FEE = 0.1;
const conditions: { key: CardCondition; label: string; mult: number }[] = [
  { key: "NM", label: "Near Mint", mult: 1 },
  { key: "LP", label: "Lightly Played", mult: 0.85 },
  { key: "MP", label: "Moderately Played", mult: 0.7 },
  { key: "HP", label: "Heavily Played", mult: 0.55 },
];

export default function SellPage() {
  const addListing = useStore((s) => s.addListing);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [ask, setAsk] = useState("");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState<Listing | null>(null);

  const suggestions = useMemo(
    () => (query.trim() ? searchProducts(query, 8) : []),
    [query],
  );
  const featured = useMemo(() => getMovers(4).gainers, []);

  const conditionMult = conditions.find((c) => c.key === condition)!.mult;

  function selectProduct(p: Product) {
    setSelected(p);
    setQuery("");
    const base = p.market?.ask ?? p.price;
    setAsk((base * conditionMult).toFixed(2));
  }

  function onCondition(c: CardCondition) {
    setCondition(c);
    if (selected) {
      const base = selected.market?.ask ?? selected.price;
      const mult = conditions.find((x) => x.key === c)!.mult;
      setAsk((base * mult).toFixed(2));
    }
  }

  const askNum = parseFloat(ask) || 0;
  const gross = askNum * qty;
  const fee = gross * MARKETPLACE_FEE;
  const payout = gross - fee;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || askNum <= 0) return;
    const listing: Listing = {
      id: `LIST-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      productId: selected.id,
      productName: selected.name,
      askPrice: askNum,
      condition,
      qty,
      createdAt: new Date().toISOString(),
    };
    addListing(listing);
    setDone(listing);
    toast({
      kind: "success",
      title: "Listing created (simulated)",
      description: `${selected.name} · ${formatUSD(askNum)}`,
    });
    setSelected(null);
    setAsk("");
    setQty(1);
    setCondition("NM");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
        Cash in your collection
      </p>
      <h1 className="mt-1 font-display text-3xl font-black text-gold-gradient sm:text-4xl">
        Sell Your Cards
      </h1>
      <p className="mt-2 text-muted">
        List any card or sealed product on the Tits n&apos; Cards marketplace.
        We&apos;ll match you with buyers — you keep the bounty (minus a 10% fee).
        This is a simulated listing flow.
      </p>

      {done && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-up/40 bg-up/10 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-up" />
          <div className="text-sm">
            <p className="font-semibold text-ink">
              Listing {done.id} is live (simulated).
            </p>
            <p className="text-muted">
              {done.productName} · {done.condition} · {formatUSD(done.askPrice)} ·
              view it under{" "}
              <a href="/orders" className="font-semibold text-gold-bright underline">
                your listings
              </a>
              .
            </p>
          </div>
          <button onClick={() => setDone(null)} className="ml-auto text-muted hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="panel mt-8 space-y-6 p-6">
        {/* 1. pick a card */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            1 · What are you selling?
          </label>
          {selected ? (
            <div className="flex items-center gap-3 rounded-lg border border-gold/40 bg-gold/5 p-3">
              <CardArt product={selected} showLabel={false} className="h-16 w-11" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-semibold text-ink">{selected.name}</p>
                <p className="text-xs text-muted">
                  {selected.cardNumber ?? selected.releaseCode}
                  {selected.market && ` · market ask ${formatUSD(selected.market.ask)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-muted hover:text-down"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a card or product (e.g. Shanks, OP-05, booster box)…"
                className="h-11 w-full rounded-lg border border-hairline bg-panel-light pl-9 pr-3 text-sm text-ink placeholder:text-muted/60 focus:border-gold/60 focus:outline-none"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-hairline bg-abyss-light shadow-2xl">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => selectProduct(p)}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-white/5"
                      >
                        <CardArt product={p} showLabel={false} className="h-12 w-8" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-semibold text-ink">
                            {p.name}
                          </p>
                          <p className="text-xs text-muted">
                            {p.cardNumber ?? p.releaseCode}
                          </p>
                        </div>
                        {p.rarity && <RarityBadge rarity={p.rarity} />}
                        <span className="text-sm font-semibold text-gold-bright">
                          {formatUSD(p.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {!selected && (
            <div className="mt-3">
              <p className="mb-2 flex items-center gap-1 text-xs text-muted">
                <TrendingUp className="h-3.5 w-3.5" /> Hot right now
              </p>
              <div className="flex flex-wrap gap-2">
                {featured.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProduct(p)}
                    className="rounded-full border border-hairline bg-black/20 px-3 py-1 text-xs text-muted transition hover:border-gold/40 hover:text-ink"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. condition */}
        <div className={cn(!selected && "pointer-events-none opacity-40")}>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            2 · Condition
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {conditions.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => onCondition(c.key)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-center transition",
                  condition === c.key
                    ? "border-gold/60 bg-gold/15 text-gold-bright"
                    : "border-hairline bg-black/20 text-muted hover:border-gold/40 hover:text-ink",
                )}
              >
                <span className="block text-sm font-bold">{c.key}</span>
                <span className="block text-[10px]">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. price & qty */}
        <div className={cn("grid grid-cols-2 gap-4", !selected && "pointer-events-none opacity-40")}>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              3 · Your ask (per unit)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm text-muted">$</span>
              <input
                inputMode="decimal"
                value={ask}
                onChange={(e) => setAsk(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                className="h-11 w-full rounded-lg border border-hairline bg-panel-light pl-7 pr-3 text-sm text-ink focus:border-gold/60 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-11 w-full rounded-lg border border-hairline bg-panel-light px-3 text-sm text-ink focus:border-gold/60 focus:outline-none"
            />
          </div>
        </div>

        {/* payout */}
        <div className="rounded-lg border border-hairline bg-black/20 p-4">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted">
              <span>Gross ({qty} × {formatUSD(askNum)})</span>
              <span className="text-ink">{formatUSD(gross)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Marketplace fee (10%)</span>
              <span className="text-down">−{formatUSD(fee)}</span>
            </div>
            <div className="my-2 rule-gold" />
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-ink">Your payout</span>
              <span className="font-display text-xl font-black text-gold-gradient">
                {formatUSD(payout)}
              </span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          className="w-full"
          disabled={!selected || askNum <= 0}
        >
          <Tag className="h-4 w-4" />
          List for sale
        </Button>
      </form>
    </div>
  );
}
