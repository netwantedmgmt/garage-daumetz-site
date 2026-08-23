"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PRESTA_ICONS, IconCheck, IconStar } from "./icons";

const VROOMLY_URL =
  "https://www.vroomly.com/garages/garage-daumetz-57710-scierie/";

function goVroomly() {
  window.open(VROOMLY_URL, "_blank", "noopener,noreferrer");
}

/* Header logo (PNG on white) */
function LogoImg() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="Garage D'Aumetz" style={{ height: 62, width: "auto" }} />;
}

/* Footer wordmark (for dark background) */
function LogoText() {
  return (
    <div className="brand">
      <div>
        <div className="brand-name">GARAGE D<span className="r">&apos;</span>AUMETZ</div>
        <div className="brand-sub">Mécanique &amp; entretien · Aumetz 57</div>
      </div>
    </div>
  );
}

const PRESTATIONS = [
  { ic: "vidange", t: "Vidange & entretien", d: "Huile, filtres et contrôle complet des niveaux.", p: "dès 89 €" },
  { ic: "frein", t: "Freinage", d: "Plaquettes, disques et purge du liquide de frein.", p: "dès 120 €" },
  { ic: "distribution", t: "Distribution", d: "Kit de distribution, pompe à eau, embrayage.", p: "dès 450 €" },
  { ic: "suspension", t: "Suspension", d: "Amortisseurs, rotules, géométrie, parallélisme.", p: "dès 160 €" },
  { ic: "diagnostic", t: "Diagnostic", d: "Lecture des défauts et recherche de panne.", p: "dès 55 €" },
  { ic: "clim", t: "Climatisation", d: "Recharge, étanchéité, filtre d'habitacle.", p: "dès 79 €" },
  { ic: "pneu", t: "Pneumatiques", d: "Montage, équilibrage et permutation.", p: "dès 22 €/pneu" },
  { ic: "batterie", t: "Batterie", d: "Batterie, alternateur, démarreur.", p: "dès 95 €" },
] as const;

const STEPS = [
  { n: "1", t: "Décrivez votre besoin", d: "Choisissez vos prestations : entretien, panne, pneus… en quelques clics." },
  { n: "2", t: "Identifiez la voiture", d: "Votre plaque suffit — marque, modèle et motorisation sont retrouvés." },
  { n: "3", t: "Prix & créneau", d: "Devis clair immédiat, puis choisissez votre créneau en atelier." },
];

