import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import { FilterableGrid } from "@/components/catalog/FilterableGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Tits n' Cards catalog.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? searchProducts(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
        Search the bounty
      </p>
      <h1 className="mt-1 font-display text-3xl font-black text-gold-gradient sm:text-4xl">
        {q ? `Results for “${q}”` : "Search"}
      </h1>
      {q && (
        <p className="mt-2 text-muted">
          {results.length} {results.length === 1 ? "match" : "matches"} found.
        </p>
      )}

      <div className="mt-8">
        {!q ? (
          <EmptyState
            icon={<SearchIcon className="h-7 w-7" />}
            title="What treasure are you hunting?"
            description="Search by character, set code (e.g. OP-05), rarity, color, or product type."
            action={
              <Button href="/releases" variant="secondary" size="sm">
                Browse releases
              </Button>
            }
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="h-7 w-7" />}
            title="No matches in these waters"
            description={`Nothing matched “${q}”. Try a character name, set code, or rarity.`}
            action={
              <Button href="/releases" variant="secondary" size="sm">
                Browse releases
              </Button>
            }
          />
        ) : (
          <FilterableGrid products={results} />
        )}
      </div>
    </div>
  );
}
