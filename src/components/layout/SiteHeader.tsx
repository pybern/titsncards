"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  Tag,
  Library,
} from "lucide-react";
import { Brand } from "./Brand";
import { CartButton } from "@/components/cart/CartButton";
import { getReleasesByLine, lineMeta, lineOrder } from "@/lib/catalog";
import { cn, formatDate } from "@/lib/utils";

const byLine = getReleasesByLine();

const navLinks = [
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/sell", label: "Sell", icon: Tag },
];

export function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/70 bg-abyss/85 backdrop-blur-xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Brand />

        {/* desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition",
                menuOpen ? "text-gold-bright" : "text-ink hover:text-gold-bright",
              )}
            >
              <Library className="h-4 w-4" />
              Releases
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition", menuOpen && "rotate-180")}
              />
            </button>
            {menuOpen && <MegaMenu onNavigate={() => setMenuOpen(false)} />}
          </div>

          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink transition hover:text-gold-bright"
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        {/* search */}
        <form onSubmit={onSearch} className="ml-auto hidden flex-1 md:block md:max-w-xs">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards, sets, rarities…"
              className="h-10 w-full rounded-lg border border-hairline bg-panel-light/70 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <Link
            href="/orders"
            className="hidden h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-panel-light text-ink transition hover:border-gold/60 hover:text-gold-bright sm:flex"
            aria-label="Watchlist & orders"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <CartButton />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline bg-panel-light text-ink lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <MobileNav onSearch={onSearch} query={query} setQuery={setQuery} onClose={() => setMobileOpen(false)} />
      )}
    </header>
  );
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="absolute left-0 top-full pt-2">
      <div className="panel frame-gold grid w-[760px] grid-cols-3 gap-4 p-5 shadow-2xl">
        {lineOrder.map((line) => (
          <div key={line}>
            <div className="mb-2 flex items-center justify-between border-b border-hairline pb-2">
              <span className="font-display text-sm font-bold text-gold-bright">
                {lineMeta[line].label}
              </span>
            </div>
            <p className="mb-3 text-xs text-muted">{lineMeta[line].tagline}</p>
            <ul className="space-y-1">
              {byLine[line].slice(0, 6).map((r) => (
                <li key={r.code}>
                  <Link
                    href={`/releases/${r.code}`}
                    onClick={onNavigate}
                    className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition hover:bg-white/5"
                  >
                    <span className="truncate text-ink group-hover:text-gold-bright">
                      {r.name}
                    </span>
                    <span className="ml-2 shrink-0 text-[10px] font-mono text-muted">
                      {r.code}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/releases"
                  onClick={onNavigate}
                  className="mt-1 block rounded-md px-2 py-1.5 text-xs font-semibold text-gold/80 transition hover:text-gold-bright"
                >
                  View all {line} releases →
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileNav({
  onSearch,
  query,
  setQuery,
  onClose,
}: {
  onSearch: (e: React.FormEvent) => void;
  query: string;
  setQuery: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="border-t border-hairline bg-abyss/95 px-4 py-4 lg:hidden">
      <form onSubmit={onSearch} className="mb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="h-11 w-full rounded-lg border border-hairline bg-panel-light pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-gold/60 focus:outline-none"
          />
        </div>
      </form>
      <div className="flex flex-col gap-1">
        <Link href="/releases" onClick={onClose} className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-white/5">
          Releases
        </Link>
        <Link href="/market" onClick={onClose} className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-white/5">
          Market
        </Link>
        <Link href="/sell" onClick={onClose} className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-white/5">
          Sell
        </Link>
        <Link href="/orders" onClick={onClose} className="rounded-lg px-3 py-2.5 font-semibold text-ink hover:bg-white/5">
          Orders & Watchlist
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {lineOrder.map((line) => (
          <div key={line} className="rounded-lg border border-hairline p-2">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gold/80">
              {line}
            </p>
            {byLine[line].slice(0, 3).map((r) => (
              <Link
                key={r.code}
                href={`/releases/${r.code}`}
                onClick={onClose}
                className="block truncate py-1 text-xs text-muted hover:text-ink"
                title={`${r.name} · ${formatDate(r.releaseDate)}`}
              >
                {r.code}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
