import type { Metadata } from "next";
import Image from "next/image";
import { getReleasesByLine, lineMeta, lineOrder } from "@/lib/catalog";
import { ReleaseCard } from "@/components/catalog/ReleaseCard";
import type { Line } from "@/lib/types";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Browse every One Piece Card Game release — OP booster sets, PRB premium boosters, and the SPC Super Premium Collection.",
};

const emblemSrc: Record<string, string> = {
  OP: "/img/emblem-op.webp",
  PRB: "/img/emblem-prb.webp",
  SPC: "/img/emblem-spc.webp",
};

export default async function ReleasesPage({
  searchParams,
}: {
  searchParams: Promise<{ line?: string }>;
}) {
  const { line } = await searchParams;
  const byLine = getReleasesByLine();
  const active = (line?.toUpperCase() as Line) || null;
  const linesToShow = active && lineOrder.includes(active) ? [active] : lineOrder;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* page header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
          The Archives
        </p>
        <h1 className="mt-1 font-display text-4xl font-black text-gold-gradient sm:text-5xl">
          Releases
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Every set, every era. Chart a course through the OP main line, the PRB
          premium boosters, and the legendary SPC Super Premium Collection.
        </p>
      </div>

      {/* line filter tabs */}
      <div className="mb-10 flex flex-wrap gap-2">
        <LineTab href="/releases" label="All" active={!active} />
        {lineOrder.map((l) => (
          <LineTab
            key={l}
            href={`/releases?line=${l}`}
            label={l}
            active={active === l}
          />
        ))}
      </div>

      <div className="space-y-14">
        {linesToShow.map((l) => (
          <section key={l} id={l}>
            <div className="mb-5 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-gold/30">
                <Image
                  src={emblemSrc[l]}
                  alt={`${l} emblem`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">
                  {lineMeta[l].label}
                </h2>
                <p className="text-sm text-muted">{lineMeta[l].description}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {byLine[l].map((r) => (
                <ReleaseCard key={r.code} release={r} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function LineTab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={
        active
          ? "rounded-lg border border-gold/60 bg-gold/15 px-4 py-2 text-sm font-bold text-gold-bright"
          : "rounded-lg border border-hairline bg-panel-light px-4 py-2 text-sm font-semibold text-muted transition hover:border-gold/40 hover:text-ink"
      }
    >
      {label}
    </a>
  );
}
