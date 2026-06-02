import type { Release } from "@/lib/types";

// One Piece Card Game release lines. Data themed on real OPTCG sets.
// (Demo content — not affiliated with Bandai.)

export const releases: Release[] = [
  // ---------------- OP — Main Booster Sets ----------------
  {
    code: "OP-01",
    line: "OP",
    name: "Romance Dawn",
    releaseDate: "2022-12-02",
    arc: "East Blue",
    description:
      "Where every great pirate's tale begins. The inaugural booster set introduces the Straw Hat crew and the four-color foundations of the game.",
    cardCount: 156,
    accent: "#e0443f",
    emblem: "OP",
  },
  {
    code: "OP-02",
    line: "OP",
    name: "Paramount War",
    releaseDate: "2023-03-10",
    arc: "Marineford",
    description:
      "The war that shook the world. Whitebeard, Ace, and the Marines clash in a set built around aggressive, high-power strategies.",
    cardCount: 156,
    accent: "#3b87e0",
    emblem: "OP",
  },
  {
    code: "OP-03",
    line: "OP",
    name: "Pillars of Strength",
    releaseDate: "2023-06-30",
    arc: "Whole Cake Island",
    description:
      "The Big Mom Pirates take center stage and the first Special Rare (SP) wanted-poster alt-arts debut as legendary chase cards.",
    cardCount: 155,
    accent: "#ecc02e",
    emblem: "OP",
  },
  {
    code: "OP-04",
    line: "OP",
    name: "Kingdoms of Intrigue",
    releaseDate: "2023-09-22",
    arc: "Dressrosa",
    description:
      "Schemes, warlords, and underworld brokers. Doflamingo's web of intrigue powers control-oriented green and black decks.",
    cardCount: 158,
    accent: "#34b06a",
    emblem: "OP",
  },
  {
    code: "OP-05",
    line: "OP",
    name: "Awakening of the New Era",
    releaseDate: "2023-12-08",
    arc: "Wano Country",
    description:
      "A new dawn over Wano. Awakening mechanics and the most expensive Luffy SP variants ever printed define this landmark set.",
    cardCount: 157,
    accent: "#9a6cf0",
    emblem: "OP",
  },
  {
    code: "OP-06",
    line: "OP",
    name: "Wings of the Captain",
    releaseDate: "2024-03-15",
    arc: "Straw Hats",
    description:
      "Zoro and Sanji — the captain's left and right wings — anchor a set celebrating the bonds of the Straw Hat crew.",
    cardCount: 154,
    accent: "#34b06a",
    emblem: "OP",
  },
  {
    code: "OP-07",
    line: "OP",
    name: "500 Years in the Future",
    releaseDate: "2024-06-28",
    arc: "Egghead",
    description:
      "Vegapunk's island of science. Futuristic Seraphim and Pacifista bring a brand-new wave of mechanical menace.",
    cardCount: 154,
    accent: "#4fd0e0",
    emblem: "OP",
  },
  {
    code: "OP-08",
    line: "OP",
    name: "Two Legends",
    releaseDate: "2024-09-13",
    arc: "God Valley",
    description:
      "Rocks and Roger. Two legendary eras collide in a set packed with crossover heavyweights and explosive finishers.",
    cardCount: 154,
    accent: "#b21e2f",
    emblem: "OP",
  },
  {
    code: "OP-09",
    line: "OP",
    name: "Emperors in the New World",
    releaseDate: "2024-12-13",
    arc: "Yonko",
    description:
      "The Four Emperors reign. Shanks, Kaido, Big Mom, and Blackbeard headline a set built for top-table dominance.",
    cardCount: 162,
    accent: "#ecc02e",
    emblem: "OP",
  },
  {
    code: "OP-10",
    line: "OP",
    name: "Royal Blood",
    releaseDate: "2025-03-21",
    arc: "Dressrosa",
    description:
      "The blood of kings. Royal lineages and the Riku family return with regal new Leaders and devastating events.",
    cardCount: 152,
    accent: "#9a6cf0",
    emblem: "OP",
  },
  {
    code: "OP-11",
    line: "OP",
    name: "A Fist of Divine Speed",
    releaseDate: "2025-06-06",
    arc: "Marine HQ",
    description:
      "Light-speed justice. Admiral Kizaru and the Marines push tempo to its absolute limit in a blisteringly fast set.",
    cardCount: 159,
    accent: "#3b87e0",
    emblem: "OP",
  },
  {
    code: "OP-12",
    line: "OP",
    name: "Legacy of the Master",
    releaseDate: "2025-08-22",
    arc: "Masters & Students",
    description:
      "From Rayleigh to Zeff, masters pass the torch. Mentor-student pairings unlock fresh multi-color strategies.",
    cardCount: 158,
    accent: "#e0443f",
    emblem: "OP",
  },
  {
    code: "OP-13",
    line: "OP",
    name: "Carrying on His Will",
    releaseDate: "2025-11-07",
    arc: "Three Brothers",
    description:
      "Luffy, Ace, and Sabo — bound by sake and will. Brotherhood-themed Secret Rares headline an emotional set.",
    cardCount: 177,
    accent: "#b21e2f",
    emblem: "OP",
  },
  {
    code: "OP-14",
    line: "OP",
    name: "The Azure Sea's Seven",
    releaseDate: "2026-01-16",
    arc: "Seven Warlords",
    description:
      "The Shichibukai sail again. Mihawk leads a set spotlighting the Seven Warlords of the Sea in stunning Manga Rare art.",
    cardCount: 211,
    accent: "#2a8c9c",
    emblem: "OP",
  },

  // ---------------- PRB — Premium Boosters ----------------
  {
    code: "PRB-01",
    line: "PRB",
    name: "One Piece Card THE BEST",
    releaseDate: "2024-11-08",
    arc: "Premium Reprints",
    description:
      "The greatest hits, reimagined. Fan-favorite cards from OP-01 through OP-06 return with all-new art, gold DON!! cards, an exclusive Sanji Leader, and the legendary God Pack.",
    cardCount: 141,
    accent: "#f6d765",
    emblem: "PRB",
  },
  {
    code: "PRB-02",
    line: "PRB",
    name: "THE BEST Vol. 2",
    releaseDate: "2025-10-03",
    arc: "Premium Reprints",
    description:
      "The premium treatment continues. A second volume of reimagined classics, comic-parallel chases, and gold DON!! collectibles for the discerning collector.",
    cardCount: 376,
    accent: "#f6d765",
    emblem: "PRB",
  },

  // ---------------- SPC — Super Premium Collection ----------------
  {
    code: "SPC-01",
    line: "SPC",
    name: "Super Premium Collection Vol. 1",
    releaseDate: "2026-11-13",
    arc: "Collector Showcase",
    description:
      "The ultimate display piece. A luxury collector box featuring a full display of OP-17 booster packs, exclusive Nami promos, never-before-seen metal Nami cards, and premium sleeves — built to be held.",
    cardCount: 4,
    accent: "#d4af37",
    emblem: "SPC",
  },
  {
    code: "SPC-02",
    line: "SPC",
    name: "Super Premium Collection Vol. 2",
    releaseDate: "2027-04-09",
    arc: "Collector Showcase",
    description:
      "The next chapter of luxury. A second Super Premium Collection bringing fresh metal promos, a sculpted card case, and collector-grade exclusives for the most dedicated captains.",
    cardCount: 4,
    accent: "#d4af37",
    emblem: "SPC",
  },
];

export const lineMeta: Record<
  string,
  { label: string; tagline: string; description: string }
> = {
  OP: {
    label: "OP — Booster Sets",
    tagline: "The main line",
    description:
      "The core booster sets that define the meta — from Romance Dawn to the latest arcs.",
  },
  PRB: {
    label: "PRB — Premium Boosters",
    tagline: "The greatest hits",
    description:
      "Premium reprint sets packed with reimagined art, gold DON!! cards, and chase parallels.",
  },
  SPC: {
    label: "SPC — Super Premium Collection",
    tagline: "Collector showcase",
    description:
      "Luxury sealed collector boxes with exclusive metal promos — the ultimate long-term hold.",
  },
};

export const lineOrder: Array<"OP" | "PRB" | "SPC"> = ["OP", "PRB", "SPC"];
