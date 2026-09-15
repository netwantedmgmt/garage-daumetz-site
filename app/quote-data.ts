/* Moteur de devis instantané — correspondance mots-clés (pas d'appel API externe :
   rapide, gratuit, et les prix restent 100% maîtrisés par le garage).
   ⚠️ Tarifs indicatifs à ajuster avec le client — ce sont des ESTIMATIONS, pas
   des prix contractuels. Fourchettes pièces à valider/affiner avec le garage. */

import { tierMultiplierFor, type FuelType } from "./vehicle-data";

/* Grille tarifaire réelle communiquée par le garage (affiche atelier, 2026) :
   T1 Entretien courant (vidange, filtres, freins, pneus, ampoules, échappement,
   petites interventions) = 60€/h · T2 Diagnostic & mécanique technique
   (distribution, embrayage, suspension, diagnostic électronique, climatisation)
   = 70€/h · T3 Intervention lourde & expertise (gros démontage moteur, boîte
   de vitesses, soudure) = 90€/h. Tarifs TTC (confirmé par le garage). */
export type LaborTier = "T1" | "T2" | "T3";
export const LABOR_RATES: Record<LaborTier, number> = { T1: 60, T2: 70, T3: 90 };

/* Une ligne de pièce/produit détaillée — jamais affichée au client (écran de
   résultat volontairement bref), uniquement dans le devis envoyé au garage.
   optional=true : pièce pas toujours nécessaire (ex. disques si usure
   constatée) — exclue de la fourchette basse, incluse dans la fourchette
   haute (scénario le plus complet). Gamme moyenne-haute, marques reconnues,
   pour concurrencer les garages du secteur sans sacrifier la marge. */
export type PartLine = { label: string; qty: number; priceMin: number; priceMax: number; optional?: boolean };

export type QuoteCategory = {
  id: string;
  label: string;
  keywords: string[];
  laborTier: LaborTier;
  hoursMin: number;
  hoursMax: number;
  note?: string;
  parts: PartLine[];
};

function partsRange(parts: PartLine[], multiplier = 1): { min: number; max: number } {
  let min = 0, max = 0;
  for (const p of parts) {
    if (!p.optional) min += p.qty * p.priceMin * multiplier;
    max += p.qty * p.priceMax * multiplier;
  }
  return { min: Math.round(min), max: Math.round(max) };
}

