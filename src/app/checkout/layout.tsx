import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Checkout",
  description: "Complete a simulated checkout for your One Piece TCG order.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
