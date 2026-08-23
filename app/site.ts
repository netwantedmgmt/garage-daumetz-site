/* Constantes métier partagées (page + layout/SEO). */

export const SITE = {
  name: "Garage D'Aumetz",
  legalName: "Garage D'Aumetz",
  phone: "03 82 87 26 50",
  phoneTel: "+33382872650",
  email: "garagedaumetz@gmail.com",
  street: "6 rue de l'ancienne scierie",
  postalCode: "57710",
  city: "Aumetz",
  region: "Moselle",
  country: "FR",
  lat: 49.4211,
  lng: 5.9403,
  // ⚠️ À remplacer par le vrai domaine une fois branché sur Vercel
  url: "https://garage-daumetz.fr",
  vroomly: "https://www.vroomly.com/garages/garage-daumetz-57710-scierie/",
  // ⚠️ À remplacer par le lien de la fiche Google Business réelle (avis + itinéraire)
  googleReviews:
    "https://www.google.com/maps/search/?api=1&query=Garage%20D'Aumetz%20Aumetz%2057710",
  mapsEmbed:
    "https://www.google.com/maps?q=6%20rue%20de%20l'ancienne%20scierie%2057710%20Aumetz&output=embed",
  mapsDir:
    "https://www.google.com/maps/dir/?api=1&destination=6%20rue%20de%20l'ancienne%20scierie%2057710%20Aumetz",
} as const;

/* Horaires : minutes depuis minuit, index jour 0=dimanche … 6=samedi */
export const HOURS: Record<number, [number, number][]> = {
  1: [[510, 720], [840, 1080]],
  2: [[510, 720], [840, 1080]],
  3: [[510, 720], [840, 1080]],
  4: [[510, 720], [840, 1080]],
  5: [[510, 720], [840, 1080]],
  6: [[540, 720]],
  0: [],
};

/* Note Google réelle (fiche Google Business — à actualiser périodiquement) */
export const RATING = { value: 5, count: 29 } as const;

/* Avis Google réels (extraits de la fiche, légèrement nettoyés des troncatures). */
export const REVIEWS = [
  {
    name: "Issam Hadj Hamou",
    tag: "Embrayage · Dépannage",
    text: "Merci de nous avoir sauvé nos vacances. Embrayage cassé 2 jours avant le départ, ils nous ont pris directement. Le lendemain la pièce était déjà là et le soir la voiture était prête à rouler. Merci pour votre professionnalisme.",
  },
  {
    name: "Thomas Masson",
    tag: "Pneumatiques · Dépannage",
    text: "Très bon accueil et un très grand merci pour le dépannage suite au pneu totalement déchiré que l'on m'a remplacé le jour même.",
  },
  {
    name: "Bilal Haboudane",
    tag: "Vidange & freinage",
    text: "Vidange complète, disques et plaquettes à l'avant sur ma Golf 7. Prix abordable et équipe au top !",
  },
  {
    name: "Sebastien Pierrat",
    tag: "Dépannage express",
    text: "Super garage, dépannage express sans rdv : juste téléphoné et ils m'ont accepté de suite. Très serviable, je recommande vraiment, merci pour votre réactivité.",
  },
  {
    name: "Christine Descharles",
    tag: "Réparation",
    text: "Ma voiture leur a donné du fil à retordre, ils se sont donné énormément de mal pour la réparer, que je puisse aller travailler. Super gentils, ils font vraiment leur max. Je reviendrai, c'est sûr.",
  },
  {
    name: "Hugo Plé",
    tag: "Parallélisme",
    text: "Parallélisme nickel, nettoyage impeccable et tarif plus que raisonnable.",
  },
] as const;

export const FAQ = [
  {
    q: "Intervenez-vous sur toutes les marques ?",
    a: "Oui. Nous entretenons et réparons toutes les marques — essence, diesel et hybride — avec des pièces d'origine ou équivalentes, jamais du bas de gamme.",
  },
  {
    q: "Comment obtenir un prix ?",
    a: "En 2 minutes en ligne : indiquez votre plaque et votre besoin, le prix clair s'affiche immédiatement. Vous pouvez aussi nous appeler au 03 82 87 26 50.",
  },
  {
    q: "Vos réparations sont-elles garanties ?",
    a: "Oui. Les pièces et la main d'œuvre sont garanties 1 an sur l'ensemble de nos interventions.",
  },
  {
    q: "Faut-il prendre rendez-vous ?",
    a: "C'est préférable pour être pris en charge rapidement. Réservez votre créneau en ligne ou appelez-nous directement.",
  },
  {
    q: "Où se trouve le garage ?",
    a: "6 rue de l'ancienne scierie, 57710 Aumetz, en Moselle. Un parking est disponible sur place.",
  },
  {
    q: "Proposez-vous un diagnostic électronique ?",
    a: "Oui, diagnostic dès 55 €, avec lecture des défauts et devis clair avant toute intervention.",
  },
] as const;
