import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  LineChart,
  Package,
  ShieldCheck,
} from "lucide-react";
import {
  getProduct,
  getAllProducts,
  getRelatedProducts,
  getRelease,
} from "@/lib/catalog";
import { CardArt } from "@/components/catalog/CardArt";
import { ProductActions } from "@/components/catalog/ProductActions";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Sparkline } from "@/components/market/Sparkline";
import { RarityBadge, ColorPill } from "@/components/ui/Badge";
import { BannerRibbon } from "@/components/ui/Panel";
import { formatUSD, formatPct, pctClass, cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { productJsonLd, productMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };
  return productMetadata(product);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const release = getRelease(product.releaseCode);
  const related = getRelatedProducts(product);
  const m = product.market;
  const isSingle = product.kind === "single";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JsonLd data={productJsonLd(product)} />
      {/* breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/releases" className="hover:text-gold-bright">
          Releases
        </Link>
        <span>/</span>
        <Link
          href={`/releases/${product.releaseCode}`}
          className="hover:text-gold-bright"
        >
          {release?.name ?? product.releaseCode}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* art */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="frame-gold mx-auto max-w-sm rounded-xl p-2.5">
            <CardArt
              product={product}
              showLabel={false}
              className="aspect-[5/7] w-full"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Stylized representation · demo artwork
          </p>
        </div>

        {/* details */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.rarity && <RarityBadge rarity={product.rarity} full />}
            {product.color && <ColorPill color={product.color} />}
            {product.type && (
              <span className="rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[11px] font-semibold text-muted">
                {product.type}
              </span>
            )}
            <Link
              href={`/releases/${product.releaseCode}`}
              className="rounded-md border border-hairline bg-black/30 px-2 py-0.5 text-[11px] font-mono text-gold/90 hover:text-gold-bright"
            >
              {product.cardNumber ?? product.releaseCode}
            </Link>
          </div>

          <h1 className="mt-3 font-display text-4xl font-black text-ink">
            {product.name}
          </h1>
          {product.subtitle && (
            <p className="mt-1 text-muted">{product.subtitle}</p>
          )}

          {/* price block */}
          <div className="panel mt-5 p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {m ? "Last sale" : "Price"}
                </p>
                <p className="font-display text-4xl font-black text-gold-gradient">
                  {formatUSD(product.price)}
                </p>
              </div>
              {m && (
                <div className="text-right">
                  <Sparkline data={m.history.slice(-90)} width={160} height={48} />
                  <p
                    className={cn(
                      "flex items-center justify-end gap-1 text-sm font-bold",
                      pctClass(m.change24hPct),
                    )}
                  >
                    {m.change24hPct >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatPct(m.change24hPct)} (24h)
                  </p>
                </div>
              )}
            </div>

            {m && (
              <div className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline pt-4">
                <MiniStat label="Bid" value={formatUSD(m.bid)} />
                <MiniStat label="Ask" value={formatUSD(m.ask)} />
                <MiniStat
                  label="7d"
                  value={formatPct(m.change7dPct)}
                  className={pctClass(m.change7dPct)}
                />
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm">
              {product.inStock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-up">
                  <ShieldCheck className="h-4 w-4" />
                  In stock · {product.inStock} available
                </span>
              ) : (
                <span className="text-down">Currently sold out</span>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="mt-5">
            <ProductActions product={product} />
          </div>

          {m && (
            <Link
              href={`/market/${product.slug}`}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-sea/40 bg-sea/10 py-2.5 text-sm font-semibold text-sea-bright transition hover:bg-sea/20"
            >
              <LineChart className="h-4 w-4" />
              View full price history & place bids
            </Link>
          )}

          {/* card stats / contents */}
          {isSingle ? (
            <div className="panel mt-6 p-5">
              <h3 className="mb-3 font-display text-sm font-bold text-gold-bright">
                Card Details
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-3">
                <Detail label="Type" value={product.type} />
                <Detail label="Color" value={product.color} />
                <Detail label="Rarity" value={product.rarity} />
                {product.cost !== undefined && (
                  <Detail label="Cost" value={String(product.cost)} />
                )}
                {product.power !== undefined && (
                  <Detail label="Power" value={product.power.toLocaleString()} />
                )}
                {product.life !== undefined && (
                  <Detail label="Life" value={String(product.life)} />
                )}
                {product.counter !== undefined && (
                  <Detail label="Counter" value={`+${product.counter}`} />
                )}
                {product.attribute && (
                  <Detail label="Attribute" value={product.attribute} />
                )}
              </div>
              {product.effect && (
                <div className="mt-4 border-t border-hairline pt-4">
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Effect
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">
                    {product.effect}
                  </p>
                </div>
              )}
            </div>
          ) : (
            product.contents && (
              <div className="panel mt-6 p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-gold-bright">
                  <Package className="h-4 w-4" /> What&apos;s Inside
                </h3>
                <ul className="space-y-2">
                  {product.contents.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-sm text-ink"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          <p className="mt-5 text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16">
          <BannerRibbon eyebrow="You might also plunder" className="mb-6">
            Related Treasure
          </BannerRibbon>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
      <p className={cn("font-display text-lg font-bold text-ink", className)}>
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
      <p className="font-semibold text-ink">{value}</p>
    </div>
  );
}
