# Tits n' Cards 🏴‍☠️🃏

> **Built by players, for players.** A One Piece Trading Card Game marketplace —
> buy sealed product, snipe chase singles, and track the market like a pro.

A modern, fully front-end demo e-commerce app for the One Piece Card Game with a
dark, epic "game" aesthetic (Blizzard/WoW-style fantasy UI meets One Piece pirate
flavor). All catalog data, orders, payments, listings, and prices are **simulated**
for demonstration purposes — _not affiliated with Bandai or Eiichiro Oda._

## Features

- **🗺️ Releases across three lines** — browse the **OP** main booster sets
  (OP‑01 → OP‑14), **PRB** premium boosters (The Best Vol. 1 & 2), and the **SPC**
  Super Premium Collection (luxury sealed collector boxes with exclusive metal
  Nami promos). Mega‑menu, releases index, and per‑release pages with rarity /
  color / type / product filters.
- **🛒 Mock orders & payments** — cart, a validated checkout (shipping + card
  details with **Luhn** validation, expiry & CVC checks — nothing is ever
  transmitted), simulated processing, and an order confirmation page. Order
  history persists locally.
- **🏷️ Sell flow** — list any card or sealed product for sale with condition,
  ask price (pre‑filled from the market), and a live payout preview (minus a mock
  10% fee).
- **📈 StockX‑style price tracker** — a sortable, searchable market index with top
  movers and sparklines, plus per‑item history pages featuring an interactive SVG
  price chart (1M/3M/6M/1Y/All ranges + hover tooltip), last sale / bid / ask /
  52‑week high‑low / 30‑day volume stats, recent sales, and a mock bid/ask order
  form.
- **🎨 Original generated art** — hero, market banner, and line emblems plus
  procedural CSS/SVG card & box faces (no copyrighted assets).

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS‑first `@theme` design tokens)
- **zustand** (+ persist) for cart, watchlist, orders & listings
- **lucide-react** icons, **next/font** (Cinzel + Inter)
- Hand‑built **SVG** charts (no chart dependency)
- Deterministic, **seeded** mock price history (hydration‑safe)

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build (typecheck + prerender)
npm run lint       # eslint
```

## Project structure

```
src/
  app/                 # routes (home, releases, product, market, cart, checkout, sell, orders, search)
  components/
    layout/            # header (mega-menu), footer, brand
    catalog/           # ProductCard, CardArt, FilterableGrid, ReleaseCard, actions
    market/            # PriceChart, MarketTable, Sparkline, MoverCard, StatGrid, BidAskForm
    commerce/          # OrderSummary
    cart/              # CartDrawer, CartButton
    ui/                # Button, Panel, Badge, Toast, EmptyState
    providers/         # StoreProvider (hydration-safe)
  data/                # releases, characters, products (catalog builder), market generator
  lib/                 # types, store, catalog helpers, commerce (totals + card validation), utils
scripts/
  check-data.ts        # data sanity checks  (npx tsx scripts/check-data.ts)
  e2e.mjs              # commerce flow e2e   (node scripts/e2e.mjs — needs dev server)
  market-e2e.mjs       # market flow e2e
```

## Testing

- `npx tsx scripts/check-data.ts` — validates the mock data layer (unique
  slugs/ids, 365‑point histories, valid prices, SPC contents, determinism).
- `node scripts/e2e.mjs` & `node scripts/market-e2e.mjs` — Puppeteer end‑to‑end
  flows (add‑to‑cart → checkout validation → order confirmation; market chart,
  sorting, range toggles, bid placement). Run with the dev server up.

---

_This is a demonstration project. All commerce is simulated; no real payments are
processed and no real card data is stored or transmitted._
