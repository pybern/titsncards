import type {
  CardColor,
  CardType,
  MarketProfile,
  Product,
  Rarity,
} from "@/lib/types";
import { releases } from "./releases";
import { findCharacter } from "./characters";
import { buildMarket } from "./market";
import { slugify } from "@/lib/utils";

// ---------- art helpers ----------
const colorGradients: Record<CardColor, [string, string]> = {
  Red: ["#5e1212", "#e0443f"],
  Green: ["#0f3d22", "#34b06a"],
  Blue: ["#0c2f5e", "#3b87e0"],
  Purple: ["#2e1659", "#9a6cf0"],
  Black: ["#15191f", "#6b7687"],
  Yellow: ["#5e470a", "#ecc02e"],
};

// ---------- single-card seeds ----------
interface SingleSeed {
  set: string;
  num: string;
  name: string;
  rarity: Rarity;
  type: CardType;
  color: CardColor;
  cost?: number;
  power?: number;
  counter?: number;
  life?: number;
  attribute?: string;
  price: number;
  featured?: boolean;
  trending?: boolean;
  effect?: string;
}

const singleSeeds: SingleSeed[] = [
  // ---- OP-01 Romance Dawn ----
  { set: "OP-01", num: "001", name: "Monkey D. Luffy", rarity: "L", type: "Leader", color: "Red", life: 5, power: 5000, price: 18.5, effect: "[Activate: Main] [Once Per Turn] Give up to 1 of your Characters +1000 power until end of turn." },
  { set: "OP-01", num: "025", name: "Roronoa Zoro", rarity: "SR", type: "Character", color: "Red", cost: 5, power: 6000, counter: 1000, price: 24.0, trending: true, effect: "[DON!! x1] This Character gains +2000 power." },
  { set: "OP-01", num: "120", name: "Shanks", rarity: "SEC", type: "Character", color: "Red", cost: 10, power: 10000, price: 96.0, featured: true, trending: true, effect: "[On Play] K.O. up to 1 of your opponent's Characters with a cost of 6 or less." },
  { set: "OP-01", num: "016", name: "Nami", rarity: "R", type: "Character", color: "Blue", cost: 2, power: 1000, counter: 1000, price: 6.5, effect: "[On Play] Look at 5 cards from the top of your deck; reveal 1 {Straw Hat Crew} card and add it to hand." },
  { set: "OP-01", num: "051", name: "Eustass Kid", rarity: "SP", type: "Leader", color: "Green", life: 5, power: 5000, price: 64.0, trending: true, effect: "Wanted-poster alternate art. [Activate: Main] Rest this Leader: give a Character +2000 power." },

  // ---- OP-02 Paramount War ----
  { set: "OP-02", num: "001", name: "Edward Newgate", rarity: "L", type: "Leader", color: "Red", life: 5, power: 6000, price: 14.0, effect: "[End of Your Turn] Give this Leader −1 life: draw 1 card." },
  { set: "OP-02", num: "018", name: "Portgas D. Ace", rarity: "SR", type: "Character", color: "Red", cost: 4, power: 6000, price: 21.0, effect: "[On Play] Deal 2 damage to your opponent's Leader's life area." },
  { set: "OP-02", num: "114", name: "Sabo", rarity: "SEC", type: "Character", color: "Red", cost: 4, power: 5000, counter: 1000, price: 58.0, trending: true, effect: "[On Play] K.O. up to 1 Character with a cost of 4 or less." },
  { set: "OP-02", num: "049", name: "Marco", rarity: "R", type: "Character", color: "Green", cost: 4, power: 5000, counter: 1000, price: 9.0, effect: "[On K.O.] You may rest this Character instead." },

  // ---- OP-03 Pillars of Strength ----
  { set: "OP-03", num: "076", name: "Charlotte Katakuri", rarity: "SR", type: "Character", color: "Yellow", cost: 7, power: 8000, price: 33.0, featured: true, trending: true, effect: "[On Play] Look at the top card of your opponent's life and place it at the top or bottom." },
  { set: "OP-03", num: "108", name: "Charlotte Linlin", rarity: "L", type: "Leader", color: "Yellow", life: 5, power: 5000, price: 12.5, effect: "[Activate: Main] Place a card from your life under your Leader to draw 2." },
  { set: "OP-03", num: "121", name: "Monkey D. Luffy", rarity: "SP", type: "Character", color: "Red", cost: 5, power: 6000, price: 78.0, trending: true, effect: "Wanted-poster SP. [Rush] [DON!! x2] +2000 power." },
  { set: "OP-03", num: "044", name: "Tony Tony Chopper", rarity: "R", type: "Character", color: "Green", cost: 1, power: 0, counter: 2000, price: 4.5, effect: "[Blocker]" },

  // ---- OP-04 Kingdoms of Intrigue ----
  { set: "OP-04", num: "083", name: "Sabo", rarity: "SEC", type: "Character", color: "Black", cost: 7, power: 7000, price: 88.0, featured: true, trending: true, effect: "[On Play] Set up to 1 of your opponent's cost-5-or-less Characters' cost to 0." },
  { set: "OP-04", num: "019", name: "Donquixote Doflamingo", rarity: "SR", type: "Leader", color: "Green", life: 4, power: 5000, price: 17.0, effect: "[Your Turn] If you have 6+ DON!! on the field, this Leader gains +1000 power." },
  { set: "OP-04", num: "056", name: "Trafalgar Law", rarity: "R", type: "Character", color: "Green", cost: 5, power: 6000, counter: 1000, price: 7.5, effect: "[On Play] Return up to 1 cost-3-or-less Character to its owner's hand." },

  // ---- OP-05 Awakening of the New Era ----
  { set: "OP-05", num: "119", name: "Monkey D. Luffy", rarity: "SEC", type: "Character", color: "Purple", cost: 8, power: 10000, price: 210.0, featured: true, trending: true, effect: "Gear 5 — [On Play] Up to 1 of your opponent's Characters gets −10000 power this turn." },
  { set: "OP-05", num: "051", name: "Sanji", rarity: "SP", type: "Character", color: "Blue", cost: 3, power: 5000, price: 56.0, trending: true, effect: "Wanted-poster SP. [Blocker] [On Play] Rest 1 of your opponent's Characters." },
  { set: "OP-05", num: "001", name: "Monkey D. Luffy", rarity: "L", type: "Leader", color: "Purple", life: 5, power: 5000, price: 13.0, effect: "[DON!! −4] [Once Per Turn] This Leader gains +2000 and cannot be K.O.'d this turn." },
  { set: "OP-05", num: "041", name: "Yamato", rarity: "SR", type: "Character", color: "Green", cost: 5, power: 6000, counter: 1000, price: 11.0, effect: "[On Play] Give up to 1 rested DON!! to your opponent and draw 1 card." },

  // ---- OP-06 Wings of the Captain ----
  { set: "OP-06", num: "022", name: "Roronoa Zoro", rarity: "SR", type: "Character", color: "Green", cost: 5, power: 7000, price: 19.0, trending: true, effect: "[DON!! x1] [When Attacking] +1000 power." },
  { set: "OP-06", num: "119", name: "Sanji", rarity: "SEC", type: "Character", color: "Blue", cost: 4, power: 5000, price: 64.0, featured: true, effect: "[Blocker] [On Play] Rest up to 1 of your opponent's cost-5-or-less Characters." },
  { set: "OP-06", num: "001", name: "Roronoa Zoro", rarity: "L", type: "Leader", color: "Green", life: 5, power: 5000, price: 15.0, effect: "[Activate: Main] [Once Per Turn] −1 DON!!: this Leader gains +1000 power." },

  // ---- OP-07 500 Years in the Future ----
  { set: "OP-07", num: "084", name: "Kuzan", rarity: "SR", type: "Character", color: "Black", cost: 5, power: 6000, counter: 1000, price: 16.0, trending: true, effect: "[On Play] Give up to 1 of your opponent's Characters cost −4 this turn." },
  { set: "OP-07", num: "119", name: "Monkey D. Luffy", rarity: "SEC", type: "Character", color: "Purple", cost: 9, power: 10000, price: 72.0, featured: true, effect: "[Rush] [On Play] Add up to 1 DON!! from your DON!! deck rested." },
  { set: "OP-07", num: "001", name: "Jewelry Bonney", rarity: "L", type: "Leader", color: "Green", life: 5, power: 5000, price: 11.5, effect: "[Activate: Main] [Once Per Turn] Set up to 1 of your Characters as active." },

  // ---- OP-08 Two Legends ----
  { set: "OP-08", num: "118", name: "Gol D. Roger", rarity: "SEC", type: "Character", color: "Black", cost: 9, power: 9000, price: 84.0, featured: true, trending: true, effect: "[On Play] Trash the top 2 of your deck; K.O. an opponent Character with cost ≤ trashed total." },
  { set: "OP-08", num: "099", name: "Rob Lucci", rarity: "SR", type: "Character", color: "Black", cost: 6, power: 7000, price: 14.0, effect: "[On Play] K.O. up to 1 cost-4-or-less Character." },
  { set: "OP-08", num: "001", name: "Monkey D. Luffy", rarity: "L", type: "Leader", color: "Black", life: 5, power: 5000, price: 12.0, effect: "[Activate: Main] Trash 1 card: give an opponent Character cost −2." },

  // ---- OP-09 Emperors in the New World ----
  { set: "OP-09", num: "093", name: "Marshall D. Teach", rarity: "SR", type: "Character", color: "Black", cost: 8, power: 9000, price: 39.0, featured: true, trending: true, effect: "[On Play] K.O. up to 1 cost-7-or-less Character; this card cannot attack this turn." },
  { set: "OP-09", num: "118", name: "Shanks", rarity: "SEC", type: "Character", color: "Red", cost: 10, power: 12000, price: 92.0, featured: true, effect: "[On Play] [DON!! x2] K.O. all of your opponent's Characters with 6000 power or less." },
  { set: "OP-09", num: "001", name: "Kaido", rarity: "L", type: "Leader", color: "Purple", life: 5, power: 6000, price: 14.5, effect: "[DON!! −5] Play a cost-9 Kaido from hand or trash rested." },

  // ---- OP-10 Royal Blood ----
  { set: "OP-10", num: "082", name: "Boa Hancock", rarity: "SR", type: "Character", color: "Purple", cost: 5, power: 6000, price: 22.0, trending: true, effect: "[On Play] Up to 1 of your opponent's cost-5-or-less Characters cannot attack." },
  { set: "OP-10", num: "119", name: "Sabo", rarity: "SEC", type: "Character", color: "Red", cost: 5, power: 6000, price: 61.0, featured: true, effect: "[On Play] Deal 1 damage and K.O. a cost-3-or-less Character." },

  // ---- OP-11 A Fist of Divine Speed ----
  { set: "OP-11", num: "004", name: "Kuzan", rarity: "SR", type: "Character", color: "Blue", cost: 4, power: 5000, counter: 1000, price: 18.0, trending: true, effect: "[On Play] Return a cost-4-or-less Character to the bottom of the owner's deck." },
  { set: "OP-11", num: "001", name: "Sakazuki", rarity: "L", type: "Leader", color: "Blue", life: 4, power: 5000, price: 12.0, effect: "[Activate: Main] Return up to 2 cost-totalling-5 Characters to hand." },

  // ---- OP-12 Legacy of the Master ----
  { set: "OP-12", num: "030", name: "Silvers Rayleigh", rarity: "SR", type: "Character", color: "Blue", cost: 6, power: 7000, price: 26.0, featured: true, trending: true, effect: "[On Play] Rest up to 1 of your opponent's cost-7-or-less Characters." },
  { set: "OP-12", num: "118", name: "Jewelry Bonney", rarity: "SEC", type: "Character", color: "Green", cost: 4, power: 5000, price: 54.0, featured: true, effect: "[On Play] Set up to 2 of your Characters' base power to 6000 this turn." },

  // ---- OP-13 Carrying on His Will ----
  { set: "OP-13", num: "118", name: "Monkey D. Luffy", rarity: "SP", type: "Character", color: "Red", cost: 5, power: 6000, price: 70.0, featured: true, trending: true, effect: "Three-Brothers SP. [Rush] [When Attacking] +2000 power." },
  { set: "OP-13", num: "119", name: "Portgas D. Ace", rarity: "SP", type: "Character", color: "Red", cost: 6, power: 7000, price: 58.0, trending: true, effect: "Three-Brothers SP. [On Play] Deal 2 damage to the Leader." },
  { set: "OP-13", num: "001", name: "Gol D. Roger", rarity: "L", type: "Leader", color: "Red", life: 5, power: 5000, price: 16.0, effect: "[Activate: Main] [Once Per Turn] −2 DON!!: draw 1, then trash 1." },

  // ---- OP-14 The Azure Sea's Seven ----
  { set: "OP-14", num: "093", name: "Dracule Mihawk", rarity: "SEC", type: "Character", color: "Black", cost: 7, power: 8000, price: 95.0, featured: true, trending: true, effect: "Manga Rare. [On Play] K.O. up to 1 of your opponent's Characters with cost 7 or less." },
  { set: "OP-14", num: "001", name: "Dracule Mihawk", rarity: "L", type: "Leader", color: "Black", life: 5, power: 6000, price: 18.0, effect: "[When Attacking] If you have 2 or fewer cards in hand, +2000 power." },
  { set: "OP-14", num: "041", name: "Crocodile", rarity: "SR", type: "Character", color: "Purple", cost: 6, power: 7000, price: 15.0, effect: "[On Play] If your opponent has 7+ cards in hand, K.O. a cost-6-or-less Character." },

  // ---- PRB-01 THE BEST ----
  { set: "PRB-01", num: "001", name: "Sanji", rarity: "L", type: "Leader", color: "Blue", life: 5, power: 5000, price: 28.0, featured: true, trending: true, effect: "Exclusive Leader. [Activate: Main] [Once Per Turn] Give a cost-8-or-less Character without an [On Play] effect [Rush]." },
  { set: "PRB-01", num: "041", name: "Monkey D. Luffy", rarity: "SR", type: "Character", color: "Red", cost: 5, power: 6000, price: 34.0, trending: true, effect: "Comic Parallel reprint. [Rush] [DON!! x1] +1000 power." },
  { set: "PRB-01", num: "016", name: "Nami", rarity: "SR", type: "Character", color: "Blue", cost: 2, power: 2000, counter: 1000, price: 48.0, featured: true, effect: "Comic Parallel reprint with manga-panel art." },
  { set: "PRB-01", num: "D01", name: "Gold DON!! — Roronoa Zoro", rarity: "Promo", type: "DON", color: "Green", price: 42.0, trending: true, effect: "Gold-foil character DON!! card. Cosmetic chase collectible." },

  // ---- PRB-02 THE BEST Vol. 2 ----
  { set: "PRB-02", num: "057", name: "Trafalgar Law", rarity: "SR", type: "Character", color: "Green", cost: 5, power: 6000, price: 30.0, featured: true, effect: "Comic Parallel reprint." },
  { set: "PRB-02", num: "D04", name: "Gold DON!! — Yamato", rarity: "Promo", type: "DON", color: "Yellow", price: 38.0, trending: true, effect: "Gold-foil character DON!! card. Cosmetic chase collectible." },

  // ---- SPC-01 metal promos ----
  { set: "SPC-01", num: "M01", name: "Nami", rarity: "Metal", type: "Character", color: "Blue", price: 240.0, featured: true, trending: true, effect: "Exclusive METAL promo card. Etched-metal collectible, limited to the Super Premium Collection." },
  { set: "SPC-01", num: "M02", name: "Nami", rarity: "Metal", type: "Character", color: "Yellow", price: 215.0, featured: true, trending: true, effect: "Exclusive METAL promo card (alternate pose). Etched-metal collectible." },
  { set: "SPC-01", num: "P01", name: "Nami", rarity: "Promo", type: "Character", color: "Blue", price: 34.0, effect: "Exclusive Super Premium Collection promo card." },

  // ---- SPC-02 metal promos ----
  { set: "SPC-02", num: "M01", name: "Roronoa Zoro", rarity: "Metal", type: "Character", color: "Green", price: 205.0, featured: true, trending: true, effect: "Exclusive METAL promo card from Super Premium Collection Vol. 2." },
  { set: "SPC-02", num: "M02", name: "Sanji", rarity: "Metal", type: "Character", color: "Blue", price: 190.0, featured: true, trending: true, effect: "Exclusive METAL promo card from Super Premium Collection Vol. 2." },
];

