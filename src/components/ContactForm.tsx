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

export function ContactForm() {
  const [data, setData] = useState({ ...EMPTY });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const totalSize = files.reduce((a, f) => a + f.size, 0);
  const sending = status === "sending";

  const set = (k: keyof typeof EMPTY, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }
  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (totalSize > MAX_TOTAL) {
      setError(
        "Fichiers trop volumineux (4 Mo maximum au total). Envoyez les gros fichiers par email après le premier contact."
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

      {/* Zone de téléversement */}
      <div>
        <label className={labelCls}>
          Fichiers (logo, images, PDF, cahier des charges)
        </label>
        <label
          htmlFor="files"
          className="mt-2 flex cursor-pointer flex-col items-center justify-center border border-dashed border-cream/30 px-6 py-10 text-center transition-colors hover:border-red hover:bg-greenlight/25"
        >
          <span className="text-lg font-medium text-cream">
            Glissez vos fichiers ou cliquez ici
          </span>
          <span className="mt-1 text-sm text-cream/50">
            JPG, PNG, SVG, PDF — plusieurs fichiers acceptés (4 Mo max au total)
          </span>
          <input
            id="files"
            type="file"
            multiple
            accept="image/*,application/pdf,.pdf,.svg,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

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
        disabled={sending}
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
