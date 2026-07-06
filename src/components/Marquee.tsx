const ITEMS = [
  "Création de sites",
  "Design sur mesure",
  "Aix-en-Provence",
  "Rapidité",
  "Sites premium",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-8 text-[clamp(1.8rem,5vw,4.5rem)] font-extrabold tracking-tightest">
            {t}
          </span>
          <span className="text-[clamp(1.8rem,5vw,4.5rem)]">✳</span>
        </span>
      ))}
    </div>
  );
}

// Bandeau défilant infini (signature Locomotive) — bande rouge vif.
export function Marquee() {
  return (
    <div className="select-none overflow-hidden bg-red py-6 text-ink">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}
