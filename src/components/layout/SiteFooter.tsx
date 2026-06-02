import Link from "next/link";
import { Brand } from "./Brand";
import { lineMeta, lineOrder } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-hairline/70 bg-abyss-light/60">
      <div className="rule-gold" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm text-muted">
              The marketplace for One Piece TCG captains. Buy sealed, snipe
              singles, and track the market like a pro. Built by players, for
              players.
            </p>
          </div>

          <FooterCol title="Shop">
            {lineOrder.map((l) => (
              <FooterLink key={l} href={`/releases?line=${l}`}>
                {lineMeta[l].label.split(" — ")[0]} Releases
              </FooterLink>
            ))}
            <FooterLink href="/releases">All Releases</FooterLink>
          </FooterCol>

          <FooterCol title="Trade">
            <FooterLink href="/market">Price Tracker</FooterLink>
            <FooterLink href="/sell">Sell Your Cards</FooterLink>
            <FooterLink href="/orders">Orders & Watchlist</FooterLink>
            <FooterLink href="/cart">Cart</FooterLink>
          </FooterCol>

          <FooterCol title="Crew">
            <FooterLink href="/">About</FooterLink>
            <FooterLink href="/">Authenticity</FooterLink>
            <FooterLink href="/">Support</FooterLink>
          </FooterCol>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tits n&apos; Cards. All hands on deck.</p>
          <p className="max-w-2xl sm:text-right">
            Demo project — not affiliated with, endorsed by, or sponsored by
            Bandai or Eiichiro Oda. All orders, payments, listings, and prices
            are simulated for demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-gold/90">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted transition hover:text-gold-bright"
      >
        {children}
      </Link>
    </li>
  );
}
