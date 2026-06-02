import { cn } from "@/lib/utils";
import type { CardColor, Rarity } from "@/lib/types";

const rarityStyles: Record<Rarity, string> = {
  C: "bg-slate-600/30 text-slate-200 border-slate-400/40",
  UC: "bg-emerald-700/25 text-emerald-200 border-emerald-400/40",
  R: "bg-sky-700/25 text-sky-200 border-sky-400/40",
  SR: "bg-violet-700/30 text-violet-200 border-violet-400/50",
  SEC: "bg-gradient-to-r from-amber-500/30 to-rose-500/30 text-amber-100 border-amber-300/60",
  SP: "bg-gradient-to-r from-fuchsia-600/30 to-amber-500/30 text-fuchsia-100 border-fuchsia-300/60",
  L: "bg-crimson/30 text-rose-100 border-crimson-bright/60",
  Promo: "bg-teal-700/25 text-teal-100 border-teal-400/40",
  Metal:
    "bg-gradient-to-r from-zinc-300/40 to-slate-400/30 text-white border-zinc-200/70",
};

const rarityLabel: Record<Rarity, string> = {
  C: "Common",
  UC: "Uncommon",
  R: "Rare",
  SR: "Super Rare",
  SEC: "Secret Rare",
  SP: "Special Rare",
  L: "Leader",
  Promo: "Promo",
  Metal: "Metal Promo",
};

export function RarityBadge({
  rarity,
  full,
  className,
}: {
  rarity: Rarity;
  full?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        rarityStyles[rarity],
        className,
      )}
      title={rarityLabel[rarity]}
    >
      {full ? rarityLabel[rarity] : rarity}
    </span>
  );
}

const colorHex: Record<CardColor, string> = {
  Red: "var(--color-tcg-red)",
  Green: "var(--color-tcg-green)",
  Blue: "var(--color-tcg-blue)",
  Purple: "var(--color-tcg-purple)",
  Black: "var(--color-tcg-black)",
  Yellow: "var(--color-tcg-yellow)",
};

export function ColorPill({
  color,
  className,
}: {
  color: CardColor;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] font-medium text-ink",
        className,
      )}
    >
      <span
        className="h-2.5 w-2.5 rounded-full ring-1 ring-white/30"
        style={{ backgroundColor: colorHex[color] }}
      />
      {color}
    </span>
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[11px] font-medium text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { colorHex, rarityLabel };
