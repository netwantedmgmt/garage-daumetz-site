/* Liste marques → modèles pour le devis instantané.
   ⚠️ Curatée pour couvrir la grande majorité du parc automobile français,
   PAS exhaustive (impossible à maintenir sans API constructeur). "Autre"
   toujours disponible en secours pour ne jamais bloquer un client. */

export type Brand = { name: string; models: string[] };

export const BRANDS: Brand[] = [
  { name: "Peugeot", models: ["108", "205", "206", "207", "208", "306", "307", "308", "406", "407", "508", "2008", "3008", "5008", "Partner", "Rifter"] },
  { name: "Renault", models: ["Twingo", "Clio", "Captur", "Mégane", "Scénic", "Kadjar", "Talisman", "Espace", "Kangoo", "Trafic", "Zoe"] },
  { name: "Citroën", models: ["C1", "C2", "C3", "C4", "C5", "C5 Aircross", "Berlingo", "C3 Picasso", "DS3", "DS4"] },
  { name: "Volkswagen", models: ["Up!", "Polo", "Golf", "Passat", "Tiguan", "Touran", "T-Roc", "T-Cross", "Caddy", "Transporter"] },
  { name: "Audi", models: ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7", "TT"] },
  { name: "BMW", models: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "X1", "X2", "X3", "X5"] },
  { name: "Mercedes-Benz", models: ["Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLC", "Vito", "Sprinter"] },
  { name: "Ford", models: ["Ka", "Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "C-Max", "Transit"] },
  { name: "Opel", models: ["Corsa", "Astra", "Insignia", "Crossland", "Grandland", "Zafira", "Mokka"] },
  { name: "Fiat", models: ["500", "Panda", "Punto", "Tipo", "500X", "Doblo"] },
  { name: "Toyota", models: ["Aygo", "Yaris", "Corolla", "C-HR", "RAV4", "Auris", "Prius"] },
  { name: "Nissan", models: ["Micra", "Juke", "Qashqai", "Note", "X-Trail", "Leaf"] },
  { name: "Dacia", models: ["Sandero", "Duster", "Logan", "Spring", "Jogger"] },
  { name: "Seat", models: ["Ibiza", "Leon", "Arona", "Ateca"] },
  { name: "Škoda", models: ["Fabia", "Octavia", "Superb", "Kodiaq", "Karoq"] },
  { name: "Hyundai", models: ["i10", "i20", "i30", "Tucson", "Kona"] },
  { name: "Kia", models: ["Picanto", "Rio", "Ceed", "Sportage", "Niro"] },
  { name: "Volvo", models: ["V40", "V60", "XC40", "XC60"] },
  { name: "Mini", models: ["Cooper", "Countryman", "Clubman"] },
  { name: "Smart", models: ["ForTwo", "ForFour"] },
  { name: "Mazda", models: ["2", "3", "CX-3", "CX-5"] },
  { name: "Honda", models: ["Civic", "Jazz", "CR-V", "HR-V"] },
  { name: "Jeep", models: ["Renegade", "Compass", "Cherokee"] },
  { name: "Land Rover", models: ["Discovery", "Range Rover", "Evoque"] },
  { name: "Tesla", models: ["Model 3", "Model S", "Model Y", "Model X"] },
  { name: "Autre", models: ["Autre"] },
];

export function modelsFor(brandName: string): string[] {
  return BRANDS.find((b) => b.name === brandName)?.models ?? [];
}

export type FuelType = "essence" | "diesel" | "hybride" | "electrique";

export const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybride", label: "Hybride" },
  { value: "electrique", label: "Électrique" },
];
