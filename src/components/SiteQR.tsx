"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/config";

export function SiteQR() {
  const [url, setUrl] = useState(`${SITE.url}/contact`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/contact`);
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 border border-cream/15 p-8 text-center">
      {/* Le QR reste noir sur blanc pour rester scannable */}
      <div className="bg-white p-3">
        <QRCodeSVG value={url} size={156} bgColor="#ffffff" fgColor="#0d0d0c" level="M" />
      </div>
      <div>
        <p className="font-semibold text-cream">Scannez pour partager</p>
        <p className="mx-auto mt-1 max-w-[220px] text-sm text-cream/60">
          Imprimez ce QR code sur vos cartes de visite : il ouvre directement ce
          formulaire.
        </p>
      </div>
    </div>
  );
}
