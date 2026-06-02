import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Captain's Log",
  description: "View your simulated orders, listings, and watchlist.",
  path: "/orders",
  noIndex: true,
});

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
