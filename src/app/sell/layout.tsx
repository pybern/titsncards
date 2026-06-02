import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sell One Piece TCG Cards",
  description:
    "List One Piece TCG singles and sealed products with market-informed ask prices, condition controls, and payout previews.",
  path: "/sell",
});

export default function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
