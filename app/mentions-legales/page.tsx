import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "../site";

export const metadata: Metadata = {
  title: "Mentions légales & confidentialité — Garage D'Aumetz",
  description: "Mentions légales, conditions d'utilisation et politique de confidentialité (RGPD) du site Garage D'Aumetz.",
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <main className="section legal">
      <div className="wrap legal-wrap">
        <Link href="/" className="legal-back">← Retour au site</Link>
        <h1 className="display legal-title">Mentions légales &amp; confidentialité</h1>
        <p className="legal-updated">Dernière mise à jour : 15 septembre 2026</p>

        <section className="legal-section">
          <h2>1. Éditeur du site</h2>
          <p>
            {SITE.legalName} — SARL au capital de 100 €<br />
            {SITE.street}, {SITE.postalCode} {SITE.city}, {SITE.region}, France<br />
            Téléphone : {SITE.phone}<br />
            Email : {SITE.email}<br />
            SIRET : 104 346 754 00013<br />
            N° TVA intracommunautaire : FR31 104 346 754<br />
            Directeur de la publication : Nabil DEKIK, gérant
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Conception du site</h2>
          <p>
            Site conçu et développé par Netwanted.<br />
            Hébergement : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>).
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Données personnelles collectées</h2>
          <p>Ce site collecte des données personnelles uniquement dans le cadre des fonctionnalités suivantes :</p>
          <ul>
            <li><b>Demande de rappel</b> : nom, numéro de téléphone, besoin exprimé, message libre.</li>
            <li><b>Devis instantané envoyé au garage</b> : nom, téléphone, email (optionnel), problème décrit, et si vous utilisez la recherche par plaque d&apos;immatriculation : marque, modèle, motorisation, année, VIN et identifiants techniques du véhicule.</li>
          </ul>
          <p>
            La recherche par plaque d&apos;immatriculation interroge un service tiers (fournisseur de données SIV) qui retourne les caractéristiques techniques du véhicule associé à la plaque saisie. Cette plaque n&apos;est pas stockée par nos soins au-delà du traitement de votre demande.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Finalité et base légale</h2>
          <p>
            Ces données sont utilisées exclusivement pour traiter votre demande de devis ou de rappel, vous recontacter, et établir une estimation adaptée à votre véhicule. Le traitement repose sur l&apos;intérêt légitime du garage à répondre aux demandes de ses clients et prospects (article 6.1.f du RGPD).
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Destinataires des données</h2>
          <p>Vos données sont transmises aux seuls destinataires nécessaires au bon fonctionnement du service :</p>
          <ul>
            <li><b>{SITE.legalName}</b> — destinataire final de votre demande.</li>
            <li><b>Resend</b> (prestataire d&apos;envoi d&apos;email) — achemine l&apos;email contenant votre demande.</li>
            <li><b>Twilio</b> (prestataire SMS) — envoie une notification SMS au garage lors d&apos;un nouveau devis.</li>
            <li><b>Fournisseur de données SIV via RapidAPI</b> — uniquement si vous utilisez la recherche par plaque d&apos;immatriculation, pour identifier votre véhicule.</li>
          </ul>
          <p>Ces données ne sont jamais vendues ni utilisées à des fins publicitaires ou de prospection par des tiers.</p>
        </section>

        <section className="legal-section">
          <h2>6. Durée de conservation</h2>
          <p>
            Les données transmises via les formulaires sont conservées par le garage le temps nécessaire au traitement de votre demande et à la relation commerciale qui peut en découler, conformément aux durées légales applicables.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et d&apos;opposition sur vos données personnelles. Pour l&apos;exercer, contactez le garage par email à{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> ou par téléphone au {SITE.phone}.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Cookies et mesure d&apos;audience</h2>
          <p>
            Ce site utilise Vercel Analytics et Vercel Speed Insights, des outils de mesure d&apos;audience fonctionnant sans cookie de suivi individuel et ne collectant aucune donnée personnelle identifiable.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Estimations et devis</h2>
          <p>
            Les prix affichés via l&apos;outil de devis instantané sont des estimations indicatives calculées automatiquement à partir d&apos;une grille tarifaire et de fourchettes de prix pièces. Ils ne constituent pas un devis contractuel et sont systématiquement confirmés après diagnostic en atelier.
          </p>
        </section>
      </div>
    </main>
  );
}
