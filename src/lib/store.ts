"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Order, Listing } from "./types";

interface StoreState {
  // cart
  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;

  // watchlist
  watchlist: string[];
  toggleWatch: (productId: string) => void;

  // orders
  orders: Order[];
  addOrder: (order: Order) => void;

  // listings (sell)
  listings: Listing[];
  addListing: (listing: Listing) => void;

  // cart drawer UI
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (productId, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((i) => i.productId === productId);
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.productId === productId ? { ...i, qty: i.qty + qty } : i,
              ),
              cartOpen: true,
            };
          }
          return { cart: [...s.cart, { productId, qty }], cartOpen: true };
        }),
      removeFromCart: (productId) =>
        set((s) => ({ cart: s.cart.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((i) => i.productId !== productId)
              : s.cart.map((i) =>
                  i.productId === productId ? { ...i, qty } : i,
                ),
        })),
      clearCart: () => set({ cart: [] }),

      watchlist: [],
      toggleWatch: (productId) =>
        set((s) => ({
          watchlist: s.watchlist.includes(productId)
            ? s.watchlist.filter((id) => id !== productId)
            : [...s.watchlist, productId],
        })),

      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),

      listings: [],
      addListing: (listing) =>
        set((s) => ({ listings: [listing, ...s.listings] })),

      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),
    }),
    {
      name: "tnc-store",
      storage: createJSONStorage(() => localStorage),
      // Avoid SSR hydration mismatch; we rehydrate manually in StoreProvider.
      skipHydration: true,
      partialize: (s) => ({
        cart: s.cart,
        watchlist: s.watchlist,
        orders: s.orders,
        listings: s.listings,
      }),
    },
  ),
);

// ---- selectors / helpers ----
export const selectCartCount = (s: StoreState) =>
  s.cart.reduce((n, i) => n + i.qty, 0);
