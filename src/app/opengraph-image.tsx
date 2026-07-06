import { ImageResponse } from "next/og";
import { SITE } from "@/lib/config";

export const runtime = "edge";
export const alt = "CODAIX — Studio de création de sites web premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: "-2px", opacity: 0.7 }}>
          CODAIX
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: "-4px",
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          {SITE.baseline}
        </div>
        <div style={{ fontSize: 28, opacity: 0.6 }}>
          Sites vitrines · Restaurants · Artisans · Landing pages
        </div>
      </div>
    ),
    { ...size }
  );
}
