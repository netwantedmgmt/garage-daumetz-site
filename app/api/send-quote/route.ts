import { NextRequest, NextResponse } from "next/server";
import { SITE } from "../../site";
import { getCategoryById, garageQuote, type GarageQuote, type PriceLine } from "../../quote-data";
import type { FuelType } from "../../vehicle-data";
import { sendGarageSms } from "../../lib/sms";

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function lineRowsHtml(lines: PriceLine[], variant: "required" | "optional" | "surcharge"): string {
  return lines
    .map((l) => {
      const color = variant === "optional" ? "#e0a800" : "#111";
      return `
        <tr>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e5e5;color:${color};font-size:13.5px;">${esc(l.label)}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e5e5;color:#444;font-size:13.5px;text-align:center;">${l.qty}</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e5e5;color:#444;font-size:13.5px;text-align:right;">${l.unitPrice} €</td>
          <td style="padding:9px 12px;border-bottom:1px solid #e5e5e5;color:#111;font-size:13.5px;text-align:right;font-weight:600;">${l.subtotal} €</td>
        </tr>`;
    })
    .join("");
}

function buildEmailHtml(opts: {
  name: string; phone: string; email: string; vehicleLabel: string; problem: string; gq: GarageQuote;
  vin?: string; kType?: string; engineCode?: string;
}): string {
  const { name, phone, email, vehicleLabel, problem, gq, vin, kType, engineCode } = opts;
  const { category, requiredParts, optionalParts, surcharges, laborHours, laborRate, laborTotal, partsTotal, grandTotal } = gq;

  const techBlock = (vin || kType || engineCode)
    ? `
      <div style="background:#f0f7ff;border:1px solid #cfe3fb;border-radius:8px;padding:12px 14px;margin-bottom:20px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#2563a8;margin-bottom:6px;">Identifiants techniques — pour référence pièces exacte</div>
        <div style="font-size:13px;color:#111;line-height:1.7;">
          ${vin ? `VIN : <b>${esc(vin)}</b><br/>` : ""}
          ${kType ? `K-type (TecDoc) : <b>${esc(kType)}</b><br/>` : ""}
          ${engineCode ? `Code moteur : <b>${esc(engineCode)}</b>` : ""}
        </div>
        <div style="font-size:11.5px;color:#5b7ba3;margin-top:6px;">À coller dans votre logiciel fournisseur habituel pour obtenir les références exactes des pièces ci-dessous.</div>
      </div>`
    : "";

  const noPartsRow = requiredParts.length === 0
    ? `<tr><td colspan="4" style="padding:9px 12px;color:#666;font-size:13px;font-style:italic;">${esc(category.note || "Pas de pièce systématique — à définir au diagnostic.")}</td></tr>`
    : "";

  const optionalBlock = optionalParts.length
    ? `
      <div style="font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#e0a800;margin:18px 0 8px;">Pièces complémentaires possibles — si diagnostic le confirme</div>
      <table role="presentation" width="100%" style="border-collapse:collapse;border:1px solid #f0dca0;border-radius:8px;overflow:hidden;">
        <tbody>${lineRowsHtml(optionalParts, "optional")}</tbody>
      </table>
      <div style="font-size:11.5px;color:#999;margin-top:6px;">Non inclus dans le total ci-dessus — à ajouter uniquement si le diagnostic les confirme nécessaires.</div>`
    : "";

  return `
  <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;">
    <div style="background:#ef3340;padding:22px 28px;">
      <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em;">Nouveau devis envoyé</div>
      <div style="color:#ffe0e2;font-size:12.5px;margin-top:2px;">Prix de référence prêts à commander — à confirmer au diagnostic</div>
    </div>

    <div style="padding:24px 28px 8px;">
      <table role="presentation" width="100%" style="border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="width:50%;vertical-align:top;padding-right:12px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#999;margin-bottom:6px;">Client</div>
            <div style="font-size:14px;color:#111;font-weight:600;">${esc(name)}</div>
            <div style="font-size:13.5px;color:#444;">${esc(phone)}</div>
            ${email ? `<div style="font-size:13.5px;color:#444;">${esc(email)}</div>` : ""}
          </td>
          <td style="width:50%;vertical-align:top;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#999;margin-bottom:6px;">Véhicule</div>
            <div style="font-size:13.5px;color:#111;">${esc(vehicleLabel || "Non renseigné")}</div>
          </td>
        </tr>
      </table>

      ${techBlock}

      <div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#999;margin-bottom:6px;">Problème décrit</div>
      <div style="font-size:13.5px;color:#111;background:#f7f7f7;border-radius:8px;padding:10px 12px;margin-bottom:20px;">${esc(problem)}</div>

      <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:12px;">Prestation identifiée : <span style="color:#ef3340;">${esc(category.label)}</span></div>

      <table role="presentation" width="100%" style="border-collapse:collapse;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;margin-bottom:6px;">
        <thead>
          <tr style="background:#f7f7f7;">
            <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#666;">Produit</th>
            <th style="padding:9px 12px;text-align:center;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#666;">Qté</th>
            <th style="padding:9px 12px;text-align:right;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#666;">Prix unit.</th>
            <th style="padding:9px 12px;text-align:right;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#666;">Sous-total</th>
          </tr>
        </thead>
        <tbody>
          ${lineRowsHtml(requiredParts, "required") || noPartsRow}
          ${lineRowsHtml(surcharges, "surcharge")}
          <tr>
            <td style="padding:9px 12px;color:#111;font-size:13.5px;font-weight:600;">Main d'œuvre — ${esc(category.label)}</td>
            <td style="padding:9px 12px;color:#444;font-size:13.5px;text-align:center;">${laborHours} h</td>
            <td style="padding:9px 12px;color:#444;font-size:13.5px;text-align:right;">${laborRate} €/h</td>
            <td style="padding:9px 12px;color:#111;font-size:13.5px;text-align:right;font-weight:600;">${laborTotal} €</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style="background:#fff5f5;">
            <td colspan="3" style="padding:12px;font-size:14.5px;font-weight:700;color:#111;">Total estimé TTC</td>
            <td style="padding:12px;font-size:18px;font-weight:800;color:#ef3340;text-align:right;">${grandTotal} €</td>
          </tr>
        </tfoot>
      </table>
      <div style="font-size:11.5px;color:#999;margin-bottom:10px;">Pièces ${partsTotal} € + main d'œuvre ${laborTotal} € = ${grandTotal} € TTC. Prix de référence (milieu de fourchette qualité moyenne-haute), pas une fourchette à recalculer.</div>

      ${optionalBlock}

      <div style="font-size:11px;color:#999;margin-top:18px;padding-top:14px;border-top:1px solid #eee;">
        Estimation générée automatiquement à partir de la grille tarifaire du garage (main d'œuvre réelle) et de prix pièces qualité moyenne-haute (marques reconnues). À confirmer avec le client après diagnostic en atelier.
      </div>
    </div>
  </div>`;
}

