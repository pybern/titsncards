"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { CardColor, Product, Rarity } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-desc" | "price-asc" | "movers" | "name";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-desc", label: "Price: High → Low" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "movers", label: "Top 24h Movers" },
  { key: "name", label: "Name A–Z" },
];

const kindLabels: Record<string, string> = {
  single: "Singles",
  "booster-box": "Booster Boxes",
  "booster-pack": "Packs",
  "starter-deck": "Starter Decks",
  "premium-box": "Premium Boxes",
  "super-premium": "Super Premium",
};

export function FilterableGrid({ products }: { products: Product[] }) {
  const [rarities, setRarities] = useState<Set<Rarity>>(new Set());
  const [colors, setColors] = useState<Set<CardColor>>(new Set());
  const [kinds, setKinds] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortKey>("featured");
  const [open, setOpen] = useState(false);

  const available = useMemo(() => {
    const r = new Set<Rarity>();
    const c = new Set<CardColor>();
    const k = new Set<string>();
    for (const p of products) {
      if (p.rarity) r.add(p.rarity);
      if (p.color) c.add(p.color);
      k.add(p.kind);
    }
    return {
      rarities: [...r],
      colors: [...c],
      kinds: [...k],
    };
  }, [products]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (rarities.size && (!p.rarity || !rarities.has(p.rarity))) return false;
      if (colors.size && (!p.color || !colors.has(p.color))) return false;
      if (kinds.size && !kinds.has(p.kind)) return false;
      return true;
    });
    const sorted = [...list];
    switch (sort) {
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "movers":
        sorted.sort(
          (a, b) =>
            (b.market?.change24hPct ?? -999) - (a.market?.change24hPct ?? -999),
        );
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.price - a.price,
        );
    }
    return sorted;
  }, [products, rarities, colors, kinds, sort]);

  function toggle<T>(set: Set<T>, value: T, update: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update(next);
  }

  const activeCount = rarities.size + colors.size + kinds.size;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      {/* filters */}
      <aside className={cn("lg:block", open ? "block" : "hidden")}>
        <div className="panel sticky top-20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-gold-bright">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            {activeCount > 0 && (
              <button
                onClick={() => {
                  setRarities(new Set());
                  setColors(new Set());
                  setKinds(new Set());
                }}
                className="text-[11px] text-muted hover:text-down"
              >
                Clear ({activeCount})
              </button>
            )}
          </div>

          {available.kinds.length > 1 && (
            <FilterGroup title="Product">
              {available.kinds.map((k) => (
                <Chip
                  key={k}
                  active={kinds.has(k)}
                  onClick={() => toggle(kinds, k, setKinds)}
                >
                  {kindLabels[k] ?? k}
                </Chip>
              ))}
            </FilterGroup>
          )}

          {available.rarities.length > 0 && (
            <FilterGroup title="Rarity">
              {available.rarities.map((r) => (
                <Chip
                  key={r}
                  active={rarities.has(r)}
                  onClick={() => toggle(rarities, r, setRarities)}
                >
                  {r}
                </Chip>
              ))}
            </FilterGroup>
          )}

          {available.colors.length > 0 && (
            <FilterGroup title="Color">
              {available.colors.map((c) => (
                <Chip
                  key={c}
                  active={colors.has(c)}
                  onClick={() => toggle(colors, c, setColors)}
                >
                  {c}
                </Chip>
              ))}
            </FilterGroup>
          )}
        </div>
      </aside>

      {/* grid */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-hairline bg-panel-light px-3 py-2 text-sm font-semibold text-ink lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden text-sm text-muted lg:block">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs text-muted">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-hairline bg-panel-light px-3 py-2 text-sm text-ink focus:border-gold/60 focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="panel px-6 py-16 text-center text-muted">
            No items match those filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 border-t border-hairline pt-3 first:border-t-0 first:pt-0">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs font-semibold transition",
        active
          ? "border-gold/60 bg-gold/15 text-gold-bright"
          : "border-hairline bg-black/20 text-muted hover:border-gold/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
