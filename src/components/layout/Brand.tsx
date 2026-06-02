import Link from "next/link";
import { cn } from "@/lib/utils";

/** Jolly-Roger-meets-card-suit brand glyph (inline SVG, no asset needed). */
export function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bg-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbe7a8" />
          <stop offset="55%" stopColor="#e8c454" />
          <stop offset="100%" stopColor="#b8891f" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#0b1120" stroke="url(#bg-gold)" strokeWidth="2" />
      {/* spade-skull motif */}
      <path
        d="M24 11c-5 0-8.6 3.6-8.6 8 0 3 1.8 5.4 4.2 7.4-.6.8-1.2 1.4-2.2 1.8 1.2.5 2.4.4 3.4 0 .2 1 .2 2 0 3h6.4c-.2-1-.2-2 0-3 1 .4 2.2.5 3.4 0-1-.4-1.6-1-2.2-1.8 2.4-2 4.2-4.4 4.2-7.4 0-4.4-3.6-8-8.6-8Z"
        fill="url(#bg-gold)"
      />
      <circle cx="20.6" cy="20.4" r="1.9" fill="#0b1120" />
      <circle cx="27.4" cy="20.4" r="1.9" fill="#0b1120" />
      {/* crossbones */}
      <path
        d="M13 33l22 4M35 33l-22 4"
        stroke="url(#bg-gold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Brand({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Tits n' Cards home"
    >
      <BrandGlyph className="transition-transform duration-300 group-hover:rotate-6" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-wide text-gold-gradient sm:text-xl">
            Tits n&apos; Cards
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-muted">
            Built by players
          </span>
        </span>
      )}
    </Link>
  );
}