const WHY = [
  { t: "Garage certifié Vroomly", d: "Charte de confiance, prix respecté, engagement qualité." },
  { t: "Garantie 1 an", d: "Pièces et main d'œuvre garanties sur nos interventions." },
  { t: "Pièces de qualité", d: "Pièces d'origine ou équivalentes, jamais du bas de gamme." },
  { t: "Prise en charge rapide", d: "Un atelier réactif, un accueil clair, pas de surprise." },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <a href="#top" aria-label="Garage D'Aumetz"><LogoImg /></a>
          <nav className="hdr-nav">
            <a className="link" href="#comment">Comment ça marche</a>
            <a className="link" href="#prestations">Prestations</a>
            <a className="link" href="#avis">Avis</a>
            <a className="link" href="#contact">Contact</a>
            <button className="btn btn-outline-red" onClick={goVroomly}>Devis &amp; RDV</button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <div className="eyebrow">Garage indépendant · Aumetz 57</div>
            <h1 className="display" style={{ marginTop: 18 }}>
              Votre voiture<br />entre de <span className="r">bonnes mains</span>
            </h1>
            <p className="hero-sub">Choisissez votre prestation, obtenez un prix clair et réservez votre créneau en ligne. Toutes marques, travail garanti.</p>
            <div className="hero-cta">
              <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis <span className="btn-arrow">→</span></button>
              <a className="btn btn-outline" href="#prestations">Nos prestations</a>
            </div>
            <p className="hero-micro">Devis instantané et réservation en ligne · <b>via notre partenaire Vroomly</b></p>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.2, 0.7, 0.3, 1] }}
          >
            {/* Remplacez le bloc .hero-photo par une vraie photo de l'atelier */}
            <div className="hero-photo">
              <span className="hero-photo-tag">Atelier · Aumetz</span>
              <div className="hero-panel">
                <b>Prise en charge rapide</b>
                <span>Un devis clair, un travail garanti 1 an. Vous savez ce que vous payez.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div className="marquee-item" key={k}>
              <span>Toutes marques</span><span>Pièces d&apos;origine</span><span>Garantie 1 an</span>
              <span>Diagnostic</span><span>Vidange</span><span>Freinage</span>
              <span>Pneumatiques</span><span>Climatisation</span>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <section className="section" id="comment">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow center">Simple &amp; rapide</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Votre devis en trois étapes</h2></Reveal>
            <Reveal delay={0.1}><p>Tout se fait en ligne, en quelques minutes. Votre plaque suffit pour identifier la voiture.</p></Reveal>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="step">
                  <div className="step-n">{s.n}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div style={{ textAlign: "center", marginTop: 46 }}>
              <button className="btn btn-red" onClick={goVroomly}>Réserver mon créneau <span className="btn-arrow">→</span></button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section className="section" id="prestations" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <Reveal><div className="eyebrow">Nos prestations</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Ce qu&apos;on prend en charge</h2></Reveal>
            <Reveal delay={0.1}><p>Toutes marques, pièces d&apos;origine ou équivalentes, tarifs de garage indépendant.</p></Reveal>
          </div>
          <div className="presta">
            {PRESTATIONS.map((c, i) => {
              const Ic = PRESTA_ICONS[c.ic];
              return (
              <Reveal key={c.t} delay={(i % 4) * 0.06}>
                <div className="card" onClick={goVroomly} role="button" tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goVroomly()}>
                  <div className="card-ic"><Ic /></div>
                  <h4>{c.t}</h4>
                  <p>{c.d}</p>
                  <div className="card-foot">
                    <span className="card-from tnum">{c.p}</span>
                    <span className="card-go">Réserver →</span>
                  </div>
                </div>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERTISE (dark band) */}
      <section className="expertise section">
        <div className="wrap exp-grid">
          <Reveal className="exp-left">
            <div className="eyebrow">Pourquoi nous choisir</div>
            <h2>On a fait de la mécanique un métier de confiance</h2>
            <p>Garage indépendant certifié : devis clair, prix respecté, travail garanti. Vous savez ce que vous payez, et pourquoi.</p>
            <div className="exp-stats">
              <div className="exp-stat"><b className="tnum">10+</b><span>ans d&apos;expérience</span></div>
              <div className="exp-stat"><b className="tnum">3</b><span>mécaniciens</span></div>
              <div className="exp-stat"><b>Toutes</b><span>marques</span></div>
            </div>
          </Reveal>
          <div className="exp-right">
            {WHY.map((w, i) => (
              <Reveal key={w.t} delay={i * 0.08}>
                <div className="exp-item">
                  <div className="exp-check"><IconCheck /></div>
                  <div><b>{w.t}</b><span>{w.d}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section reviews" id="avis">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow center">Avis clients</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Ils nous ont fait confiance</h2></Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="review-card">
              {/* Remplacez par une photo réelle d'intervention */}
              <div className="review-photo" />
              <div className="review-body">
                <div className="review-stars">
                  {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={19} height={19} />)}
                </div>
                <p className="review-quote">&laquo; Travail impeccable et devis respecté à l&apos;euro près. Accueil au top, on m&apos;a tout expliqué clairement. Je recommande sans hésiter. &raquo;</p>
                <div className="review-who">Client vérifié</div>
                <div className="review-meta">Entretien &amp; freinage · Avis Google</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="section ctaband">
        <div className="wrap inner">
          <Reveal><h2 className="display">Prêt à passer à l&apos;atelier ?</h2></Reveal>
          <Reveal delay={0.05}><p>Obtenez votre devis et réservez votre créneau en ligne, en moins de deux minutes.</p></Reveal>
          <Reveal delay={0.1}>
            <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis en ligne <span className="btn-arrow">→</span></button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot" id="contact">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <LogoText />
              <p className="foot-lead">Votre garage automobile indépendant à Aumetz, en Moselle. Toutes marques.</p>
            </div>
            <div className="foot-col">
              <h5>Coordonnées</h5>
              <p>6 rue de l&apos;ancienne scierie<br />57710 Aumetz</p>
              <a href="tel:+33382872650">03 82 87 26 50</a>
              <a href="mailto:garagedaumetz@gmail.com">garagedaumetz@gmail.com</a>
            </div>
            <div className="foot-col">
              <h5>Horaires</h5>
              <p>Lun – Ven : 8h30-12h / 14h-18h</p>
              <p>Samedi : 9h-12h</p>
              <p>Dimanche : fermé</p>
            </div>
            <div className="foot-col">
              <h5>Devis en ligne</h5>
              <a href={VROOMLY_URL} target="_blank" rel="noopener noreferrer">Faire mon devis</a>
              <a href="#comment">Comment ça marche</a>
              <a href="#prestations">Prestations</a>
            </div>
          </div>
          <div className="foot-legal">
            <span>© 2026 Garage D&apos;Aumetz — Aumetz (57710), Moselle.</span>
            <span>Site conçu par Netwanted</span>
          </div>
        </div>
      </footer>
    </>
  );
}
