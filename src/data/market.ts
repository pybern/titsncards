import type { MarketData, MarketProfile, PricePoint, Sale } from "@/lib/types";
import { mulberry32, hashSeed } from "@/lib/utils";

// Anchor "today" to a fixed date so server & client renders always match
// (prevents hydration mismatches and keeps charts stable across reloads).
export const MARKET_TODAY = new Date("2026-06-01T00:00:00Z");
const DAY_MS = 86_400_000;
const HISTORY_DAYS = 365;

interface ProfileParams {
  drift: number; // per-day expected growth
  vol: number; // daily volatility
  spread: number; // bid/ask spread fraction
  volRange: [number, number]; // 30d sales volume
}

const profiles: Record<MarketProfile, ProfileParams> = {
  chase: { drift: 0.0011, vol: 0.052, spread: 0.05, volRange: [35, 180] },
  staple: { drift: 0.0004, vol: 0.03, spread: 0.04, volRange: [120, 420] },
  sealed: { drift: 0.0008, vol: 0.022, spread: 0.06, volRange: [12, 70] },
  "super-premium": {
    drift: 0.0016,
    vol: 0.034,
    spread: 0.07,
    volRange: [6, 34],
  },
};

function roundPrice(p: number) {
  if (p >= 100) return Math.round(p);
  return Math.round(p * 100) / 100;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * Build deterministic market data for a product.
 * Same id + basePrice always yields identical output (SSR-safe).
 */
export function buildMarket(
  id: string,
  basePrice: number,
  profile: MarketProfile,
): MarketData {
  const rng = mulberry32(hashSeed(id + ":mkt"));
  const params = profiles[profile];

  // Pseudo-Gaussian in [-1.5, 1.5]
  const gauss = () => rng() + rng() + rng() - 1.5;

  // Simulate a random walk, then rescale so the final price ≈ basePrice.
  const raw: number[] = [];
  let p = 1;
  for (let i = 0; i < HISTORY_DAYS; i++) {
    let change = params.drift + params.vol * gauss();
    // occasional hype spike / correction
    if (rng() < 0.025) change += (rng() < 0.5 ? -1 : 1) * 0.14;
    p = Math.max(0.05, p * (1 + change));
    raw.push(p);
  }
  const scale = basePrice / raw[raw.length - 1];

  const history: PricePoint[] = raw.map((v, i) => {
    const date = new Date(MARKET_TODAY.getTime() - (HISTORY_DAYS - 1 - i) * DAY_MS);
    return { t: isoDate(date), p: roundPrice(v * scale) };
  });

  const prices = history.map((h) => h.p);
  const last = prices[prices.length - 1];
  const prev = prices[prices.length - 2] ?? last;
  const wk = prices[prices.length - 8] ?? last;
  const mo = prices[prices.length - 31] ?? last;

  const weekHigh52 = Math.max(...prices);
  const weekLow52 = Math.min(...prices);

  const spread = params.spread;
  const bid = roundPrice(last * (1 - spread));
  const ask = roundPrice(last * (1 + spread));

  const [vlo, vhi] = params.volRange;
  const volume30d = Math.round(vlo + rng() * (vhi - vlo));

  // Recent sales — newest first, scattered over the last ~24 days.
  const recentSales: Sale[] = [];
  let offset = 0;
  const conds = ["NM", "NM", "LP", "NM", "MP", "LP"];
  for (let i = 0; i < 12; i++) {
    offset += Math.floor(rng() * 2.4) + 1;
    const date = new Date(
      MARKET_TODAY.getTime() - offset * DAY_MS - Math.floor(rng() * DAY_MS),
    );
    const noise = 1 + (gauss() / 1.5) * spread * 0.9;
    recentSales.push({
      t: date.toISOString(),
      price: roundPrice(last * noise),
      condition: conds[i % conds.length],
    });
  }

  const pct = (a: number, b: number) => ((a - b) / b) * 100;

  return {
    lastSale: last,
    bid,
    ask,
    change24hPct: +pct(last, prev).toFixed(1),
    change7dPct: +pct(last, wk).toFixed(1),
    change30dPct: +pct(last, mo).toFixed(1),
    weekHigh52,
    weekLow52,
    volume30d,
    history,
    recentSales,
  };
}
