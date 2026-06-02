import type { Metadata } from "next";
import type { Product, Release } from "@/lib/types";
import { formatUSD } from "@/lib/utils";

export const siteDomains = {
  canonical: "https://www.titsncards.com",
  apex: "https://titsncards.com",
  vercel: "https://titsncards.vercel.app",
} as const;

export function getSiteUrl(): string {
  return siteDomains.canonical;
}

export const siteConfig = {
  name: "Tits n' Cards",
  title: "Tits n' Cards - One Piece TCG Marketplace",
  description:
    "Buy, sell, and track One Piece Card Game singles and sealed product across OP, PRB, and SPC releases with live-style pricing.",
  locale: "en_US",
  defaultImage: "/opengraph-image",
  domains: siteDomains,
  keywords: [
    "One Piece Card Game",
    "One Piece TCG",
    "OPTCG",
    "OPTCG marketplace",
    "One Piece cards",
    "One Piece card prices",
    "OPTCG price tracker",
    "buy One Piece cards",
    "sell One Piece cards",
    "sealed One Piece TCG",
  ],
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, getSiteUrl()).toString();
}

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.defaultImage,
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const resolvedTitle = title ?? siteConfig.title;
  const imageAlt = `${resolvedTitle} | ${siteConfig.name}`;

  return {
    ...(title ? { title } : {}),
    description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: resolvedTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
  };
}

export function productMetadata(product: Product): Metadata {
  const detail = [
    product.cardNumber ?? product.releaseCode,
    product.rarity,
    product.kind.replace(/-/g, " "),
    formatUSD(product.price),
  ]
    .filter(Boolean)
    .join(" - ");

  return createMetadata({
    title: `${product.name} ${product.releaseCode}`,
    description: `${product.description} ${detail ? `${detail}.` : ""}`,
    path: `/product/${product.slug}`,
  });
}

export function marketMetadata(product: Product): Metadata {
  const market = product.market;
  return createMetadata({
    title: `${product.name} Price History`,
    description: market
      ? `Track ${product.name} (${product.releaseCode}) price history, last sale ${formatUSD(
          market.lastSale,
        )}, bids, asks, and recent One Piece TCG market activity.`
      : `Track the market price, bids, and asks for ${product.name} (${product.releaseCode}).`,
    path: `/market/${product.slug}`,
  });
}

export function releaseMetadata(release: Release): Metadata {
  return createMetadata({
    title: `${release.name} (${release.code}) One Piece TCG`,
    description: `${release.description} Browse ${release.cardCount} cards and sealed products from ${release.code}.`,
    path: `/releases/${release.code}`,
  });
}

export function siteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/favicon.ico"),
      sameAs: [siteDomains.apex, siteDomains.vercel],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      description: siteConfig.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/search")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.cardNumber ?? product.id,
    category: product.kind.replace(/-/g, " "),
    brand: {
      "@type": "Brand",
      name: "One Piece Card Game",
    },
    image: absoluteUrl(siteConfig.defaultImage),
    url: absoluteUrl(`/product/${product.slug}`),
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      availability:
        product.inStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/product/${product.slug}`),
    },
  };
}
