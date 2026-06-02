import { products } from "@/data/products";
import { releases, lineMeta, lineOrder } from "@/data/releases";
import type { Line, Product, Release } from "@/lib/types";

export { lineMeta, lineOrder };

export function getReleases(): Release[] {
  return [...releases].sort(
    (a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate),
  );
}

export function getReleasesByLine(): Record<Line, Release[]> {
  const map: Record<Line, Release[]> = { OP: [], PRB: [], SPC: [] };
  for (const r of releases) map[r.line].push(r);
  // newest first within each line
  for (const line of lineOrder) {
    map[line].sort(
      (a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate),
    );
  }
  return map;
}

export function getRelease(code: string): Release | undefined {
  return releases.find((r) => r.code.toLowerCase() === code.toLowerCase());
}

export function getProductsByRelease(code: string): Product[] {
  const order: Record<string, number> = {
    "super-premium": 0,
    "premium-box": 1,
    "booster-box": 2,
    "booster-pack": 3,
    "starter-deck": 4,
    single: 5,
  };
  return products
    .filter((p) => p.releaseCode.toLowerCase() === code.toLowerCase())
    .sort((a, b) => {
      const ko = (order[a.kind] ?? 9) - (order[b.kind] ?? 9);
      if (ko !== 0) return ko;
      return b.price - a.price;
    });
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getFeatured(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getTrackerProducts(): Product[] {
  return products.filter((p) => p.market);
}

/** Top movers by 24h change (gainers desc, losers asc). */
export function getMovers(limit = 6): { gainers: Product[]; losers: Product[] } {
  const tracked = getTrackerProducts();
  const byChange = [...tracked].sort(
    (a, b) => (b.market!.change24hPct) - (a.market!.change24hPct),
  );
  return {
    gainers: byChange.slice(0, limit),
    losers: byChange.slice(-limit).reverse(),
  };
}

export function getTrending(limit = 8): Product[] {
  return products
    .filter((p) => p.trending && p.market)
    .sort(
      (a, b) =>
        Math.abs(b.market!.change7dPct) - Math.abs(a.market!.change7dPct),
    )
    .slice(0, limit);
}

export function searchProducts(query: string, limit = 40): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.releaseCode.toLowerCase().includes(q) ||
        (p.cardNumber?.toLowerCase().includes(q) ?? false) ||
        (p.rarity?.toLowerCase().includes(q) ?? false) ||
        (p.color?.toLowerCase().includes(q) ?? false) ||
        p.kind.toLowerCase().includes(q)
      );
    })
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.releaseCode === product.releaseCode ||
          (p.color && p.color === product.color)),
    )
    .sort((a, b) => {
      const sameSetA = a.releaseCode === product.releaseCode ? 0 : 1;
      const sameSetB = b.releaseCode === product.releaseCode ? 0 : 1;
      return sameSetA - sameSetB || b.price - a.price;
    })
    .slice(0, limit);
}