const CATEGORIES: QuoteCategory[] = [
  {
    id: "vidange", label: "Vidange & entretien",
    keywords: ["vidange", "huile moteur", "huile", "filtre a huile", "niveau d'huile", "niveau huile", "entretien courant", "revision"],
    laborTier: "T1", hoursMin: 0.5, hoursMax: 0.8,
    parts: [
      { label: "Huile moteur 5W30/5W40 (Total Quartz / Motul / Elf, ~5L)", qty: 1, priceMin: 35, priceMax: 55 },
      { label: "Filtre à huile (Bosch / Mann Filter / Purflux)", qty: 1, priceMin: 10, priceMax: 18 },
      { label: "Joint de vidange", qty: 1, priceMin: 2, priceMax: 5 },
      { label: "Filtre à air (Bosch / Mann Filter / Purflux)", qty: 1, priceMin: 12, priceMax: 22, optional: true },
    ],
  },
  {
    id: "frein", label: "Freinage",
    keywords: ["frein", "plaquette", "plaquettes", "disque de frein", "disques de frein", "grince", "crisse", "couine", "pedale de frein", "liquide de frein"],
    laborTier: "T1", hoursMin: 1, hoursMax: 1.5,
    parts: [
      { label: "Jeu de plaquettes de frein (Brembo / TRW / Bosch)", qty: 1, priceMin: 35, priceMax: 60 },
      { label: "Liquide de frein DOT4", qty: 1, priceMin: 8, priceMax: 15 },
      { label: "Paire de disques de frein (Brembo / ATE)", qty: 1, priceMin: 70, priceMax: 110, optional: true },
    ],
  },
  {
    id: "distribution", label: "Distribution",
    keywords: ["distribution", "courroie de distribution", "chaine de distribution", "kit distribution", "pompe a eau"],
    laborTier: "T2", hoursMin: 3, hoursMax: 5,
    parts: [
      { label: "Kit distribution complet — courroie + galets + tendeur (Gates / Dayco / Contitech)", qty: 1, priceMin: 150, priceMax: 320 },
      { label: "Pompe à eau (SKF / Airtex)", qty: 1, priceMin: 45, priceMax: 100 },
      { label: "Liquide de refroidissement", qty: 1, priceMin: 15, priceMax: 25 },
      { label: "Galet tendeur / accessoires additionnels", qty: 1, priceMin: 30, priceMax: 60, optional: true },
    ],
  },
  {
    id: "embrayage", label: "Embrayage",
    keywords: ["embrayage", "patine", "a-coups", "embrayage qui patine"],
    laborTier: "T2", hoursMin: 3, hoursMax: 4,
    parts: [
      { label: "Kit embrayage complet — disque + mécanisme + butée (LuK / Valeo / Sachs)", qty: 1, priceMin: 180, priceMax: 320 },
      { label: "Liquide d'embrayage / consommables", qty: 1, priceMin: 10, priceMax: 20 },
      { label: "Volant moteur bi-masse (fréquent sur diesel)", qty: 1, priceMin: 180, priceMax: 380, optional: true },
    ],
  },
  {
    id: "diagnostic", label: "Diagnostic / recherche de panne",
    keywords: ["voyant", "voyant moteur", "temoin allume", "bruit bizarre", "bruit etrange", "je ne sais pas", "panne", "perte de puissance", "fume", "fumee"],
    laborTier: "T2", hoursMin: 0.9, hoursMax: 1.5,
    note: "Lecture défauts (valise diagnostic) + recherche de panne — pièces à définir après identification de la cause.",
    parts: [],
  },
  {
    id: "suspension", label: "Suspension & géométrie",
    keywords: ["suspension", "amortisseur", "amortisseurs", "parallelisme", "geometrie", "vibration au volant", "tire a droite", "tire a gauche", "bruit en virage"],
    laborTier: "T2", hoursMin: 1.5, hoursMax: 2.5,
    parts: [
      { label: "Amortisseur (Monroe / KYB / Sachs)", qty: 2, priceMin: 60, priceMax: 110 },
      { label: "Rotule / biellette de direction (TRW / Lemförder)", qty: 1, priceMin: 15, priceMax: 35, optional: true },
    ],
  },
  {
    id: "pneu", label: "Pneumatiques (montage / équilibrage)",
    keywords: ["pneu use", "crevaison", "permutation", "equilibrage", "pneu ete"],
    laborTier: "T1", hoursMin: 0.2, hoursMax: 0.3,
    note: "Hors prix du pneu (variable selon marque et dimension, à confirmer avec le client) — montage, équilibrage et valve neuve inclus.",
    parts: [],
  },
  {
    id: "pneu_hiver", label: "Pneus hiver (jeu de 4, posés)",
    keywords: ["pneu hiver", "pneus hiver", "neige", "verglas", "hiver"],
    laborTier: "T1", hoursMin: 1, hoursMax: 1.2,
    note: "Estimation pour un jeu de 4 pneus hiver posés et équilibrés (citadine à SUV) — dimension exacte à confirmer avec le client.",
    parts: [
      { label: "Pneu hiver milieu-haut de gamme (Michelin / Continental / Goodyear / Hankook)", qty: 4, priceMin: 65, priceMax: 160 },
      { label: "Valve neuve", qty: 4, priceMin: 3, priceMax: 5 },
    ],
  },
  {
    id: "clim", label: "Climatisation",
    keywords: ["climatisation", "clim", "ne refroidit plus", "gaz clim", "recharge clim"],
    laborTier: "T2", hoursMin: 0.8, hoursMax: 1.2,
    parts: [
      { label: "Recharge gaz réfrigérant (R134a ou R1234yf selon véhicule)", qty: 1, priceMin: 35, priceMax: 70 },
      { label: "Filtre d'habitacle (Mann Filter / Bosch)", qty: 1, priceMin: 10, priceMax: 20, optional: true },
    ],
  },
  {
    id: "batterie", label: "Batterie & démarrage",
    keywords: ["batterie", "demarreur", "alternateur", "ne demarre pas", "ne demarre plus", "clic clic", "voiture ne demarre pas"],
    laborTier: "T1", hoursMin: 0.4, hoursMax: 0.8,
    parts: [
      { label: "Batterie (Bosch / Varta / Banner, capacité selon véhicule)", qty: 1, priceMin: 90, priceMax: 180 },
      { label: "Alternateur ou démarreur échange standard (Valeo / Bosch)", qty: 1, priceMin: 150, priceMax: 280, optional: true },
    ],
  },
  {
    id: "echappement", label: "Échappement",
    keywords: ["echappement", "pot d'echappement", "pot d echappement", "bruit fort au pot", "fuite echappement"],
    laborTier: "T1", hoursMin: 1, hoursMax: 2,
    parts: [
      { label: "Silencieux ou tronçon de ligne (Bosal / Walker / Fonos)", qty: 1, priceMin: 80, priceMax: 160 },
      { label: "Collier(s) + joint(s)", qty: 1, priceMin: 8, priceMax: 15 },
      { label: "Ligne d'échappement complète (remplacement intégral)", qty: 1, priceMin: 150, priceMax: 280, optional: true },
    ],
  },
  {
    id: "ampoule", label: "Ampoules & éclairage",
    keywords: ["ampoule", "phare", "feu arriere", "clignotant", "ne s'allume plus", "ne s allume plus"],
    laborTier: "T1", hoursMin: 0.2, hoursMax: 0.4,
    parts: [
      { label: "Ampoule homologuée (Philips / Osram)", qty: 1, priceMin: 8, priceMax: 25 },
      { label: "Kit LED homologué (option upgrade)", qty: 1, priceMin: 30, priceMax: 50, optional: true },
    ],
  },
];