// ---------- sealed economics (price per release) ----------
const boxPrice: Record<string, number> = {
  "OP-01": 489, "OP-02": 372, "OP-03": 268, "OP-04": 232, "OP-05": 318,
  "OP-06": 196, "OP-07": 168, "OP-08": 152, "OP-09": 184, "OP-10": 142,
  "OP-11": 128, "OP-12": 132, "OP-13": 124, "OP-14": 118,
};

function setNoDash(code: string) {
  return code.replace("-", "");
}

function profileFor(rarity: Rarity | undefined): MarketProfile {
  if (!rarity) return "staple";
  if (rarity === "SEC" || rarity === "SP" || rarity === "Metal") return "chase";
  if (rarity === "L" || rarity === "Promo") return "staple";
  return "staple";
}

function buildSingle(seed: SingleSeed): Product {
  const char = findCharacter(seed.name);
  const id = `${setNoDash(seed.set)}-${seed.num}`;
  const slug = slugify(`${seed.name}-${setNoDash(seed.set)}-${seed.num}`);
  const market = buildMarket(id, seed.price, profileFor(seed.rarity));
  return {
    id,
    slug,
    kind: "single",
    name: seed.name,
    subtitle: seed.type === "Leader" ? "Leader Card" : undefined,
    releaseCode: seed.set,
    line: seed.set.startsWith("OP") ? "OP" : seed.set.startsWith("PRB") ? "PRB" : "SPC",
    cardNumber: `${setNoDash(seed.set)}-${seed.num}`,
    rarity: seed.rarity,
    color: seed.color,
    type: seed.type,
    cost: seed.cost,
    power: seed.power,
    counter: seed.counter,
    life: seed.life,
    attribute: seed.attribute ?? char?.attribute,
    effect: seed.effect,
    price: market.lastSale,
    inStock: Math.max(0, 24 - (seed.rarity === "SEC" || seed.rarity === "Metal" ? 18 : 4)),
    featured: seed.featured,
    trending: seed.trending,
    art: { gradient: colorGradients[seed.color], emblem: char?.initials ?? seed.name.slice(0, 2).toUpperCase() },
    market,
    description:
      seed.effect ??
      `${seed.name} from ${seed.set}. A sought-after ${seed.rarity} card for collectors and competitive players alike.`,
  };
}

