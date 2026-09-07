/* Moteur de devis instantané — correspondance mots-clés (pas d'appel API externe :
   rapide, gratuit, et les prix restent 100% maîtrisés par le garage).
   ⚠️ Tarifs indicatifs à ajuster avec le client — ce sont des ESTIMATIONS, pas
   des prix contractuels. Le taux horaire et les fourchettes pièces sont à
   valider/affiner avec le garage (marge voulue, pas de prix excessifs). */

import type { FuelType } from "./vehicle-data";

export const HOURLY_RATE = 59; // €/h — taux moyen main d'œuvre garage indépendant

export type QuoteCategory = {
  id: string;
  label: string;
  keywords: string[];
  partsMin: number;
  partsMax: number;
  hoursMin: number;
  hoursMax: number;
  note?: string;
};

const CATEGORIES: QuoteCategory[] = [
  {
    id: "vidange", label: "Vidange & entretien",
    keywords: ["vidange", "huile moteur", "huile", "filtre a huile", "niveau d'huile", "niveau huile", "entretien courant", "revision"],
    partsMin: 55, partsMax: 90, hoursMin: 0.5, hoursMax: 0.8,
  },
  {
    id: "frein", label: "Freinage",
    keywords: ["frein", "plaquette", "plaquettes", "disque de frein", "disques de frein", "grince", "crisse", "couine", "pedale de frein", "liquide de frein"],
    partsMin: 60, partsMax: 130, hoursMin: 1, hoursMax: 1.5,
  },
  {
    id: "distribution", label: "Distribution",
    keywords: ["distribution", "courroie de distribution", "chaine de distribution", "kit distribution", "pompe a eau"],
    partsMin: 270, partsMax: 550, hoursMin: 3, hoursMax: 5,
  },
  {
    id: "embrayage", label: "Embrayage",
    keywords: ["embrayage", "patine", "a-coups", "embrayage qui patine"],
    partsMin: 370, partsMax: 710, hoursMin: 3, hoursMax: 4,
  },
  {
    id: "diagnostic", label: "Diagnostic / recherche de panne",
    keywords: ["voyant", "voyant moteur", "temoin allume", "bruit bizarre", "bruit etrange", "je ne sais pas", "panne", "perte de puissance", "fume", "fumee"],
    partsMin: 0, partsMax: 0, hoursMin: 0.9, hoursMax: 1.5,
  },
  {
    id: "suspension", label: "Suspension & géométrie",
    keywords: ["suspension", "amortisseur", "amortisseurs", "parallelisme", "geometrie", "vibration au volant", "tire a droite", "tire a gauche", "bruit en virage"],
    partsMin: 70, partsMax: 170, hoursMin: 1.5, hoursMax: 2.5,
  },
  {
    id: "pneu", label: "Pneumatiques (montage / équilibrage)",
    keywords: ["pneu use", "crevaison", "permutation", "equilibrage", "pneu ete"],
    partsMin: 0, partsMax: 0, hoursMin: 0.2, hoursMax: 0.3,
    note: "Hors prix du pneu (variable selon marque et dimension) — montage et équilibrage inclus.",
  },
  {
    id: "pneu_hiver", label: "Pneus hiver (jeu de 4, posés)",
    keywords: ["pneu hiver", "pneus hiver", "neige", "verglas", "hiver"],
    partsMin: 420, partsMax: 760, hoursMin: 1, hoursMax: 1.2,
    note: "Estimation pour un jeu de 4 pneus hiver posés et équilibrés (citadine/berline courante) — à confirmer selon la dimension exacte.",
  },
  {
    id: "clim", label: "Climatisation",
    keywords: ["climatisation", "clim", "ne refroidit plus", "gaz clim", "recharge clim"],
    partsMin: 10, partsMax: 75, hoursMin: 0.8, hoursMax: 1.2,
  },
  {
    id: "batterie", label: "Batterie & démarrage",
    keywords: ["batterie", "demarreur", "alternateur", "ne demarre pas", "ne demarre plus", "clic clic", "voiture ne demarre pas"],
    partsMin: 50, partsMax: 230, hoursMin: 0.4, hoursMax: 0.8,
  },
  {
    id: "echappement", label: "Échappement",
    keywords: ["echappement", "pot d'echappement", "pot d echappement", "bruit fort au pot", "fuite echappement"],
    partsMin: 30, partsMax: 230, hoursMin: 1, hoursMax: 2,
  },
  {
    id: "ampoule", label: "Ampoules & éclairage",
    keywords: ["ampoule", "phare", "feu arriere", "clignotant", "ne s'allume plus", "ne s allume plus"],
    partsMin: 15, partsMax: 45, hoursMin: 0.2, hoursMax: 0.4,
  },
];

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

export function matchQuote(problem: string, year?: number, fuel?: FuelType): QuoteResult | null {
  if (!problem || !problem.trim()) return null;
  let best: QuoteCategory | null = null;
  let bestScore = 0;
  for (const cat of CATEGORIES) {
    const s = scoreCategory(problem, cat);
    if (s > bestScore) { bestScore = s; best = cat; }
  }
  if (!best || bestScore === 0) return null;

  if (fuel === "electrique" && COMBUSTION_ONLY.has(best.id)) {
    return {
      category: best, partsMin: 0, partsMax: 0, laborMin: 0, laborMax: 0,
      totalMin: 0, totalMax: 0, hoursMin: 0, hoursMax: 0, notApplicable: true,
    };
  }

  const { partsMin, partsMax, hoursMin, hoursMax } = best;
  const laborMin = Math.round(hoursMin * HOURLY_RATE);
  const laborMax = Math.round(hoursMax * HOURLY_RATE);
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

  if (fuel === "diesel" && DIESEL_UPCHARGE.has(best.id)) {
    totalMax = Math.round(totalMax * 1.1);
    fuelNote = "Diesel : pièces généralement plus coûteuses (turbo, injection HP) — fourchette haute majorée de 10 %.";
  }

  return { category: best, partsMin, partsMax, laborMin, laborMax, totalMin, totalMax, hoursMin, hoursMax, ageNote, fuelNote };
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
