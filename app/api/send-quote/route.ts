import { NextRequest, NextResponse } from "next/server";
import { SITE } from "../../site";
import { getCategoryById } from "../../quote-data";
import { sendGarageSms } from "../../lib/sms";

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot anti-spam : champ "company" invisible, rempli = bot.
  if (clean(body.company, 100)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const vehicleLabel = clean(body.vehicleLabel, 200);
  const problem = clean(body.problem, 500);
  const categoryId = clean(body.categoryId, 60);

  if (!name || !phone || !problem || !categoryId) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  // La catégorie et son détail produits/pièces sont recalculés côté serveur
  // à partir de l'id — jamais de contenu libre client injecté dans l'email
  // envoyé au garage (sécurité + cohérence avec la grille tarifaire réelle).
  const category = getCategoryById(categoryId);
  if (!category) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }

  const partsMin = num(body.partsMin);
  const partsMax = num(body.partsMax);
  const laborMin = num(body.laborMin);
  const laborMax = num(body.laborMax);
  const totalMin = num(body.totalMin);
  const totalMax = num(body.totalMax);
  const hoursMin = num(body.hoursMin);
  const hoursMax = num(body.hoursMax);
  const ageNote = clean(body.ageNote, 300);
  const fuelNote = clean(body.fuelNote, 300);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  const from = process.env.CONTACT_FROM_EMAIL || "GDA Site <onboarding@resend.dev>";

  if (!key) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const lines = [
    `Nouveau devis envoyé depuis le site (estimation client, à confirmer au diagnostic).`,
    ``,
    `CLIENT`,
    `Nom : ${name}`,
    `Téléphone : ${phone}`,
    email ? `Email : ${email}` : null,
    ``,
    `VÉHICULE`,
    vehicleLabel || "Non renseigné",
    ``,
    `PROBLÈME DÉCRIT`,
    problem,
    ``,
    `PRESTATION IDENTIFIÉE : ${category.label}`,
    category.detailsGarage ? `Pièces/produits recommandés : ${category.detailsGarage}` : null,
    ``,
    `CHIFFRAGE (TTC, indicatif)`,
    partsMax > 0 ? `Pièces : ${partsMin}–${partsMax} €` : "Pièces : à définir au diagnostic",
    `Main d'œuvre (${hoursMin}–${hoursMax} h) : ${laborMin}–${laborMax} €`,
    `Total estimé : ${totalMin}–${totalMax} €`,
    ageNote ? `Note (âge véhicule) : ${ageNote}` : null,
    fuelNote ? `Note (carburant) : ${fuelNote}` : null,
  ].filter((l): l is string => l !== null);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Devis envoyé — ${category.label} — ${name}`,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    // Notification SMS instantanée en plus de l'email détaillé — best-effort,
    // ne bloque jamais la réponse (email = canal de référence).
    void sendGarageSms(
      `GDA — Nouveau devis envoyé : ${category.label}. ${name}, ${phone}. Total est. ${totalMin}-${totalMax}€ TTC. Détail par email.`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
