import type { CartItem, Product } from "./types";
import { getProductById } from "./catalog";

export const FREE_SHIPPING_THRESHOLD = 150;
export const FLAT_SHIPPING = 6.99;
export const TAX_RATE = 0.0825;

export interface CartLine {
  product: Product;
  qty: number;
  lineTotal: number;
}

export function resolveCart(cart: CartItem[]): CartLine[] {
  return cart
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      return { product, qty: item.qty, lineTotal: product.price * item.qty };
    })
    .filter((x): x is CartLine => x !== null);
}

export interface Totals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export function computeTotals(lines: CartLine[]): Totals {
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { subtotal, shipping, tax, total, itemCount };
}

// ---------- payment validation (mock, never transmitted) ----------

export function detectCardBrand(number: string): string {
  const n = number.replace(/\s+/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(011|5)/.test(n)) return "Discover";
  return "Card";
}

/** Luhn checksum validation. */
export function luhnValid(number: string): boolean {
  const n = number.replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(n)) return false;
  let sum = 0;
  let alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function formatCardNumber(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 19);
  return n.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string): string {
  const n = value.replace(/\D/g, "").slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
}

export function expiryValid(value: string): boolean {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = parseInt(m[1], 10);
  const year = 2000 + parseInt(m[2], 10);
  if (month < 1 || month > 12) return false;
  const exp = new Date(year, month, 0, 23, 59, 59);
  // anchored to the same demo "today"
  return exp >= new Date("2026-06-01T00:00:00Z");
}

export function maskCard(number: string, brand: string): string {
  const n = number.replace(/\s+/g, "");
  return `${brand} •••• ${n.slice(-4)}`;
}

export function genOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TNC-${rand}`;
}