// ---------- build sealed products ----------
function sealedFor(): Product[] {
  const out: Product[] = [];
  for (const r of releases) {
    if (r.line === "OP") {
      const bp = boxPrice[r.code] ?? 120;
      const boxId = `${setNoDash(r.code)}-BOX`;
      out.push({
        id: boxId,
        slug: slugify(`${r.code}-booster-box`),
        kind: "booster-box",
        name: `${r.name} Booster Box`,
        subtitle: `${r.code} · 24 packs`,
        releaseCode: r.code,
        line: "OP",
        price: buildMarket(boxId, bp, "sealed").lastSale,
        inStock: 9,
        featured: r.code === "OP-01" || r.code === "OP-05",
        trending: r.code === "OP-01" || r.code === "OP-09",
        contents: [
          "24 booster packs",
          "12 cards per pack",
          "1 Leader card guaranteed per box",
          `Cards from ${r.name} (${r.code})`,
        ],
        art: { gradient: ["#0a0f1d", r.accent], emblem: r.code },
        market: buildMarket(boxId, bp, "sealed"),
        description: `Factory-sealed ${r.name} booster box. 24 packs of pure plunder — chase the Leaders, SRs, and Secret Rares of ${r.code}.`,
      });
      out.push({
        id: `${setNoDash(r.code)}-PACK`,
        slug: slugify(`${r.code}-booster-pack`),
        kind: "booster-pack",
        name: `${r.name} Booster Pack`,
        subtitle: `${r.code} · 12 cards`,
        releaseCode: r.code,
        line: "OP",
        price: Math.round((bp / 24) * 1.15 * 100) / 100,
        inStock: 60,
        art: { gradient: ["#0a0f1d", r.accent], emblem: r.code },
        description: `A single sealed ${r.name} (${r.code}) booster pack. 12 cards, infinite possibilities.`,
      });
      // a starter deck for select sets
      if (["OP-01", "OP-05", "OP-09", "OP-13"].includes(r.code)) {
        out.push({
          id: `${setNoDash(r.code)}-ST`,
          slug: slugify(`${r.code}-starter-deck`),
          kind: "starter-deck",
          name: `${r.name} Starter Deck`,
          subtitle: `${r.code} · 51 cards`,
          releaseCode: r.code,
          line: "OP",
          price: 17.99,
          inStock: 30,
          contents: [
            "1 ready-to-play 51-card deck",
            "1 Leader card",
            "10 DON!! cards",
            "Paper play sheet",
          ],
          art: { gradient: ["#0a0f1d", r.accent], emblem: r.code },
          description: `A ready-to-play ${r.name} starter deck — the fastest way to set sail with ${r.code}.`,
        });
      }
    } else if (r.line === "PRB") {
      const pp = r.code === "PRB-01" ? 159 : 178;
      const boxId = `${setNoDash(r.code)}-BOX`;
      out.push({
        id: boxId,
        slug: slugify(`${r.code}-premium-box`),
        kind: "premium-box",
        name: `${r.name} Premium Box`,
        subtitle: `${r.code} · Premium Booster`,
        releaseCode: r.code,
        line: "PRB",
        price: buildMarket(boxId, pp, "sealed").lastSale,
        inStock: 7,
        featured: r.code === "PRB-01",
        trending: true,
        contents: [
          "Premium booster display",
          "Reimagined alternate-art reprints",
          "Gold DON!! chase cards",
          r.code === "PRB-01" ? "Chance at the legendary God Pack" : "Comic-parallel chases",
        ],
        art: { gradient: ["#3a2c08", "#d4af37"], emblem: r.code },
        market: buildMarket(boxId, pp, "sealed"),
        description: `${r.name} (${r.code}) premium booster box — the greatest hits with the premium treatment.`,
      });
      out.push({
        id: `${setNoDash(r.code)}-PACK`,
        slug: slugify(`${r.code}-premium-pack`),
        kind: "booster-pack",
        name: `${r.name} Premium Pack`,
        subtitle: `${r.code} · Premium`,
        releaseCode: r.code,
        line: "PRB",
        price: r.code === "PRB-01" ? 17.99 : 19.99,
        inStock: 48,
        art: { gradient: ["#3a2c08", "#d4af37"], emblem: r.code },
        description: `A single ${r.name} (${r.code}) premium booster pack.`,
      });
    } else if (r.line === "SPC") {
      const sp = r.code === "SPC-01" ? 219 : 229;
      const boxId = `${setNoDash(r.code)}-BOX`;
      out.push({
        id: boxId,
        slug: slugify(`${r.code}-super-premium-collection`),
        kind: "super-premium",
        name: r.name,
        subtitle: `${r.code} · Collector Box`,
        releaseCode: r.code,
        line: "SPC",
        price: buildMarket(boxId, sp, "super-premium").lastSale,
        inStock: 5,
        featured: true,
        trending: true,
        contents:
          r.code === "SPC-01"
            ? [
                "1 × Giant Card Case / display box",
                "24 × OP-17 booster packs",
                "2 × Nami promo cards (2 types)",
                "2 × METAL Nami promo cards (2 types)",
                "1 × pack of 70 official sleeves",
              ]
            : [
                "1 × sculpted collector card case",
                "24 × booster packs",
                "2 × exclusive promo cards",
                "2 × METAL promo cards (2 types)",
                "1 × pack of 70 official sleeves",
              ],
        art: { gradient: ["#3a2c08", "#f6d765"], emblem: r.code },
        market: buildMarket(boxId, sp, "super-premium"),
        description: `${r.name} (${r.code}) — a luxury sealed collector box and one of the strongest long-term holds on the market. Built to be displayed, treasured, and (eventually) cracked.`,
      });
    }
  }
  return out;
}

export const products: Product[] = [
  ...singleSeeds.map(buildSingle),
  ...sealedFor(),
];
