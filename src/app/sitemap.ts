import type { MetadataRoute } from "next";
import {
  getAllProducts,
  getRelease,
  getReleases,
  getTrackerProducts,
} from "@/lib/catalog";
import { absoluteUrl } from "@/lib/seo";

const today = new Date("2026-06-02");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: today,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/releases"),
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/market"),
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/sell"),
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const releaseRoutes: MetadataRoute.Sitemap = getReleases().map((release) => ({
    url: absoluteUrl(`/releases/${release.code}`),
    lastModified: new Date(release.releaseDate),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((product) => {
    const release = getRelease(product.releaseCode);

    return {
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: release ? new Date(release.releaseDate) : today,
      changeFrequency: product.market ? "weekly" : "monthly",
      priority: product.featured ? 0.75 : 0.55,
    };
  });

  const marketRoutes: MetadataRoute.Sitemap = getTrackerProducts().map(
    (product) => ({
      url: absoluteUrl(`/market/${product.slug}`),
      lastModified: today,
      changeFrequency: "daily",
      priority: product.trending ? 0.75 : 0.6,
    }),
  );

  return [...staticRoutes, ...releaseRoutes, ...productRoutes, ...marketRoutes];
}
