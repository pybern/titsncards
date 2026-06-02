import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastViewport } from "@/components/ui/Toast";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tits n' Cards — One Piece TCG Marketplace",
    template: "%s · Tits n' Cards",
  },
  description:
    "Buy, sell, and track One Piece Card Game singles and sealed product. Built by players, for players. OP, PRB & SPC releases, live-style price history, and a battle-ready marketplace.",
  keywords: [
    "One Piece Card Game",
    "OPTCG",
    "TCG marketplace",
    "buy cards",
    "sell cards",
    "price tracker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <ToastViewport />
        </StoreProvider>
      </body>
    </html>
  );
}
