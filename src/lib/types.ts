// ============================================================
// Core domain types for Tits n' Cards
// ============================================================

export type Line = "OP" | "PRB" | "SPC";

export type CardColor =
  | "Red"
  | "Green"
  | "Blue"
  | "Purple"
  | "Black"
  | "Yellow";

export type Rarity =
  | "C"
  | "UC"
  | "R"
  | "SR"
  | "SEC"
  | "SP"
  | "L"
  | "Promo"
  | "Metal";

export type CardType = "Leader" | "Character" | "Event" | "Stage" | "DON";

export type ProductKind =
  | "single"
  | "booster-box"
  | "booster-pack"
  | "starter-deck"
  | "premium-box"
  | "super-premium";

export type MarketProfile = "chase" | "staple" | "sealed" | "super-premium";

export interface Release {
  code: string; // e.g. "OP-01"
  line: Line;
  name: string; // e.g. "Romance Dawn"
  releaseDate: string; // ISO date
  arc: string; // flavorful arc/theme tag
  description: string;
  cardCount: number;
  accent: string; // hex color for banners
  emblem: Line; // which emblem image to use
}

export interface PricePoint {
  t: string; // ISO date
  p: number; // price
}

export interface Sale {
  t: string; // ISO date-time
  price: number;
  condition?: string;
}

export interface MarketData {
  lastSale: number;
  bid: number;
  ask: number;
  change24hPct: number;
  change7dPct: number;
  change30dPct: number;
  weekHigh52: number;
  weekLow52: number;
  volume30d: number; // number of sales
  history: PricePoint[]; // ~365 daily points
  recentSales: Sale[];
}

export interface ProductArt {
  gradient: [string, string];
  emblem: string; // short label / initial used in procedural art
  motif?: string; // optional descriptor
}

export interface Product {
  id: string; // e.g. "OP01-001"
  slug: string;
  kind: ProductKind;
  name: string;
  subtitle?: string;
  releaseCode: string;
  line: Line;

  // single-card fields (optional for sealed)
  cardNumber?: string;
  rarity?: Rarity;
  color?: CardColor;
  type?: CardType;
  cost?: number;
  power?: number;
  counter?: number;
  life?: number;
  attribute?: string;
  effect?: string;

  // sealed metadata
  contents?: string[];

  // commerce
  price: number;
  inStock: number;
  featured?: boolean;
  trending?: boolean;

  art: ProductArt;
  market?: MarketData; // present for tracker-eligible items
  description: string;
}

// ---- Commerce (client-side, persisted) ----

export interface CartItem {
  productId: string;
  qty: number;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  ship: ShippingInfo;
  paymentBrandMasked: string; // e.g. "Visa •••• 4242"
  status: "confirmed" | "processing" | "shipped";
}

export type CardCondition = "NM" | "LP" | "MP" | "HP";

export interface Listing {
  id: string;
  productId: string;
  productName: string;
  askPrice: number;
  condition: CardCondition;
  qty: number;
  createdAt: string;
}
