import { NextRequest, NextResponse } from "next/server";
import { SITE } from "../../site";

const clean = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

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
  const need = clean(body.need, 120);
  const message = clean(body.message, 1200);

  if (!name || !phone) {
    return NextResponse.json({ error: "Nom et téléphone requis." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  // Expéditeur : doit être un domaine vérifié dans Resend une fois le domaine en place.
  const from = process.env.CONTACT_FROM_EMAIL || "GDA Site <onboarding@resend.dev>";

  if (!key) {
    // Endpoint prêt : il suffit d'ajouter RESEND_API_KEY (+ éventuellement
    // CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL) dans les variables d'env Vercel.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Demande de rappel — ${name}`,
        text:
          `Nouvelle demande de rappel depuis le site.\n\n` +
          `Nom : ${name}\nTéléphone : ${phone}\nBesoin : ${need || "—"}\n` +
          `Message : ${message || "—"}\n`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
