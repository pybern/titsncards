import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tits n' Cards - One Piece TCG Marketplace";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 20% 20%, #d4af37 0, transparent 28%), linear-gradient(135deg, #080b12 0%, #101827 55%, #261008 100%)",
          color: "#f8ecd0",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(212, 175, 55, 0.65)",
            borderRadius: "36px",
            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            padding: "56px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#f6d765",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            One Piece TCG Marketplace
          </div>
          <div
            style={{
              color: "#fff6d7",
              fontSize: 104,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.94,
            }}
          >
            Tits n&apos; Cards
          </div>
          <div
            style={{
              color: "#d6c7a6",
              fontSize: 34,
              lineHeight: 1.25,
              maxWidth: 920,
            }}
          >
            Buy, sell, and track OP, PRB, and SPC cards with live-style market
            prices.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
