import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const FOIL_RARITIES = new Set(["SR", "SEC", "SP", "L", "Metal", "Promo"]);

/**
 * Procedurally-styled art for a product (no external images needed).
 * Renders a card face for singles and a box face for sealed products.
 * Fills its container — set width/height/aspect on the parent via className.
 */
export function CardArt({
  product,
  className,
  showLabel = true,
}: {
  product: Product;
  className?: string;
  showLabel?: boolean;
}) {
  const [from, to] = product.art.gradient;
  const sealed = product.kind !== "single";
  const foil = !!product.rarity && FOIL_RARITIES.has(product.rarity);
  const metal = product.rarity === "Metal";

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-lg border border-white/10 shadow-inner",
        className,
      )}
      style={{
        background: `radial-gradient(120% 80% at 50% 0%, ${to} 0%, ${from} 70%, #05070f 100%)`,
      }}
    >
      {/* decorative rays */}
      <svg
        viewBox="0 0 100 140"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-25"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`ray-${product.id}`} cx="50%" cy="22%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {Array.from({ length: 12 }).map((_, i) => (
          <polygon
            key={i}
            points="50,30 47,150 53,150"
            fill={`url(#ray-${product.id})`}
            transform={`rotate(${i * 30} 50 30)`}
          />
        ))}
      </svg>

      {/* inner frame */}
      <div className="absolute inset-1.5 rounded-md border border-white/15" />

      {/* emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "font-display font-black tracking-tight text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]",
            sealed ? "text-[clamp(1rem,18cqw,2.6rem)]" : "text-[clamp(1.4rem,34cqw,3.4rem)]",
          )}
          style={{ containerType: "inline-size" } as React.CSSProperties}
        >
          {product.art.emblem}
        </span>
      </div>

      {/* foil shimmer */}
      {foil && (
        <div
          className={cn(
            "foil pointer-events-none absolute inset-0 mix-blend-overlay",
            metal && "opacity-90",
          )}
        />
      )}
      {metal && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20" />
      )}

      {/* top tags */}
      <div className="absolute left-2 top-2 flex items-center gap-1">
        <span className="rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/90">
          {product.releaseCode}
        </span>
      </div>
      {product.rarity && (
        <div className="absolute right-2 top-2 rounded bg-black/45 px-1.5 py-0.5 text-[9px] font-black text-gold-bright">
          {product.rarity}
        </div>
      )}

      {/* bottom label */}
      {showLabel && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-6">
          <p className="line-clamp-1 text-[11px] font-bold text-white drop-shadow">
            {product.name}
          </p>
          {!sealed && product.cardNumber && (
            <p className="font-mono text-[9px] text-white/60">
              {product.cardNumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
