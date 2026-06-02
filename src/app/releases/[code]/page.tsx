import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Layers, ArrowLeft } from "lucide-react";
import {
  getRelease,
  getProductsByRelease,
  getReleases,
  lineMeta,
} from "@/lib/catalog";
import { FilterableGrid } from "@/components/catalog/FilterableGrid";
import { formatDate } from "@/lib/utils";
import { releaseMetadata } from "@/lib/seo";

const emblemSrc: Record<string, string> = {
  OP: "/img/emblem-op.webp",
  PRB: "/img/emblem-prb.webp",
  SPC: "/img/emblem-spc.webp",
};

export function generateStaticParams() {
  return getReleases().map((r) => ({ code: r.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const release = getRelease(code);
  if (!release) return { title: "Release not found" };
  return releaseMetadata(release);
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const release = getRelease(code);
  if (!release) notFound();

  const products = getProductsByRelease(release.code);
  const upcoming = new Date(release.releaseDate) > new Date("2026-06-01");

  return (
    <div>
      {/* banner */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(70% 120% at 18% 0%, ${release.accent}, transparent 60%)`,
          }}
        />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <Link
            href="/releases"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-gold-bright"
          >
            <ArrowLeft className="h-4 w-4" /> All releases
          </Link>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/40">
              <Image
                src={emblemSrc[release.emblem]}
                alt={`${release.line} emblem`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-gold/90">
                  {release.code}
                </span>
                <span className="rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-muted">
                  {lineMeta[release.line].label.split(" — ")[0]}
                </span>
                <span className="rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-muted">
                  {release.arc}
                </span>
                {upcoming && (
                  <span className="rounded-md bg-sea/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sea-bright">
                    Upcoming
                  </span>
                )}
              </div>
              <h1 className="mt-1.5 font-display text-3xl font-black text-gold-gradient sm:text-5xl">
                {release.name}
              </h1>
              <p className="mt-3 max-w-3xl text-muted">{release.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-gold/80" />
                  {formatDate(release.releaseDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-gold/80" />
                  {release.cardCount} cards in set
                </span>
                <span className="inline-flex items-center gap-1.5">
                  {products.length} listings available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <FilterableGrid products={products} />
      </div>
    </div>
  );
}
