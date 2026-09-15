/* Liste marques → modèles → motorisations pour le devis instantané.
   ⚠️ Curatée à partir des motorisations les plus commercialisées en France pour
   chaque modèle (toutes générations confondues), PAS exhaustive génération par
   génération ni année par année (impossible à garantir sans base constructeur
   payante type TecDoc/Autodata — on refuse d'inventer des codes moteur/années
   au risque de fournir une fausse info à un client ou au garage).
   "Autre" toujours disponible en secours pour ne jamais bloquer un client.
   Pour une identification 100% exacte du véhicule, voir plaque d'immatriculation
   (piste envisagée plus tard, cf. mémoire projet). */

export type FuelType = "essence" | "diesel" | "hybride" | "electrique";

export const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: "essence", label: "Essence" },
  { value: "diesel", label: "Diesel" },
  { value: "hybride", label: "Hybride" },
  { value: "electrique", label: "Électrique" },
];

export type Motorisation = { label: string; fuel: FuelType };
export type Model = { name: string; motorisations: Motorisation[] };
export type Brand = { name: string; models: Model[] };

const AUTRE_MOT: Motorisation[] = [
  { label: "Essence", fuel: "essence" },
  { label: "Diesel", fuel: "diesel" },
  { label: "Hybride", fuel: "hybride" },
  { label: "Électrique", fuel: "electrique" },
];

function e(label: string): Motorisation { return { label, fuel: "essence" }; }
function d(label: string): Motorisation { return { label, fuel: "diesel" }; }
function h(label: string): Motorisation { return { label, fuel: "hybride" }; }
function ev(label: string): Motorisation { return { label, fuel: "electrique" }; }

