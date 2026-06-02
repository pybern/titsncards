import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Sparkles,
  LineChart,
  Tag,
  ShieldCheck,
  Anchor,
  Library,
} from "lucide-react";
import {
  getFeatured,
  getTrending,
  getReleases,
  getProductsByRelease,
  getTrackerProducts,
  lineMeta,
  lineOrder,
} from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ReleaseCard } from "@/components/catalog/ReleaseCard";
import { MoverCard } from "@/components/market/MoverCard";
import { Button } from "@/components/ui/Button";
import { BannerRibbon } from "@/components/ui/Panel";
import { CardArt } from "@/components/catalog/CardArt";
import { formatUSD, formatPct, pctClass, cn } from "@/lib/utils";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "One Piece TCG Marketplace",
  description:
    "Buy sealed One Piece TCG boxes, chase singles, and track OP, PRB, and SPC market prices from one player-built marketplace.",
  path: "/",
});

const emblemSrc: Record<string, string> = {
  OP: "/img/emblem-op.webp",
  PRB: "/img/emblem-prb.webp",
  SPC: "/img/emblem-spc.webp",
};

export default function HomePage() {
  const featured = getFeatured(8);
  const trending = getTrending(10);
  const latest = getReleases().filter((r) => new Date(r.releaseDate) <= new Date("2026-06-01")).slice(0, 3);
  const trackedCount = getTrackerProducts().length;
  const releaseCount = getReleases().length;
  const spcBox = getProductsByRelease("SPC-01")[0];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <Image
          src="/img/hero.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/85 to-abyss/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-transparent" />

        <div className="relative mx-auto flex max-w-7xl flex-col px-4 py-24 sm:px-6 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-bright">
              <Anchor className="h-3.5 w-3.5" /> Built by players, for players
            </span>
            <h1 className="mt-5 font-display text-5xl font-black leading-[1.05] text-glow-gold sm:text-6xl lg:text-7xl">
              <span className="text-gold-gradient">Tits n&apos; Cards</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/90">
              The marketplace for One Piece TCG captains. Buy sealed boxes, snipe
              chase singles, and track the market like a pro — across the OP, PRB
              &amp; SPC lines.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/releases" variant="gold" size="lg">
                <Compass className="h-5 w-5" /> Explore releases
              </Button>
              <Button href="/market" variant="secondary" size="lg">
                <LineChart className="h-5 w-5" /> Open the market
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              <Stat value={`${releaseCount}`} label="Releases" />
              <Stat value={`${trackedCount}`} label="Markets tracked" />
              <Stat value="24/7" label="Live-style pricing" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRENDING TICKER ---------- */}
      <section className="border-y border-hairline bg-abyss-light/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Sparkles className="h-5 w-5 text-gold" /> Trending on the Grand Line
            </h2>
            <Link href="/market" className="text-sm font-semibold text-gold/90 hover:text-gold-bright">
              View market →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
            {trending.map((p) => (
              <div key={p.id} className="w-64 shrink-0">
                <MoverCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6">
        {/* ---------- LINE SPOTLIGHTS ---------- */}
        <section>
          <BannerRibbon eyebrow="Three lines, one obsession" className="mb-8">
            Choose Your Line
          </BannerRibbon>
          <div className="grid gap-5 md:grid-cols-3">
            {lineOrder.map((l) => (
              <Link
                key={l}
                href={`/releases?line=${l}`}
                className="panel glow-hover group relative overflow-hidden p-6"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10 blur-2xl transition group-hover:bg-gold/20" />
                <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full ring-1 ring-gold/30">
                  <Image src={emblemSrc[l]} alt={l} fill sizes="64px" className="object-cover" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink group-hover:text-gold-bright">
                  {lineMeta[l].label.split(" — ")[1] ?? lineMeta[l].label}
                </h3>
                <p className="mt-1 text-sm text-muted">{lineMeta[l].description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold/90 group-hover:text-gold-bright">
                  Browse {l} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- FEATURED PRODUCTS ---------- */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <BannerRibbon eyebrow="Hand-picked by the crew">
              Featured Treasure
            </BannerRibbon>
            <Link href="/releases" className="hidden shrink-0 text-sm font-semibold text-gold/90 hover:text-gold-bright sm:block">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* ---------- SPC SPOTLIGHT ---------- */}
        {spcBox && (
          <section className="relative overflow-hidden rounded-2xl border border-gold/40">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1405] via-abyss to-abyss" />
            <div className="bg-grid absolute inset-0 opacity-30" />
            <div className="relative grid items-center gap-8 p-8 md:grid-cols-[1fr_320px] md:p-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-bright">
                  <Sparkles className="h-3.5 w-3.5" /> Super Premium Collection
                </span>
                <h2 className="mt-4 font-display text-3xl font-black text-gold-gradient sm:text-4xl">
                  {spcBox.name}
                </h2>
                <p className="mt-3 max-w-xl text-ink/85">
                  The ultimate collector&apos;s holy grail — a luxury display box
                  with exclusive metal Nami promos, OP-17 packs, and premium
                  sleeves. The strongest long-term hold on the market.
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="font-display text-3xl font-black text-gold-gradient">
                    {formatUSD(spcBox.price)}
                  </span>
                  {spcBox.market && (
                    <span className={cn("text-sm font-bold", pctClass(spcBox.market.change30dPct))}>
                      {formatPct(spcBox.market.change30dPct)} / 30d
                    </span>
                  )}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={`/product/${spcBox.slug}`} variant="gold">
                    View collection
                  </Button>
                  <Button href="/releases?line=SPC" variant="secondary">
                    All SPC drops
                  </Button>
                </div>
              </div>
              <div className="mx-auto w-56 animate-[float_6s_ease-in-out_infinite] md:w-full">
                <div className="frame-gold rounded-xl p-2">
                  <CardArt product={spcBox} showLabel={false} className="aspect-[5/7] w-full" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------- LATEST RELEASES ---------- */}
        <section>
          <div className="mb-8 flex items-end justify-between">
            <BannerRibbon eyebrow="Fresh off the press">Latest Releases</BannerRibbon>
            <Link href="/releases" className="hidden shrink-0 text-sm font-semibold text-gold/90 hover:text-gold-bright sm:block">
              All releases →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((r) => (
              <ReleaseCard key={r.code} release={r} />
            ))}
          </div>
        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section>
          <BannerRibbon eyebrow="No kraken-wrangling required" className="mb-8">
            How It Works
          </BannerRibbon>
          <div className="grid gap-5 md:grid-cols-3">
            <Step
              n="01"
              icon={<Library className="h-6 w-6" />}
              title="Discover"
              body="Browse every OP, PRB & SPC release. Filter by rarity, color, and type to find exactly what your deck (or display) needs."
            />
            <Step
              n="02"
              icon={<Tag className="h-6 w-6" />}
              title="Buy or Bid"
              body="Grab it now at the lowest ask, or place a bid and let the market come to you. List your own cards to sell in seconds."
            />
            <Step
              n="03"
              icon={<LineChart className="h-6 w-6" />}
              title="Track"
              body="Follow real-time-style price history, 52-week highs, and sales volume so you always buy low and sell high."
            />
          </div>
        </section>

        {/* ---------- FINAL CTA ---------- */}
        <section className="panel frame-gold relative overflow-hidden p-10 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-crimson/10 via-transparent to-gold/10" />
          <div className="relative">
            <ShieldCheck className="mx-auto h-10 w-10 text-gold" />
            <h2 className="mt-4 font-display text-3xl font-black text-gold-gradient sm:text-4xl">
              Ready to set sail?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted">
              Join the crew of players buying, selling, and tracking the One
              Piece TCG the smart way.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button href="/releases" variant="gold" size="lg">
                Start collecting
              </Button>
              <Button href="/sell" variant="primary" size="lg">
                Sell your cards
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-black text-gold-gradient">{value}</p>
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="panel relative p-6">
      <span className="absolute right-4 top-3 font-display text-4xl font-black text-white/5">
        {n}
      </span>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{body}</p>
    </div>
  );
}
