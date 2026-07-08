"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

const EMPTY = {
  nom: "",
  prenom: "",
  entreprise: "",
  email: "",
  telephone: "",
  description: "",
  budget: "",
  delai: "",
};

// Limite : la requête serverless Vercel est plafonnée à ~4,5 Mo.
const MAX_TOTAL = 4 * 1024 * 1024;

const labelCls =
  "block text-xs uppercase tracking-[0.2em] text-cream/50 mb-1";
const inputCls =
  "w-full border-b border-cream/25 bg-transparent py-3 text-lg text-cream outline-none transition-colors focus:border-red placeholder:text-cream/40";

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

// Convertit les photos iPhone (.HEIC) en JPEG puis compresse/redimensionne les
// images volumineuses, côté navigateur, pour un envoi fiable depuis n'importe
// quel appareil. Les PDF / SVG / petits logos sont laissés tels quels.
async function optimizeImage(file: File): Promise<File> {
  const isHeic =
    /image\/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

  let working = file;

  // 1) HEIC / HEIF (iPhone) → JPEG
  if (isHeic) {
    try {
      const heic2any = (await import("heic2any")).default;
      const out = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.85,
      });
      const blob = (Array.isArray(out) ? out[0] : out) as Blob;
      working = new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
        type: "image/jpeg",
      });
    } catch {
      return file; // en cas d'échec, on garde l'original (au moins il apparaît)
    }
  }

  // 2) Compression / redimensionnement des photos (on épargne les petits logos)
  const t = working.type;
  const shouldCompress =
    t === "image/jpeg" ||
    ((t === "image/png" || t === "image/webp") && working.size > 1_200_000);
  if (!shouldCompress) return working;

  try {
    const bitmap = await createImageBitmap(working);
    const maxDim = 1920;
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return working;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((res) =>
      canvas.toBlob(res, "image/jpeg", 0.82)
    );
    if (blob && blob.size < working.size) {
      return new File([blob], working.name.replace(/\.[^.]+$/, "") + ".jpg", {
        type: "image/jpeg",
      });
    }
    return working;
  } catch {
    return working;
  }
}