export const BRANDS: Brand[] = [
  {
    name: "Peugeot",
    models: [
      { name: "106", motorisations: [e("1.0"), e("1.1"), e("1.4"), e("1.6 16v")] },
      { name: "108", motorisations: [e("1.0 VTi 68"), e("1.2 PureTech 82")] },
      { name: "205", motorisations: [e("1.1"), e("1.4"), e("1.6"), e("1.9 GTI"), d("1.8 D")] },
      { name: "206", motorisations: [e("1.1"), e("1.4"), e("1.6 16v"), e("2.0 16v"), d("1.4 HDi"), d("2.0 HDi")] },
      { name: "207", motorisations: [e("1.4 VTi"), e("1.6 VTi"), e("1.6 THP"), d("1.4 HDi"), d("1.6 HDi")] },
      { name: "208", motorisations: [e("1.0 VTi 68"), e("1.2 PureTech 82/100"), e("1.2 PureTech 130"), e("1.6 GTi"), d("1.5 BlueHDi 100/130"), ev("e-208")] },
      { name: "306", motorisations: [e("1.4"), e("1.6"), e("1.8"), e("2.0 16v"), d("1.9 D/TD"), d("2.0 HDi")] },
      { name: "307", motorisations: [e("1.4 16v"), e("1.6 16v"), e("2.0 16v"), d("1.6 HDi"), d("2.0 HDi")] },
      { name: "308", motorisations: [e("1.2 PureTech 110/130"), e("1.6 THP"), d("1.5 BlueHDi 130"), d("1.6 BlueHDi 120"), d("2.0 BlueHDi 150/180"), h("Hybrid 225")] },
      { name: "406", motorisations: [e("1.8"), e("2.0"), e("2.0 Turbo"), d("1.9 TD"), d("2.0 HDi"), d("2.2 HDi")] },
      { name: "407", motorisations: [e("1.8"), e("2.0"), e("3.0 V6"), d("1.6 HDi"), d("2.0 HDi"), d("2.2 HDi")] },
      { name: "508", motorisations: [e("1.6 THP"), e("1.6 PureTech 180/225"), d("1.5 BlueHDi 130"), d("2.0 BlueHDi 160/180"), h("Hybrid 225/360")] },
      { name: "605", motorisations: [e("2.0"), e("3.0 V6"), d("2.1 TD"), d("2.5 TD")] },
      { name: "807", motorisations: [e("2.0"), e("2.2"), d("2.0 HDi"), d("2.2 HDi")] },
      { name: "2008", motorisations: [e("1.2 PureTech 100/130"), d("1.5 BlueHDi 100/130"), ev("e-2008")] },
      { name: "3008", motorisations: [e("1.2 PureTech 130"), e("1.6 THP"), d("1.5 BlueHDi 130"), d("2.0 BlueHDi 150/180"), h("Hybrid4 300")] },
      { name: "4007", motorisations: [e("2.4"), d("2.2 HDi")] },
      { name: "4008", motorisations: [e("1.6"), d("1.8 HDi")] },
      { name: "5008", motorisations: [e("1.2 PureTech 130"), e("1.6 THP"), d("1.5 BlueHDi 130"), d("2.0 BlueHDi 150/180")] },
      { name: "Partner", motorisations: [e("1.6 VTi"), d("1.6 HDi"), d("1.5 BlueHDi"), ev("e-Partner")] },
      { name: "Rifter", motorisations: [e("1.2 PureTech 110/130"), d("1.5 BlueHDi 100/130"), ev("e-Rifter")] },
      { name: "Expert", motorisations: [d("2.0 BlueHDi"), ev("e-Expert")] },
      { name: "Boxer", motorisations: [d("2.2 BlueHDi"), d("2.2 HDi"), ev("e-Boxer")] },
      { name: "Traveller", motorisations: [d("2.0 BlueHDi"), ev("e-Traveller")] },
    ],
  },
  {
    name: "Renault",
    models: [
      { name: "Twingo", motorisations: [e("1.0 SCe 65/75"), e("1.2 16v"), ev("Twingo E-Tech")] },
      { name: "Clio", motorisations: [e("1.0 SCe 65/75"), e("1.0 TCe 90/100"), e("1.3 TCe 130"), d("1.5 dCi 75/85/100/115"), h("E-Tech 140")] },
      { name: "Captur", motorisations: [e("1.0 TCe 90/100"), e("1.3 TCe 130/155"), d("1.5 dCi 95/115"), h("E-Tech 145/160")] },
      { name: "Mégane", motorisations: [e("1.2 TCe"), e("1.3 TCe 140"), d("1.5 dCi 90/110/115"), d("1.6 dCi 130"), ev("Mégane E-Tech Electric")] },
      { name: "Scénic", motorisations: [e("1.2 TCe"), e("1.3 TCe"), d("1.5 dCi"), d("1.6 dCi")] },
      { name: "Kadjar", motorisations: [e("1.3 TCe 140/160"), d("1.5 dCi 115"), d("1.7 dCi 150")] },
      { name: "Laguna", motorisations: [e("1.6"), e("2.0 Turbo"), d("1.5 dCi"), d("1.9 dCi"), d("2.0 dCi")] },
      { name: "Fluence", motorisations: [e("1.6"), d("1.5 dCi")] },
      { name: "Talisman", motorisations: [e("1.6 TCe"), d("1.6 dCi"), d("1.5 dCi 110")] },
      { name: "Koleos", motorisations: [e("1.3 TCe"), d("1.7 dCi"), d("2.0 dCi")] },
      { name: "Arkana", motorisations: [e("1.3 TCe 140/160"), h("E-Tech 145")] },
      { name: "Austral", motorisations: [e("1.3 TCe 140/160"), h("E-Tech 200")] },
      { name: "Espace", motorisations: [e("1.6 TCe 200/225"), d("1.6 dCi 130/160"), d("2.0 dCi"), h("E-Tech 200/300")] },
      { name: "Kangoo", motorisations: [e("1.2 TCe"), d("1.5 dCi"), ev("Kangoo E-Tech Electric")] },
      { name: "Trafic", motorisations: [d("1.6 dCi"), d("2.0 dCi 110/130/150/170")] },
      { name: "Master", motorisations: [d("2.3 dCi 110/135/150/180"), ev("Master E-Tech Electric")] },
      { name: "Zoe", motorisations: [ev("Zoe E-Tech Electric")] },
    ],
  },
  {
    name: "Citroën",
    models: [
      { name: "Saxo", motorisations: [e("1.0"), e("1.1"), e("1.4"), e("1.6 16v"), d("1.5 D")] },
      { name: "C1", motorisations: [e("1.0 VTi 68")] },
      { name: "C2", motorisations: [e("1.1"), e("1.4"), e("1.6 16v"), d("1.4 HDi")] },
      { name: "C3", motorisations: [e("1.0 VTi 68"), e("1.2 PureTech 82/110"), d("1.5 BlueHDi 100/130"), ev("ë-C3")] },
      { name: "C3 Aircross", motorisations: [e("1.2 PureTech 110/130"), d("1.5 BlueHDi 100/130")] },
      { name: "C3 Picasso", motorisations: [e("1.2 PureTech 82/110"), d("1.6 HDi"), d("1.6 BlueHDi 100")] },
      { name: "C4", motorisations: [e("1.2 PureTech 100/130"), e("1.6 THP"), d("1.5 BlueHDi 130"), d("1.6 BlueHDi 120"), ev("ë-C4")] },
      { name: "C4 Picasso", motorisations: [e("1.2 PureTech 130"), e("1.6 THP"), d("1.6 HDi"), d("1.6 BlueHDi"), d("2.0 BlueHDi")] },
      { name: "C4 Cactus", motorisations: [e("1.2 PureTech 82/110/130"), d("1.5 BlueHDi 100/120")] },
      { name: "C4 SpaceTourer", motorisations: [e("1.2 PureTech 130"), d("1.5 BlueHDi 130"), d("2.0 BlueHDi 150")] },
      { name: "C5", motorisations: [e("1.8"), e("2.0"), d("1.6 HDi"), d("2.0 HDi")] },
      { name: "C5 Aircross", motorisations: [e("1.2 PureTech 130"), e("1.6 PureTech 180"), d("1.5 BlueHDi 130"), d("2.0 BlueHDi 180"), h("Hybrid 225")] },
      { name: "C5 X", motorisations: [e("1.2 PureTech 130"), h("Hybrid 225/360")] },
      { name: "C6", motorisations: [e("3.0 V6"), d("2.2 HDi"), d("2.7 HDi V6")] },
      { name: "Xsara", motorisations: [e("1.4"), e("1.6"), e("1.8"), d("1.9 D"), d("2.0 HDi")] },
      { name: "Xsara Picasso", motorisations: [e("1.6"), e("1.8"), d("1.6 HDi"), d("2.0 HDi")] },
      { name: "Berlingo", motorisations: [e("1.2 PureTech 110/130"), d("1.6 HDi"), d("1.5 BlueHDi 100/130"), ev("ë-Berlingo")] },
      { name: "Jumpy", motorisations: [d("2.0 BlueHDi"), ev("ë-Jumpy")] },
      { name: "Jumper", motorisations: [d("2.2 BlueHDi"), ev("ë-Jumper")] },
      { name: "Ami", motorisations: [ev("Ami Electric")] },
      { name: "DS3", motorisations: [e("1.2 PureTech"), e("1.6 THP"), d("1.6 HDi")] },
      { name: "DS4", motorisations: [e("1.2 PureTech"), e("1.6 THP"), d("1.6 HDi"), d("2.0 HDi")] },
    ],
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Up!", motorisations: [e("1.0 MPI 60/75"), e("1.0 TSI 90"), ev("e-Up!")] },
      { name: "Polo", motorisations: [e("1.0 MPI/TSI 65/75/95"), e("1.5 TSI 150"), d("1.6 TDI 80/95")] },
      { name: "Golf", motorisations: [e("1.0 TSI 90/110"), e("1.5 TSI 130/150"), e("2.0 TSI GTI"), d("1.6 TDI 90/115"), d("2.0 TDI 115/150"), h("GTE"), ev("e-Golf")] },
      { name: "Jetta", motorisations: [e("1.4 TSI"), e("1.6"), d("1.9 TDI"), d("2.0 TDI")] },
      { name: "Scirocco", motorisations: [e("1.4 TSI"), e("2.0 TSI"), d("2.0 TDI")] },
      { name: "Beetle", motorisations: [e("1.2 TSI"), e("1.4 TSI"), e("2.0 TSI"), d("1.6 TDI"), d("2.0 TDI")] },
      { name: "Arteon", motorisations: [e("1.5 TSI"), e("2.0 TSI"), d("2.0 TDI"), h("eHybrid")] },
      { name: "Passat", motorisations: [e("1.4 TSI"), e("1.5 TSI"), e("2.0 TSI"), d("1.6 TDI"), d("2.0 TDI 122/150/190"), h("GTE")] },
      { name: "Sharan", motorisations: [e("1.4 TSI"), e("2.0 TSI"), d("2.0 TDI")] },
      { name: "Tiguan", motorisations: [e("1.5 TSI 130/150"), e("2.0 TSI"), d("2.0 TDI 122/150/190"), h("eHybrid")] },
      { name: "Touran", motorisations: [e("1.2 TSI"), e("1.5 TSI"), d("1.6 TDI"), d("2.0 TDI")] },
      { name: "T-Roc", motorisations: [e("1.0 TSI"), e("1.5 TSI 150"), e("2.0 TSI"), d("2.0 TDI 115/150")] },
      { name: "T-Cross", motorisations: [e("1.0 TSI 95/110"), d("1.6 TDI 95")] },
      { name: "Amarok", motorisations: [d("2.0 TDI"), d("3.0 V6 TDI")] },
      { name: "Caddy", motorisations: [e("1.4 TSI"), d("1.6 TDI"), d("2.0 TDI")] },
      { name: "Transporter", motorisations: [d("2.0 TDI 102/150/199")] },
      { name: "Multivan", motorisations: [d("2.0 TDI"), h("eHybrid")] },
      { name: "ID.3", motorisations: [ev("ID.3")] },
      { name: "ID.4", motorisations: [ev("ID.4")] },
      { name: "ID.5", motorisations: [ev("ID.5")] },
    ],
  },
  {
    name: "Audi",
    models: [
      { name: "A1", motorisations: [e("1.0 TFSI 95"), e("1.4 TFSI"), e("S1"), d("1.6 TDI")] },
      { name: "A3", motorisations: [e("1.0 TFSI"), e("1.5 TFSI"), e("2.0 TFSI"), d("1.6 TDI 90/116"), d("2.0 TDI 150"), h("e-tron/TFSIe")] },
      { name: "S3", motorisations: [e("2.0 TFSI 300/310")] },
      { name: "RS3", motorisations: [e("2.5 TFSI 400/400+")] },
      { name: "A4", motorisations: [e("1.4 TFSI"), e("2.0 TFSI"), d("2.0 TDI 122/150/190"), d("3.0 TDI")] },
      { name: "A4 allroad", motorisations: [e("2.0 TFSI"), d("2.0 TDI"), d("3.0 TDI")] },
      { name: "RS4", motorisations: [e("2.9 V6 TFSI 450")] },
      { name: "A5", motorisations: [e("2.0 TFSI"), d("2.0 TDI"), d("3.0 TDI")] },
      { name: "A6", motorisations: [e("2.0 TFSI"), e("3.0 TFSI"), d("2.0 TDI"), d("3.0 TDI")] },
      { name: "A6 allroad", motorisations: [d("3.0 TDI")] },
      { name: "RS6", motorisations: [e("4.0 V8 TFSI 600")] },
      { name: "A7", motorisations: [e("3.0 TFSI"), d("3.0 TDI"), h("55 TFSIe")] },
      { name: "A8", motorisations: [e("3.0 TFSI"), e("4.0 TFSI"), d("3.0 TDI")] },
      { name: "Q2", motorisations: [e("1.0 TFSI"), e("1.5 TFSI"), d("2.0 TDI")] },
      { name: "Q3", motorisations: [e("1.5 TFSI"), e("2.0 TFSI"), d("2.0 TDI 150/190")] },
      { name: "Q3 Sportback", motorisations: [e("1.5 TFSI"), e("2.0 TFSI"), d("2.0 TDI")] },
      { name: "Q4 e-tron", motorisations: [ev("Q4 e-tron")] },
      { name: "Q5", motorisations: [e("2.0 TFSI"), d("2.0 TDI 163/190"), d("3.0 TDI"), h("55 TFSIe")] },
      { name: "Q5 Sportback", motorisations: [e("2.0 TFSI"), d("2.0 TDI")] },
      { name: "Q7", motorisations: [e("3.0 TFSI"), d("3.0 TDI")] },
      { name: "Q8", motorisations: [e("3.0 TFSI"), d("3.0 TDI")] },
      { name: "e-tron", motorisations: [ev("e-tron")] },
      { name: "e-tron GT", motorisations: [ev("e-tron GT")] },
      { name: "TT", motorisations: [e("1.8 TFSI"), e("2.0 TFSI"), d("2.0 TDI")] },
      { name: "R8", motorisations: [e("4.2 V8"), e("5.2 V10")] },
    ],
  },
  {
    name: "BMW",
    models: [
      { name: "Série 1", motorisations: [e("116i/118i"), e("120i"), e("M135i"), d("116d/118d"), d("120d")] },
      { name: "Série 2", motorisations: [e("218i/220i"), d("216d/218d/220d")] },
      { name: "Série 3", motorisations: [e("318i/320i"), e("330i"), d("316d/318d/320d"), d("330d"), h("330e")] },
      { name: "Série 4", motorisations: [e("420i/430i"), d("420d/430d")] },
      { name: "Série 5", motorisations: [e("520i/530i"), d("518d/520d/525d/530d"), h("530e")] },
      { name: "Série 6", motorisations: [e("630i"), d("630d/640d")] },
      { name: "Série 7", motorisations: [e("730i/740i"), d("730d/740d"), h("745e")] },
      { name: "Série 8", motorisations: [e("840i"), d("840d")] },
      { name: "X1", motorisations: [e("sDrive18i/20i"), d("sDrive18d/xDrive20d")] },
      { name: "X2", motorisations: [e("18i/20i"), d("18d/20d")] },
      { name: "X3", motorisations: [e("20i/30i"), d("20d/30d"), h("30e")] },
      { name: "X4", motorisations: [e("20i/30i"), d("20d/30d")] },
      { name: "X5", motorisations: [e("40i"), d("25d/30d/40d"), h("45e")] },
      { name: "X6", motorisations: [e("40i"), d("30d/40d")] },
      { name: "X7", motorisations: [e("40i"), d("30d/40d")] },
      { name: "Z4", motorisations: [e("20i/30i/M40i")] },
      { name: "i3", motorisations: [ev("i3")] },
      { name: "i4", motorisations: [ev("i4")] },
      { name: "iX", motorisations: [ev("iX")] },
    ],
  },
  {
    name: "Mercedes-Benz",
    models: [
      { name: "Classe A", motorisations: [e("A160/A180"), e("A200/A250"), d("A160d/A180d/A200d"), h("A250e")] },
      { name: "Classe B", motorisations: [e("B160/B180/B200"), d("B180d/B200d")] },
      { name: "Classe C", motorisations: [e("C180/C200/C300"), d("C200d/C220d/C300d"), h("C300e")] },
      { name: "CLA", motorisations: [e("CLA180/CLA200/CLA250"), d("CLA200d/CLA220d")] },
      { name: "CLS", motorisations: [e("CLS300/CLS450"), d("CLS300d/CLS350d")] },
      { name: "Classe E", motorisations: [e("E200/E300"), d("E200d/E220d/E300d"), h("E300e")] },
      { name: "Classe S", motorisations: [e("S450/S500"), d("S350d/S400d"), h("S560e")] },
      { name: "Classe G", motorisations: [e("G500"), d("G350d")] },
      { name: "GLA", motorisations: [e("GLA200/GLA250"), d("GLA200d/GLA220d")] },
      { name: "GLB", motorisations: [e("GLB200/GLB250"), d("GLB200d/GLB220d")] },
      { name: "GLC", motorisations: [e("GLC200/GLC300"), d("GLC200d/GLC220d/GLC300d"), h("GLC300e")] },
      { name: "GLE", motorisations: [e("GLE350/GLE450"), d("GLE300d/GLE350d")] },
      { name: "GLS", motorisations: [e("GLS450/GLS580"), d("GLS400d")] },
      { name: "EQA", motorisations: [ev("EQA")] },
      { name: "EQB", motorisations: [ev("EQB")] },
      { name: "EQC", motorisations: [ev("EQC")] },
      { name: "EQE", motorisations: [ev("EQE")] },
      { name: "EQS", motorisations: [ev("EQS")] },
      { name: "Citan", motorisations: [d("108/110/112 CDI")] },
      { name: "Vito", motorisations: [d("109/111/114/116 CDI")] },
      { name: "Sprinter", motorisations: [d("311/314/316/319 CDI")] },
    ],
  },
  {
    name: "Ford",
    models: [
      { name: "Ka", motorisations: [e("1.2 Duratec"), e("1.0 EcoBoost")] },
      { name: "Fiesta", motorisations: [e("1.1 Ti-VCT"), e("1.0 EcoBoost 95/100/125/140"), d("1.5 TDCi 85/120")] },
      { name: "EcoSport", motorisations: [e("1.0 EcoBoost"), d("1.5 TDCi")] },
      { name: "Focus", motorisations: [e("1.0 EcoBoost 100/125/155"), e("1.5 EcoBoost"), d("1.5 TDCi 95/120"), d("2.0 TDCi 150")] },
      { name: "C-Max", motorisations: [e("1.0 EcoBoost"), d("1.5 TDCi"), d("2.0 TDCi")] },
      { name: "Puma", motorisations: [e("1.0 EcoBoost 125/155"), h("1.0 EcoBoost Hybrid")] },
      { name: "Kuga", motorisations: [e("1.5 EcoBoost 120/150"), d("1.5 TDCi"), d("2.0 TDCi"), h("Hybrid/PHEV")] },
      { name: "Edge", motorisations: [d("2.0 TDCi")] },
      { name: "Mondeo", motorisations: [e("1.5 EcoBoost"), e("2.0 EcoBoost"), d("2.0 TDCi 150/180"), h("Hybrid")] },
      { name: "Galaxy", motorisations: [e("1.5 EcoBoost"), d("2.0 TDCi")] },
      { name: "S-Max", motorisations: [e("1.5/2.0 EcoBoost"), d("2.0 TDCi")] },
      { name: "Mustang Mach-E", motorisations: [ev("Mustang Mach-E")] },
      { name: "Ranger", motorisations: [d("2.0 EcoBlue"), d("3.2 TDCi")] },
      { name: "Transit", motorisations: [d("2.0 EcoBlue 105/130/170")] },
      { name: "Tourneo", motorisations: [d("2.0 EcoBlue")] },
    ],
  },
  {
    name: "Opel",
    models: [
      { name: "Adam", motorisations: [e("1.2"), e("1.4"), e("1.0 Turbo")] },
      { name: "Corsa", motorisations: [e("1.2 (12v/turbo)"), e("1.4 Turbo"), d("1.5 Diesel"), ev("Corsa-e")] },
      { name: "Meriva", motorisations: [e("1.4 Turbo"), d("1.3 CDTI"), d("1.7 CDTI")] },
      { name: "Astra", motorisations: [e("1.2 Turbo"), e("1.4 Turbo"), d("1.5 Diesel"), d("1.6 CDTI"), h("Hybrid")] },
      { name: "Insignia", motorisations: [e("1.5 Turbo"), e("2.0 Turbo"), d("1.5 Diesel"), d("2.0 Diesel")] },
      { name: "Antara", motorisations: [e("2.4"), d("2.0 CDTI")] },
      { name: "Crossland", motorisations: [e("1.2 (Turbo)"), d("1.5 Diesel")] },
      { name: "Grandland", motorisations: [e("1.2 Turbo"), d("1.5 Diesel"), h("Hybrid4")] },
      { name: "Zafira", motorisations: [e("1.4 Turbo"), d("1.6 CDTI"), d("2.0 CDTI")] },
      { name: "Mokka", motorisations: [e("1.2 Turbo"), d("1.5 Diesel"), ev("Mokka-e")] },
      { name: "Combo", motorisations: [e("1.2 Turbo"), d("1.5 Diesel"), ev("Combo-e")] },
      { name: "Vivaro", motorisations: [d("2.0 Diesel"), ev("Vivaro-e")] },
      { name: "Movano", motorisations: [d("2.2 Diesel")] },
    ],
  },
  {
    name: "Fiat",
    models: [
      { name: "500", motorisations: [e("1.2 8v"), e("0.9 TwinAir"), ev("500e")] },
      { name: "500X", motorisations: [e("1.0 T3"), e("1.3 T4"), d("1.6 Multijet")] },
      { name: "Panda", motorisations: [e("1.2 8v"), e("0.9 TwinAir"), d("1.3 Multijet")] },
      { name: "Punto", motorisations: [e("1.2 8v"), e("1.4 8v/16v"), d("1.3 Multijet")] },
      { name: "Tipo", motorisations: [e("1.4"), e("1.6"), d("1.3 Multijet"), d("1.6 Multijet")] },
      { name: "Bravo", motorisations: [e("1.4"), e("1.4 T-Jet"), d("1.6 Multijet"), d("2.0 Multijet")] },
      { name: "Croma", motorisations: [e("1.8"), e("2.2"), d("1.9 Multijet")] },
      { name: "Idea", motorisations: [e("1.4"), d("1.3 Multijet")] },
      { name: "Freemont", motorisations: [e("2.4"), d("2.0 Multijet")] },
      { name: "Doblo", motorisations: [e("1.4"), d("1.3 Multijet"), d("1.6 Multijet")] },
      { name: "Qubo", motorisations: [e("1.4"), d("1.3 Multijet")] },
      { name: "Ducato", motorisations: [d("2.3 Multijet")] },
    ],
  },
  {
    name: "Toyota",
    models: [
      { name: "Aygo", motorisations: [e("1.0 VVT-i")] },
      { name: "Yaris", motorisations: [e("1.0/1.5 VVT-i"), h("Hybrid 100h/115h/130h")] },
      { name: "Corolla", motorisations: [e("1.2 Turbo"), h("Hybrid 122h/140h/180h")] },
      { name: "Auris", motorisations: [e("1.33/1.6 Valvematic"), d("1.4 D-4D"), h("Hybrid 136h")] },
      { name: "Avensis", motorisations: [e("1.6/1.8/2.0"), d("2.0 D-4D"), d("2.2 D-4D")] },
      { name: "Verso", motorisations: [e("1.6/1.8"), d("2.0 D-4D")] },
      { name: "Camry", motorisations: [h("Hybrid 218h")] },
      { name: "C-HR", motorisations: [e("1.2 Turbo"), h("Hybrid 122h/180h")] },
      { name: "RAV4", motorisations: [h("Hybrid 218h"), h("Plug-in Hybrid 306h")] },
      { name: "Highlander", motorisations: [h("Hybrid")] },
      { name: "Land Cruiser", motorisations: [d("2.8 D-4D"), h("Hybrid")] },
      { name: "Prius", motorisations: [h("Hybrid"), h("Plug-in Hybrid")] },
      { name: "Supra", motorisations: [e("2.0 Turbo"), e("3.0 Turbo")] },
      { name: "Proace", motorisations: [d("2.0 D-4D"), ev("Proace Electric")] },
      { name: "bZ4X", motorisations: [ev("bZ4X")] },
    ],
  },
  {
    name: "Nissan",
    models: [
      { name: "Micra", motorisations: [e("1.0 IG-T"), d("1.5 dCi")] },
      { name: "Note", motorisations: [e("1.2"), d("1.5 dCi")] },
      { name: "Pulsar", motorisations: [e("1.2 DIG-T"), d("1.5 dCi")] },
      { name: "Juke", motorisations: [e("1.0 DIG-T"), h("Hybrid 143")] },
      { name: "Qashqai", motorisations: [e("1.3 DIG-T"), d("1.5/1.7 dCi"), h("e-Power")] },
      { name: "X-Trail", motorisations: [e("1.3 DIG-T"), d("1.6/2.0 dCi"), h("e-Power")] },
      { name: "Pathfinder", motorisations: [e("2.5"), d("2.5 dCi"), d("3.0 dCi")] },
      { name: "Navara", motorisations: [d("2.3 dCi")] },
      { name: "370Z", motorisations: [e("3.7 V6")] },
      { name: "Leaf", motorisations: [ev("Leaf Electric")] },
      { name: "Ariya", motorisations: [ev("Ariya")] },
      { name: "NV200", motorisations: [d("1.5 dCi"), ev("e-NV200")] },
    ],
  },
  {
    name: "Dacia",
    models: [
      { name: "Sandero", motorisations: [e("1.0 SCe 65"), e("1.0 TCe 90/100"), d("1.5 Blue dCi 95"), h("Eco-G GPL")] },
      { name: "Duster", motorisations: [e("1.0 TCe 90/100/130"), d("1.5 Blue dCi 95/115"), h("Eco-G GPL")] },
      { name: "Logan", motorisations: [e("1.0 SCe/TCe"), d("1.5 dCi")] },
      { name: "Dokker", motorisations: [e("1.6"), d("1.5 dCi")] },
      { name: "Lodgy", motorisations: [e("1.2 TCe"), d("1.5 dCi")] },
      { name: "Spring", motorisations: [ev("Spring Electric")] },
      { name: "Jogger", motorisations: [e("1.0 TCe 100/110"), h("Hybrid 140")] },
    ],
  },
  {
    name: "Seat",
    models: [
      { name: "Mii", motorisations: [e("1.0 MPI"), ev("Mii Electric")] },
      { name: "Ibiza", motorisations: [e("1.0 MPI/TSI"), e("1.5 TSI"), d("1.6 TDI")] },
      { name: "Leon", motorisations: [e("1.0 TSI"), e("1.5 TSI"), d("2.0 TDI"), h("e-Hybrid")] },
      { name: "Arona", motorisations: [e("1.0 TSI"), d("1.6 TDI")] },
      { name: "Ateca", motorisations: [e("1.5 TSI"), e("2.0 TSI"), d("2.0 TDI")] },
      { name: "Tarraco", motorisations: [e("1.5 TSI"), e("2.0 TSI"), d("2.0 TDI"), h("e-Hybrid")] },
      { name: "Alhambra", motorisations: [e("1.4 TSI"), d("2.0 TDI")] },
    ],
  },
  {
    name: "Škoda",
    models: [
      { name: "Fabia", motorisations: [e("1.0 MPI/TSI"), d("1.4/1.6 TDI")] },
      { name: "Rapid", motorisations: [e("1.2 TSI"), e("1.6"), d("1.6 TDI")] },
      { name: "Scala", motorisations: [e("1.0/1.5 TSI"), d("1.6 TDI")] },
      { name: "Octavia", motorisations: [e("1.0 TSI"), e("1.5 TSI"), d("2.0 TDI"), h("iV Plug-in")] },
      { name: "Superb", motorisations: [e("1.5 TSI"), e("2.0 TSI"), d("2.0 TDI"), h("iV Plug-in")] },
      { name: "Kamiq", motorisations: [e("1.0/1.5 TSI"), d("1.6 TDI")] },
      { name: "Karoq", motorisations: [e("1.0/1.5 TSI"), d("2.0 TDI")] },
      { name: "Kodiaq", motorisations: [e("1.5 TSI"), e("2.0 TSI"), d("2.0 TDI")] },
      { name: "Enyaq", motorisations: [ev("Enyaq")] },
    ],
  },
  {
    name: "Hyundai",
    models: [
      { name: "i10", motorisations: [e("1.0/1.2 MPI")] },
      { name: "i20", motorisations: [e("1.2 MPI"), e("1.0 T-GDI"), d("1.1/1.4 CRDi")] },
      { name: "Accent", motorisations: [e("1.4"), e("1.6"), d("1.5 CRDi")] },
      { name: "i30", motorisations: [e("1.0/1.4 T-GDI"), d("1.6 CRDi"), h("Hybrid")] },
      { name: "Elantra", motorisations: [e("1.6"), d("1.6 CRDi")] },
      { name: "Bayon", motorisations: [e("1.0 T-GDI")] },
      { name: "Kona", motorisations: [e("1.0 T-GDI"), d("1.6 CRDi"), h("Hybrid"), ev("Kona Electric")] },
      { name: "ix20", motorisations: [e("1.4/1.6"), d("1.4/1.6 CRDi")] },
      { name: "ix35", motorisations: [e("2.0"), d("1.7/2.0 CRDi")] },
      { name: "Tucson", motorisations: [e("1.6 T-GDI"), d("1.6/2.0 CRDi"), h("Hybrid/Plug-in")] },
      { name: "Santa Fe", motorisations: [e("2.4"), d("2.0/2.2 CRDi"), h("Hybrid")] },
      { name: "Ioniq", motorisations: [h("Hybrid"), ev("Ioniq Electric")] },
      { name: "Ioniq 5", motorisations: [ev("Ioniq 5")] },
    ],
  },
  {
    name: "Kia",
    models: [
      { name: "Picanto", motorisations: [e("1.0/1.2 MPI")] },
      { name: "Rio", motorisations: [e("1.2/1.4 MPI"), e("1.0 T-GDI"), d("1.4 CRDi")] },
      { name: "Venga", motorisations: [e("1.4/1.6"), d("1.4/1.6 CRDi")] },
      { name: "Soul", motorisations: [e("1.6"), d("1.6 CRDi"), ev("e-Soul")] },
      { name: "Ceed", motorisations: [e("1.0/1.4 T-GDI"), d("1.6 CRDi"), h("Hybrid")] },
      { name: "XCeed", motorisations: [e("1.0/1.4 T-GDI"), d("1.6 CRDi"), h("Plug-in")] },
      { name: "Stonic", motorisations: [e("1.0 T-GDI"), d("1.6 CRDi")] },
      { name: "Sportage", motorisations: [e("1.6 T-GDI"), d("1.6/2.0 CRDi"), h("Hybrid/Plug-in")] },
      { name: "Sorento", motorisations: [d("2.2 CRDi"), h("Hybrid/Plug-in")] },
      { name: "Niro", motorisations: [h("Hybrid"), h("Plug-in Hybrid"), ev("e-Niro")] },
      { name: "EV6", motorisations: [ev("EV6")] },
    ],
  },
  {
    name: "Volvo",
    models: [
      { name: "V40", motorisations: [e("T2/T3/T4"), d("D2/D3/D4")] },
      { name: "S60", motorisations: [e("T3/T4/T5"), d("D3/D4"), h("T6/T8 Twin Engine")] },
      { name: "V60", motorisations: [e("T3/T4/T5"), d("D3/D4"), h("T6/T8 Twin Engine")] },
      { name: "S80", motorisations: [e("T5/T6"), d("D3/D4/D5")] },
      { name: "V70", motorisations: [e("T5"), d("D3/D4/D5")] },
      { name: "S90", motorisations: [e("T5/T6"), d("D3/D4/D5"), h("T8 Twin Engine")] },
      { name: "V90", motorisations: [e("T5/T6"), d("D3/D4/D5"), h("T8 Twin Engine")] },
      { name: "XC40", motorisations: [e("T2/T3/T4"), d("D3/D4"), h("T5 Recharge"), ev("Recharge Pure Electric")] },
      { name: "XC60", motorisations: [e("T4/T5"), d("D3/D4/D5"), h("T6/T8 Twin Engine")] },
      { name: "XC70", motorisations: [d("D4/D5")] },
      { name: "XC90", motorisations: [e("T5/T6"), d("D4/D5"), h("T8 Twin Engine")] },
      { name: "EX30", motorisations: [ev("EX30")] },
    ],
  },
  {
    name: "Mini",
    models: [
      { name: "Cooper", motorisations: [e("One 1.2/1.5"), e("Cooper 1.5"), e("Cooper S 2.0"), d("Cooper D 1.5/2.0")] },
      { name: "Cabrio", motorisations: [e("Cooper 1.5"), e("Cooper S 2.0"), d("Cooper D 2.0")] },
      { name: "Countryman", motorisations: [e("Cooper 1.5"), e("Cooper S 2.0"), d("Cooper D 2.0"), h("Cooper SE Plug-in")] },
      { name: "Clubman", motorisations: [e("Cooper 1.5"), e("Cooper S 2.0"), d("Cooper D 2.0")] },
      { name: "Paceman", motorisations: [e("Cooper 1.6"), e("Cooper S 1.6"), d("Cooper D 2.0")] },
    ],
  },
  {
    name: "Smart",
    models: [
      { name: "ForTwo", motorisations: [e("1.0"), ev("EQ ForTwo")] },
      { name: "ForFour", motorisations: [e("1.0"), ev("EQ ForFour")] },
    ],
  },
  {
    name: "Mazda",
    models: [
      { name: "2", motorisations: [e("1.5 Skyactiv-G")] },
      { name: "3", motorisations: [e("2.0 Skyactiv-G/X"), d("1.8 Skyactiv-D")] },
      { name: "5", motorisations: [e("1.8/2.0"), d("1.6/2.0 CD")] },
      { name: "6", motorisations: [e("2.0/2.5 Skyactiv-G"), d("2.2 Skyactiv-D")] },
      { name: "CX-3", motorisations: [e("2.0 Skyactiv-G"), d("1.5 Skyactiv-D")] },
      { name: "CX-5", motorisations: [e("2.0/2.5 Skyactiv-G"), d("2.2 Skyactiv-D")] },
      { name: "CX-30", motorisations: [e("2.0 Skyactiv-G/X"), d("1.8 Skyactiv-D")] },
      { name: "CX-60", motorisations: [e("2.5 Skyactiv"), h("Plug-in Hybrid")] },
      { name: "MX-5", motorisations: [e("1.5/2.0 Skyactiv-G")] },
    ],
  },
  {
    name: "Honda",
    models: [
      { name: "Jazz", motorisations: [e("1.3/1.5"), h("e:HEV Hybrid")] },
      { name: "Civic", motorisations: [e("1.0 VTEC Turbo"), h("e:HEV Hybrid")] },
      { name: "CR-Z", motorisations: [h("Hybrid")] },
      { name: "Accord", motorisations: [e("1.5 VTEC Turbo"), h("Hybrid")] },
      { name: "HR-V", motorisations: [e("1.5"), h("e:HEV Hybrid")] },
      { name: "CR-V", motorisations: [e("1.5 VTEC Turbo"), h("e:HEV Hybrid")] },
      { name: "e", motorisations: [ev("Honda e")] },
    ],
  },
  {
    name: "Jeep",
    models: [
      { name: "Renegade", motorisations: [e("1.0/1.3 T4"), d("1.6/2.0 Multijet"), h("4xe Plug-in")] },
      { name: "Compass", motorisations: [e("1.3 T4"), d("1.6/2.0 Multijet"), h("4xe Plug-in")] },
      { name: "Avenger", motorisations: [e("1.2 T3"), ev("Avenger Electric")] },
      { name: "Cherokee", motorisations: [e("2.0/2.4"), d("2.2 Multijet")] },
      { name: "Grand Cherokee", motorisations: [e("3.6 V6"), d("3.0 CRD"), h("4xe Plug-in")] },
      { name: "Wrangler", motorisations: [e("2.0 Turbo"), d("2.2 Multijet"), h("4xe Plug-in")] },
    ],
  },
  {
    name: "Land Rover",
    models: [
      { name: "Defender", motorisations: [e("2.0 P300"), d("2.0/3.0 D200/D250/D300")] },
      { name: "Freelander", motorisations: [e("2.0/2.5"), d("2.0/2.2 TD4")] },
      { name: "Discovery Sport", motorisations: [e("2.0 Si4"), d("2.0 D150/D180"), h("Plug-in")] },
      { name: "Discovery", motorisations: [e("2.0 Si4"), d("2.0/3.0 SD4/SD6")] },
      { name: "Evoque", motorisations: [e("2.0 Si4"), d("2.0 D150/D180"), h("Plug-in")] },
      { name: "Range Rover Velar", motorisations: [e("2.0 P250"), d("2.0/3.0 D180/D300")] },
      { name: "Range Rover Sport", motorisations: [e("3.0/5.0"), d("3.0 SDV6"), h("P400e Plug-in")] },
      { name: "Range Rover", motorisations: [e("3.0/5.0"), d("3.0 SDV6/SDV8"), h("P400e Plug-in")] },
    ],
  },
  {
    name: "Tesla",
    models: [
      { name: "Model 3", motorisations: [ev("Model 3")] },
      { name: "Model S", motorisations: [ev("Model S")] },
      { name: "Model Y", motorisations: [ev("Model Y")] },
      { name: "Model X", motorisations: [ev("Model X")] },
      { name: "Cybertruck", motorisations: [ev("Cybertruck")] },
    ],
  },
  {
    name: "DS Automobiles",
    models: [
      { name: "DS3 Crossback", motorisations: [e("1.2 PureTech 100/130"), d("1.5 BlueHDi 100/130"), ev("e-tense")] },
      { name: "DS4", motorisations: [e("1.2 PureTech 130"), d("1.5 BlueHDi 130"), h("E-Tense")] },
      { name: "DS7", motorisations: [e("1.6 PureTech 180/225"), d("2.0 BlueHDi 180"), h("E-Tense 225/300")] },
      { name: "DS9", motorisations: [e("1.6 PureTech 250"), h("E-Tense 250/360")] },
    ],
  },
  {
    name: "Alfa Romeo",
    models: [
      { name: "Mito", motorisations: [e("1.4"), d("1.3 JTDM")] },
      { name: "Giulietta", motorisations: [e("1.4 TB"), d("1.6/2.0 JTDM")] },
      { name: "Giulia", motorisations: [e("2.0 Turbo"), d("2.2 JTDM"), e("Quadrifoglio 2.9 V6")] },
      { name: "Stelvio", motorisations: [e("2.0 Turbo"), d("2.2 JTDM"), e("Quadrifoglio 2.9 V6")] },
    ],
  },
  {
    name: "Suzuki",
    models: [
      { name: "Swift", motorisations: [e("1.2 Dualjet"), h("1.2 Hybrid")] },
      { name: "Ignis", motorisations: [e("1.2 Dualjet"), h("Hybrid")] },
      { name: "Vitara", motorisations: [e("1.4 Boosterjet"), h("Hybrid")] },
      { name: "SX4 S-Cross", motorisations: [e("1.0/1.4 Boosterjet"), h("Hybrid")] },
      { name: "Jimny", motorisations: [e("1.5")] },
    ],
  },
  {
    name: "Subaru",
    models: [
      { name: "Impreza", motorisations: [e("1.6/2.0")] },
      { name: "XV", motorisations: [e("1.6/2.0"), h("e-Boxer Hybrid")] },
      { name: "Forester", motorisations: [e("2.0"), h("e-Boxer Hybrid")] },
      { name: "Outback", motorisations: [e("2.5"), d("2.0D")] },
    ],
  },
  {
    name: "Porsche",
    models: [
      { name: "911", motorisations: [e("3.0 Flat-6 Turbo"), e("GT3 4.0")] },
      { name: "718 Boxster/Cayman", motorisations: [e("2.0/2.5 Turbo"), e("4.0 GT4")] },
      { name: "Macan", motorisations: [e("2.0/2.9 V6"), ev("Macan Electric")] },
      { name: "Cayenne", motorisations: [e("3.0 V6"), d("3.0 V6 TDI"), h("E-Hybrid")] },
      { name: "Panamera", motorisations: [e("2.9/4.0 V6/V8"), h("E-Hybrid")] },
      { name: "Taycan", motorisations: [ev("Taycan")] },
    ],
  },
  {
    name: "Jaguar",
    models: [
      { name: "XE", motorisations: [e("2.0 Ingenium"), d("2.0 Ingenium D")] },
      { name: "XF", motorisations: [e("2.0 Ingenium"), d("2.0 Ingenium D")] },
      { name: "F-Pace", motorisations: [e("2.0 Ingenium"), d("2.0 Ingenium D"), h("P400e Plug-in")] },
      { name: "E-Pace", motorisations: [e("2.0 Ingenium"), d("2.0 Ingenium D")] },
      { name: "I-Pace", motorisations: [ev("I-Pace")] },
    ],
  },
  {
    name: "Lexus",
    models: [
      { name: "CT", motorisations: [h("200h Hybrid")] },
      { name: "IS", motorisations: [h("300h Hybrid")] },
      { name: "NX", motorisations: [h("300h/350h Hybrid")] },
      { name: "RX", motorisations: [h("350h/450h Hybrid")] },
      { name: "UX", motorisations: [h("250h Hybrid"), ev("UX 300e")] },
    ],
  },
  {
    name: "Cupra",
    models: [
      { name: "Leon", motorisations: [e("1.5/2.0 TSI"), h("e-Hybrid")] },
      { name: "Formentor", motorisations: [e("1.5/2.0 TSI"), h("e-Hybrid")] },
      { name: "Born", motorisations: [ev("Born")] },
    ],
  },
  {
    name: "Alpine",
    models: [
      { name: "A110", motorisations: [e("1.8 Turbo")] },
    ],
  },
  {
    name: "MG",
    models: [
      { name: "ZS", motorisations: [e("1.5"), ev("ZS EV")] },
      { name: "HS", motorisations: [e("1.5 Turbo"), h("Plug-in Hybrid")] },
      { name: "MG4", motorisations: [ev("MG4 Electric")] },
      { name: "Marvel R", motorisations: [ev("Marvel R Electric")] },
    ],
  },
  { name: "Autre", models: [{ name: "Autre", motorisations: AUTRE_MOT }] },
];