function buildEmailText(opts: {
  name: string; phone: string; email: string; vehicleLabel: string; problem: string; gq: GarageQuote;
  vin?: string; kType?: string; engineCode?: string;
}): string {
  const { name, phone, email, vehicleLabel, problem, gq, vin, kType, engineCode } = opts;
  const { category, requiredParts, optionalParts, surcharges, laborHours, laborRate, laborTotal, partsTotal, grandTotal } = gq;
  const lineTxt = (l: PriceLine) => `- ${l.label} — x${l.qty} — ${l.unitPrice} € — sous-total ${l.subtotal} €`;
  return [
    `Nouveau devis envoyé depuis le site — prix de référence prêts à commander (à confirmer au diagnostic).`,
    ``, `CLIENT`, `Nom : ${name}`, `Téléphone : ${phone}`, email ? `Email : ${email}` : null,
    ``, `VÉHICULE`, vehicleLabel || "Non renseigné",
    (vin || kType || engineCode) ? `` : null,
    (vin || kType || engineCode) ? `IDENTIFIANTS TECHNIQUES (pour référence pièces exacte via votre logiciel fournisseur) :` : null,
    vin ? `VIN : ${vin}` : null,
    kType ? `K-type (TecDoc) : ${kType}` : null,
    engineCode ? `Code moteur : ${engineCode}` : null,
    ``, `PROBLÈME DÉCRIT`, problem,
    ``, `PRESTATION IDENTIFIÉE : ${category.label}`,
    ...(requiredParts.length ? requiredParts.map(lineTxt) : [category.note || "Pas de pièce systématique — à définir au diagnostic."]),
    ...surcharges.map(lineTxt),
    `- Main d'œuvre — x${laborHours} h — ${laborRate} €/h — sous-total ${laborTotal} €`,
    ``, `Pièces : ${partsTotal} € · Main d'œuvre : ${laborTotal} € · TOTAL TTC : ${grandTotal} €`,
    optionalParts.length ? `` : null,
    optionalParts.length ? `PIÈCES COMPLÉMENTAIRES POSSIBLES (si diagnostic le confirme, non incluses ci-dessus) :` : null,
    ...optionalParts.map(lineTxt),
  ].filter((l): l is string => l !== null).join("\n");
}

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
  const yearRaw = body.year;
  const year = typeof yearRaw === "number" && Number.isFinite(yearRaw) ? yearRaw : undefined;
  const fuelRaw = clean(body.fuel, 20);
  const fuel: FuelType | undefined = ["essence", "diesel", "hybride", "electrique"].includes(fuelRaw)
    ? (fuelRaw as FuelType)
    : undefined;
  const vin = clean(body.vin, 20) || undefined;
  const kType = clean(body.kType, 20) || undefined;
  const engineCode = clean(body.engineCode, 30) || undefined;

  if (!name || !phone || !problem || !categoryId) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  // Le chiffrage est TOUJOURS recalculé côté serveur à partir de l'id de
  // catégorie + année/carburant — jamais de prix envoyé par le client, pour
  // que le garage reçoive un devis fiable et non falsifiable.
  const category = getCategoryById(categoryId);
  if (!category) {
    return NextResponse.json({ error: "invalid_category" }, { status: 400 });
  }
  const gq = garageQuote(category, year, fuel);
  if (gq.notApplicable) {
    return NextResponse.json({ error: "not_applicable" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  const from = process.env.CONTACT_FROM_EMAIL || "GDA Site <onboarding@resend.dev>";

  if (!key) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const emailOpts = { name, phone, email, vehicleLabel, problem, gq, vin, kType, engineCode };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Devis envoyé — ${category.label} — ${name}`,
        html: buildEmailHtml(emailOpts),
        text: buildEmailText(emailOpts),
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }

    // Notification SMS instantanée en plus de l'email détaillé — best-effort,
    // ne bloque jamais la réponse (email = canal de référence).
    void sendGarageSms(
      `GDA — Nouveau devis envoyé : ${category.label}. ${name}, ${phone}. Total réf. ${gq.grandTotal}€ TTC. Détail par email.`
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
