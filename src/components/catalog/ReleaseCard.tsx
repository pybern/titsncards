import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Layers } from "lucide-react";
import type { Release } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

const emblemSrc: Record<string, string> = {
  OP: "/img/emblem-op.webp",
  PRB: "/img/emblem-prb.webp",
  SPC: "/img/emblem-spc.webp",
};

export function ReleaseCard({
  release,
  className,
}: {
  release: Release;
  className?: string;
}) {
  const upcoming = new Date(release.releaseDate) > new Date("2026-06-01");

  return (
    <Link
      href={`/releases/${release.code}`}
      className={cn(
        "panel glow-hover group relative flex flex-col overflow-hidden p-5",
        className,
      )}
    >
      {/* accent glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50"
        style={{ background: release.accent }}
      />

      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30">
          <Image
            src={emblemSrc[release.emblem]}
            alt={`${release.line} emblem`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gold/90">
              {release.code}
            </span>
            {upcoming && (
              <span className="rounded bg-sea/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sea-bright">
                Upcoming
              </span>
            )}
          </div>
          <h3 className="mt-0.5 line-clamp-1 font-display text-lg font-bold text-ink transition group-hover:text-gold-bright">
            {release.name}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[10px] font-medium text-muted">
            {release.arc}
          </span>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted">{release.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(release.releaseDate)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          {release.cardCount} cards
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-gold/90 transition group-hover:text-gold-bright">
          Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
