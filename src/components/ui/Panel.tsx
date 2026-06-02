import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel p-5", className)} {...props}>
      {children}
    </div>
  );
}

/** A heading rendered as an ornate banner ribbon. */
export function BannerRibbon({
  children,
  className,
  eyebrow,
}: {
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/80">
          {eyebrow}
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/70" />
        <h2 className="font-display text-2xl font-bold text-gold-gradient sm:text-3xl">
          {children}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/70 to-transparent" />
      </div>
    </div>
  );
}