export function getCategoryById(id: string): QuoteCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function scoreCategory(input: string, cat: QuoteCategory): number {
  const norm = normalize(input);
  let score = 0;
  for (const kw of cat.keywords) if (norm.includes(normalize(kw))) score++;
  return score;
}

export type QuoteResult = {
  category: QuoteCategory;
  partsMin: number;
  partsMax: number;
  laborMin: number;
  laborMax: number;
  totalMin: number;
  totalMax: number;
  hoursMin: number;
  hoursMax: number;
  ageNote?: string;
  fuelNote?: string;
  /* true : cette prestation n'existe pas pour ce type de motorisation
     (ex. vidange/distribution sur un 100% électrique) — pas de prix à afficher. */
  notApplicable?: boolean;
};

/* Prestations propres aux moteurs thermiques — sans objet sur un 100% électrique. */
const COMBUSTION_ONLY = new Set(["vidange", "distribution", "embrayage", "echappement"]);
/* Pièces généralement plus chères en diesel (turbo, injection HP, FAP) — majoration
   indicative et transparente, pas une donnée constructeur précise. */
const DIESEL_UPCHARGE = new Set(["distribution", "embrayage", "echappement"]);

/* Calcul du chiffrage pour une catégorie déjà identifiée — partagé entre
   matchQuote (recherche client par mots-clés) et la route /api/send-quote
   (recalcul serveur pour ne jamais faire confiance à des chiffres envoyés
   par le client). Seule source de vérité pour les prix. */
export function priceCategory(category: QuoteCategory, year?: number, fuel?: FuelType, brand?: string): QuoteResult {
  if (fuel === "electrique" && COMBUSTION_ONLY.has(category.id)) {
    return {
      category, partsMin: 0, partsMax: 0, laborMin: 0, laborMax: 0,
      totalMin: 0, totalMax: 0, hoursMin: 0, hoursMax: 0, notApplicable: true,
    };
  }

  const { min: partsMin, max: partsMax } = partsRange(category.parts, tierMultiplierFor(brand));
  const { hoursMin, hoursMax } = category;
  const rate = LABOR_RATES[category.laborTier];
  const laborMin = Math.round(hoursMin * rate);
  const laborMax = Math.round(hoursMax * rate);
  let totalMin = partsMin + laborMin;
  let totalMax = partsMax + laborMax;
  let ageNote: string | undefined;
  let fuelNote: string | undefined;

  if (year && year > 1970 && year <= new Date().getFullYear()) {
    const age = new Date().getFullYear() - year;
    if (age >= 15) {
      totalMax = Math.round(totalMax * 1.3);
      ageNote = "Véhicule de plus de 15 ans : pièces d'usure additionnelles parfois nécessaires, confirmées au diagnostic.";
    } else if (age >= 8) {
      totalMax = Math.round(totalMax * 1.15);
      ageNote = "Véhicule de plus de 8 ans : un contrôle complémentaire peut être proposé au diagnostic.";
    }
  }

  if (fuel === "diesel" && DIESEL_UPCHARGE.has(category.id)) {
    totalMax = Math.round(totalMax * 1.1);
    fuelNote = "Diesel : pièces généralement plus coûteuses (turbo, injection HP) — fourchette haute majorée de 10 %.";
  }

  return { category, partsMin, partsMax, laborMin, laborMax, totalMin, totalMax, hoursMin, hoursMax, ageNote, fuelNote };
}

