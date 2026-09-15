import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_HOST = "api-de-plaque-d-immatriculation-france.p.rapidapi.com";

type FuelType = "essence" | "diesel" | "hybride" | "electrique";

function normalizeFuel(raw: string): FuelType {
  const v = raw.toUpperCase();
  if (v.includes("ELECTR")) return "electrique";
  if (v.includes("HYBRID")) return "hybride";
  if (v.includes("GAZOLE") || v.includes("DIESEL")) return "diesel";
  return "essence";
}

function titleCase(s: string) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function yearFromDate(d: string): number | null {
  // format attendu "DD-MM-YYYY"
  const m = /(\d{4})$/.exec(d.trim());
  return m ? parseInt(m[1], 10) : null;
}

// Beaucoup de champs de cette API tierce reviennent "INCONNU" selon le véhicule
// (constaté en test réel, pas dans la doc) — on essaie plusieurs champs par
// ordre de fiabilité plutôt que de se fier à un seul.
function known(v: unknown): string | undefined {
  const s = typeof v === "string" ? v.trim() : "";
  return s && s.toUpperCase() !== "INCONNU" ? s : undefined;
}

function firstKnown(...vals: unknown[]): string {
  for (const v of vals) {
    const k = known(v);
    if (k) return k;
  }
  return "";
}

export async function GET(req: NextRequest) {
  const plaqueRaw = req.nextUrl.searchParams.get("plaque") || "";
  const plaque = plaqueRaw.trim().toUpperCase().slice(0, 12);
  if (!plaque || plaque.length < 4) {
    return NextResponse.json({ error: "invalid_plate" }, { status: 400 });
  }

  const key = process.env.RAPIDAPI_PLATE_KEY;
  if (!key) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`https://${RAPIDAPI_HOST}/?plaque=${encodeURIComponent(plaque)}`, {
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  if (!upstream.ok) {
    // Constaté en test réel : l'API tierce renvoie souvent un 500 vide pour une
    // plaque simplement non trouvée (pas seulement pour une vraie panne). On ne
    // distingue que l'échec d'authentification (clé invalide) du reste, pour ne
    // jamais bloquer un client sur une plaque juste non reconnue.
    if (upstream.status === 401 || upstream.status === 403) {
      return NextResponse.json({ error: "unauthorized" }, { status: 502 });
    }
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let json: Record<string, unknown>;
  try {
    json = await upstream.json();
  } catch {
    return NextResponse.json({ error: "upstream_error" }, { status: 502 });
  }

  const data = json?.data as Record<string, unknown> | undefined;
  if (json?.error || !data || !data.AWN_marque) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const marqueRaw = String(data.AWN_marque || "");
  const modele = firstKnown(data.AWN_modele) || String(data.AWN_modele || "");
  const motorisation = firstKnown(data.AWN_label_moteur, data.AWN_finition, data.AWN_version);
  // AWN_energie est fiable ; AWN_energie_description a été observé contradictoire
  // sur des cas réels (ex: GAZOLE vs "ESSENCE") — on ne se fie qu'à AWN_energie.
  const carburant = normalizeFuel(String(data.AWN_energie || ""));
  const annee =
    yearFromDate(String(data.AWN_date_mise_en_circulation || "")) ??
    (data.AWN_annee_de_debut_modele ? parseInt(String(data.AWN_annee_de_debut_modele), 10) : null);

  const marque = titleCase(marqueRaw);
  const label = [marque, modele, motorisation, annee].filter(Boolean).join(" · ");

  // Identifiants techniques précis (VIN, k-type TecDoc, code moteur) — jamais
  // utilisés pour deviner une référence pièce nous-mêmes (trop risqué de se
  // tromper), mais transmis au garage pour qu'il les colle directement dans
  // son propre logiciel fournisseur et obtienne les vraies références en 10s.
  const vin = firstKnown(data.AWN_VIN);
  const kType = firstKnown(data.AWN_k_type);
  const engineCode = firstKnown(data.AWN_code_moteur);

  return NextResponse.json({
    ok: true,
    marque,
    modele,
    motorisation,
    carburant,
    annee,
    label,
    vin: vin || undefined,
    kType: kType || undefined,
    engineCode: engineCode || undefined,
  });
}