export function ContactForm() {
  const [data, setData] = useState({ ...EMPTY });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const totalSize = files.reduce((a, f) => a + f.size, 0);
  const sending = status === "sending";

  const set = (k: keyof typeof EMPTY, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  async function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setError("");
    setProcessing(true);
    try {
      const processed = await Promise.all(Array.from(list).map(optimizeImage));
      setFiles((prev) => [...prev, ...processed]);
    } finally {
      setProcessing(false);
    }
  }
  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (totalSize > MAX_TOTAL) {
      setError(
        "Fichiers encore trop volumineux (4 Mo max au total). Retirez-en quelques-uns ou envoyez-les par email après le premier contact."
      );
      setStatus("error");
      return;
    }

    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    files.forEach((f) => fd.append("files", f));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/contact");
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus("success");
      } else {
        let msg = "Une erreur est survenue. Réessayez.";
        try {
          msg = JSON.parse(xhr.responseText).error || msg;
        } catch {
          /* réponse non JSON */
        }
        setError(msg);
        setStatus("error");
      }
    };
    xhr.onerror = () => {
      setError("Erreur réseau. Vos fichiers sont conservés, réessayez.");
      setStatus("error");
    };

    setStatus("sending");
    setProgress(0);
    xhr.send(fd);
  }

  // ---- Écran de confirmation ----
  if (status === "success") {
    return (
      <div className="border border-cream/20 p-10 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red text-2xl text-ink">
          ✓
        </div>
        <h2 className="text-2xl font-bold tracking-tightest text-cream">
          Demande envoyée !
        </h2>
        <p className="mx-auto mt-3 max-w-md text-cream/70">
          Merci, votre projet nous est bien parvenu avec vos fichiers. Nous vous
          répondons très rapidement.
        </p>
        <button
          onClick={() => {
            setData({ ...EMPTY });
            setFiles([]);
            setProgress(0);
            setStatus("idle");
          }}
          className="mt-8 inline-flex items-center rounded-full border border-cream px-6 py-3 text-sm font-medium text-cream transition hover:bg-cream hover:text-green"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  // ---- Formulaire ----
  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="prenom">
            Prénom
          </label>
          <input
            id="prenom"
            className={inputCls}
            value={data.prenom}
            onChange={(e) => set("prenom", e.target.value)}
            placeholder="Timéo"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="nom">
            Nom
          </label>
          <input
            id="nom"
            className={inputCls}
            value={data.nom}
            onChange={(e) => set("nom", e.target.value)}
            placeholder="Pascal"
          />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="entreprise">
          Nom de l'entreprise
        </label>
        <input
          id="entreprise"
          className={inputCls}
          value={data.entreprise}
          onChange={(e) => set("entreprise", e.target.value)}
          placeholder="Votre commerce"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="email">
            Adresse e-mail *
          </label>
          <input
            id="email"
            type="email"
            required
            className={inputCls}
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="telephone">
            Téléphone
          </label>
          <input
            id="telephone"
            type="tel"
            className={inputCls}
            value={data.telephone}
            onChange={(e) => set("telephone", e.target.value)}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label className={labelCls} htmlFor="description">
          Description détaillée du projet *
        </label>
        <textarea
          id="description"
          required
          rows={5}
          className={`${inputCls} resize-none`}
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Type de site, objectifs, pages souhaitées, inspirations…"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="budget">
            Budget (facultatif)
          </label>
          <input
            id="budget"
            className={inputCls}
            value={data.budget}
            onChange={(e) => set("budget", e.target.value)}
            placeholder="ex : 500 – 1 000 €"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="delai">
            Délai souhaité
          </label>
          <input
            id="delai"
            className={inputCls}
            value={data.delai}
            onChange={(e) => set("delai", e.target.value)}
            placeholder="ex : sous 3 semaines"
          />
        </div>
      </div>

      {/* Zone de téléversement (clic + glisser-déposer) */}
      <div>
        <label className={labelCls}>
          Fichiers (logo, photos, PDF, cahier des charges)
        </label>
        <label
          htmlFor="files"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors ${
            dragOver
              ? "border-red bg-greenlight/40"
              : "border-cream/30 hover:border-red hover:bg-greenlight/25"
          }`}
        >
          <span className="text-lg font-medium text-cream">
            Glissez vos photos ici ou cliquez
          </span>
          <span className="mt-1 text-sm text-cream/50">
            JPG, PNG, HEIC (iPhone), PDF — vos photos sont optimisées automatiquement
          </span>
          <input
            id="files"
            type="file"
            multiple
            accept="image/*,.heic,.heif,application/pdf,.pdf,.svg,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {processing && (
          <p className="mt-3 text-sm text-cream/60">Optimisation des photos…</p>
        )}

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between border-b border-cream/15 py-2 text-sm text-cream"
              >
                <span className="truncate pr-4">
                  {f.name}{" "}
                  <span className="text-cream/40">({humanSize(f.size)})</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="shrink-0 text-cream/50 transition hover:text-red"
                  aria-label={`Retirer ${f.name}`}
                >
                  Retirer
                </button>
              </li>
            ))}
            <li className="pt-1 text-right text-xs text-cream/50">
              Total : {humanSize(totalSize)} / 4 Mo
            </li>
          </ul>
        )}
      </div>

      {error && (
        <p className="border-l-2 border-red bg-greenlight/30 px-4 py-3 text-sm text-cream">
          {error}
        </p>
      )}

      {sending && (
        <div>
          <div className="h-1 w-full overflow-hidden bg-cream/20">
            <div
              className="h-full bg-red transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-cream/60">Envoi… {progress}%</p>
        </div>
      )}

      <button
        type="submit"
        disabled={sending || processing}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-red px-8 py-4 text-base font-semibold text-ink transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
      >
        {sending ? "Envoi en cours…" : "Envoyer ma demande"}
        {!sending && (
          <span className="transition-transform group-hover:translate-x-1">→</span>
        )}
      </button>
    </form>
  );
}
