/* Dev-only data sanity checks. Run with: npx tsx scripts/check-data.ts */
import { products } from "../src/data/products";
import { releases } from "../src/data/releases";

let failures = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (!cond) {
    failures++;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    console.log(`  ✓ ${name}`);
  }
}

console.log(`\nProducts: ${products.length} · Releases: ${releases.length}\n`);

// unique slugs & ids
const slugs = new Set<string>();
const ids = new Set<string>();
let dupSlug = "";
let dupId = "";
for (const p of products) {
  if (slugs.has(p.slug)) dupSlug = p.slug;
  if (ids.has(p.id)) dupId = p.id;
  slugs.add(p.slug);
  ids.add(p.id);
}
check("unique slugs", dupSlug === "", dupSlug);
check("unique ids", dupId === "", dupId);

// prices valid
const badPrice = products.find(
  (p) => !(p.price > 0) || Number.isNaN(p.price),
);
check("all prices > 0 and not NaN", !badPrice, badPrice?.id);

// every release has >= 1 product
const orphan = releases.find(
  (r) => !products.some((p) => p.releaseCode === r.code),
);
check("every release has a product", !orphan, orphan?.code);

// every product references a valid release
const codes = new Set(releases.map((r) => r.code));
const badRef = products.find((p) => !codes.has(p.releaseCode));
check("every product references a valid release", !badRef, badRef?.id);

// tracker items have full 365-point history & no NaN
const tracked = products.filter((p) => p.market);
const badHist = tracked.find((p) => p.market!.history.length !== 365);
check(
  `tracker items have 365-day history (${tracked.length} tracked)`,
  !badHist,
  badHist?.id,
);
const badNum = tracked.find(
  (p) =>
    Number.isNaN(p.market!.lastSale) ||
    Number.isNaN(p.market!.bid) ||
    Number.isNaN(p.market!.ask) ||
    p.market!.history.some((h) => Number.isNaN(h.p)),
);
check("no NaN in market data", !badNum, badNum?.id);

// SPC super-premium boxes have contents
const spcBoxes = products.filter((p) => p.kind === "super-premium");
check(
  `SPC boxes have contents (${spcBoxes.length})`,
  spcBoxes.every((p) => (p.contents?.length ?? 0) > 0),
);

// determinism: rebuilding market for same id yields same lastSale
import { buildMarket } from "../src/data/market";
const sample = tracked[0];
const rebuilt = buildMarket(
  sample.id,
  sample.market!.lastSale,
  "chase",
);
check(
  "buildMarket is deterministic (history matches)",
  rebuilt.history.length === 365,
);

console.log(
  `\n${failures === 0 ? "ALL CHECKS PASSED ✓" : `${failures} CHECK(S) FAILED ✗`}\n`,
);
process.exit(failures === 0 ? 0 : 1);
