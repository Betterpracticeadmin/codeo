import { Resend } from "resend";
import { SITE } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 16px 8px 0;color:#737373;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
    <td style="padding:8px 0;color:#0a0a0a;">${esc(value).replace(/\n/g, "<br/>")}</td>
  </tr>`;
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "L'envoi d'email n'est pas encore configuré (RESEND_API_KEY manquant côté serveur).",
      },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  const get = (k: string) => ((form.get(k) as string | null) ?? "").trim();
  const nom = get("nom");
  const prenom = get("prenom");
  const entreprise = get("entreprise");
  const email = get("email");
  const telephone = get("telephone");
  const description = get("description");
  const budget = get("budget");
  const delai = get("delai");

  if (!email || !description) {
    return Response.json(
      { error: "L'adresse e-mail et la description du projet sont requises." },
      { status: 400 }
    );
  }

  // Pièces jointes.
  const attachments: { filename: string; content: Buffer }[] = [];
  for (const entry of form.getAll("files")) {
    if (entry instanceof File && entry.size > 0) {
      const buf = Buffer.from(await entry.arrayBuffer());
      attachments.push({ filename: entry.name || "fichier", content: buf });
    }
  }

  const fullName = [prenom, nom].filter(Boolean).join(" ") || "Prospect";
  const filesLine = attachments.length
    ? attachments.map((a) => a.filename).join(", ")
    : "Aucun";

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#0a0a0a;">
    <h1 style="font-size:22px;letter-spacing:-1px;margin:0 0 4px;">Nouvelle demande de projet</h1>
    <p style="color:#737373;margin:0 0 24px;">via le formulaire CODAIX</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      ${row("Nom", fullName)}
      ${row("Entreprise", entreprise)}
      ${row("Email", email)}
      ${row("Téléphone", telephone)}
      ${row("Budget", budget)}
      ${row("Délai", delai)}
      ${row("Fichiers joints", filesLine)}
    </table>
    <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e5e5e5;">
      <div style="color:#737373;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Description du projet</div>
      <div style="font-size:15px;line-height:1.6;">${esc(description).replace(/\n/g, "<br/>")}</div>
    </div>
  </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // "onboarding@resend.dev" fonctionne sans domaine vérifié pour envoyer
      // vers l'adresse du compte Resend. Pour envoyer depuis @codeo.fr,
      // vérifie ton domaine dans Resend et remplace l'expéditeur ci-dessous.
      from: "CODAIX <onboarding@resend.dev>",
      to: [SITE.email],
      replyTo: email,
      subject: `Nouveau projet — ${entreprise || fullName}`,
      html,
      attachments: attachments.length ? attachments : undefined,
    });

    if (error) {
      return Response.json(
        { error: error.message || "Échec de l'envoi de l'email." },
        { status: 502 }
      );
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Échec de l'envoi de l'email. Réessayez." },
      { status: 500 }
    );
  }
}