export function modelsFor(brandName: string): string[] {
  return BRANDS.find((b) => b.name === brandName)?.models.map((m) => m.name) ?? [];
}

export function motorisationsFor(brandName: string, modelName: string): Motorisation[] {
  const model = BRANDS.find((b) => b.name === brandName)?.models.find((m) => m.name === modelName);
  return model?.motorisations ?? AUTRE_MOT;
}

/* Positionnement gamme par marque — les pièces premium/sport coûtent
   structurellement plus cher (huile plus haut de gamme et en plus grande
   quantité, pièces d'origine plus chères, standards constructeur plus
   exigeants). La main d'œuvre reste le tarif réel du garage (identique
   pour tous), seul le prix des PIÈCES est ajusté par ce multiplicateur.
   Classement volontairement large par marque (pas par finition/moteur —
   distinguer une RS3 d'une A3 de base demanderait une donnée qu'on n'a
   pas de façon fiable) ; à affiner avec le garage si besoin. */
export type VehicleTier = "eco" | "standard" | "premium" | "luxe";

const BRAND_TIER: Record<string, VehicleTier> = {
  Dacia: "eco",
  Peugeot: "standard", Renault: "standard", Citroën: "standard", Volkswagen: "standard",
  Ford: "standard", Opel: "standard", Fiat: "standard", Toyota: "standard", Nissan: "standard",
  Seat: "standard", Škoda: "standard", Hyundai: "standard", Kia: "standard", Mazda: "standard",
  Honda: "standard", Smart: "standard", Suzuki: "standard", MG: "standard",
  Audi: "premium", BMW: "premium", "Mercedes-Benz": "premium", Volvo: "premium", Mini: "premium",
  "DS Automobiles": "premium", "Alfa Romeo": "premium", Cupra: "premium", Alpine: "premium",
  Lexus: "premium", Jaguar: "premium", Subaru: "premium", Jeep: "premium", Tesla: "premium",
  Porsche: "luxe", "Land Rover": "luxe",
};

const TIER_MULTIPLIER: Record<VehicleTier, number> = { eco: 0.9, standard: 1, premium: 1.35, luxe: 1.7 };

export function tierMultiplierFor(brandName?: string): number {
  if (!brandName) return 1;
  const tier = BRAND_TIER[brandName];
  return tier ? TIER_MULTIPLIER[tier] : 1;
}