/* ---------- Bon de commande garage (prix de référence, pas de fourchette) ----------
   L'écran client garde des fourchettes (priceCategory/matchQuote, honnête sur
   l'incertitude). Le garage, lui, veut un chiffre exploitable pour commander :
   un prix de référence par pièce (milieu de fourchette), les pièces optionnelles
   séparées du total (pas noyées dans un multiplicateur flou), et les majorations
   âge/carburant en lignes à part avec un montant concret. */
export type PriceLine = { label: string; qty: number; unitPrice: number; subtotal: number };

export type GarageQuote = {
  category: QuoteCategory;
  requiredParts: PriceLine[];
  optionalParts: PriceLine[];
  laborHours: number;
  laborRate: number;
  laborTotal: number;
  surcharges: PriceLine[];
  partsTotal: number; // pièces requises + majorations (hors optionnelles)
  grandTotal: number; // partsTotal + main d'œuvre
  notApplicable?: boolean;
};

function refPrice(p: PartLine, multiplier = 1): number {
  return Math.round(((p.priceMin + p.priceMax) / 2) * multiplier);
}

export function garageQuote(category: QuoteCategory, year?: number, fuel?: FuelType, brand?: string): GarageQuote {
  if (fuel === "electrique" && COMBUSTION_ONLY.has(category.id)) {
    return {
      category, requiredParts: [], optionalParts: [], laborHours: 0, laborRate: 0,
      laborTotal: 0, surcharges: [], partsTotal: 0, grandTotal: 0, notApplicable: true,
    };
  }

  const multiplier = tierMultiplierFor(brand);
  const toLine = (p: PartLine): PriceLine => {
    const unitPrice = refPrice(p, multiplier);
    return { label: p.label, qty: p.qty, unitPrice, subtotal: unitPrice * p.qty };
  };
  const requiredParts = category.parts.filter((p) => !p.optional).map(toLine);
  const optionalParts = category.parts.filter((p) => p.optional).map(toLine);

  const laborHours = Math.round(((category.hoursMin + category.hoursMax) / 2) * 10) / 10;
  const laborRate = LABOR_RATES[category.laborTier];
  const laborTotal = Math.round(laborHours * laborRate);

  const requiredPartsSubtotal = requiredParts.reduce((s, l) => s + l.subtotal, 0);
  const surcharges: PriceLine[] = [];

  if (year && year > 1970 && year <= new Date().getFullYear()) {
    const age = new Date().getFullYear() - year;
    if (age >= 15) {
      const amount = Math.round(requiredPartsSubtotal * 0.15);
      if (amount > 0) surcharges.push({ label: "Majoration pièces d'usure probables (véhicule de +15 ans)", qty: 1, unitPrice: amount, subtotal: amount });
    } else if (age >= 8) {
      const amount = Math.round(requiredPartsSubtotal * 0.08);
      if (amount > 0) surcharges.push({ label: "Majoration contrôle complémentaire probable (véhicule de +8 ans)", qty: 1, unitPrice: amount, subtotal: amount });
    }
  }

  if (fuel === "diesel" && DIESEL_UPCHARGE.has(category.id)) {
    const amount = Math.round(requiredPartsSubtotal * 0.1);
    if (amount > 0) surcharges.push({ label: "Majoration pièces diesel (turbo / injection HP)", qty: 1, unitPrice: amount, subtotal: amount });
  }

  const surchargesTotal = surcharges.reduce((s, l) => s + l.subtotal, 0);
  const partsTotal = requiredPartsSubtotal + surchargesTotal;
  const grandTotal = partsTotal + laborTotal;

  return { category, requiredParts, optionalParts, laborHours, laborRate, laborTotal, surcharges, partsTotal, grandTotal };
}

export function matchQuote(problem: string, year?: number, fuel?: FuelType, brand?: string): QuoteResult | null {
  if (!problem || !problem.trim()) return null;
  let best: QuoteCategory | null = null;
  let bestScore = 0;
  for (const cat of CATEGORIES) {
    const s = scoreCategory(problem, cat);
    if (s > bestScore) { bestScore = s; best = cat; }
  }
  if (!best || bestScore === 0) return null;
  return priceCategory(best, year, fuel, brand);
}

export type FrequentSearch = { label: string; query: string; featured?: boolean };

export const FREQUENT_SEARCHES: FrequentSearch[] = [
  { label: "Pneus hiver", query: "pneus hiver", featured: true },
  { label: "Vidange", query: "vidange huile moteur" },
  { label: "Plaquettes de frein", query: "plaquettes de frein qui grincent" },
  { label: "Voyant moteur allumé", query: "voyant moteur allumé" },
  { label: "Batterie / démarrage", query: "voiture ne démarre pas batterie" },
  { label: "Climatisation", query: "climatisation ne refroidit plus" },
];
