import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Cart",
  description: "Review the One Piece TCG cards and sealed products in your cart.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
