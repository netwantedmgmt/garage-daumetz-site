"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const VROOMLY_URL =
  "https://www.vroomly.com/garages/garage-daumetz-57710-scierie/";

function goVroomly() {
  window.open(VROOMLY_URL, "_blank", "noopener,noreferrer");
}

/* ---- GDA logo mark (car roofline + wordmark, red A). Swap for /public/logo.png later. ---- */
function Logo() {
  return (
    <div className="brand" aria-label="Garage D'Aumetz">
      <svg width="52" height="42" viewBox="0 0 52 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17 C 13 4, 30 3, 41 10 C 45 12, 48 15, 50 17" stroke="#141414" strokeWidth="2.6" strokeLinecap="round" />
        <text x="26" y="37" textAnchor="middle" fontFamily="var(--font-display)" fontSize="19" fontWeight="900" letterSpacing="0.5" fill="#141414">
          GD<tspan fill="#e11c24">A</tspan>
        </text>
      </svg>
      <div>
        <div className="brand-name">GARAGE D<span className="r">&apos;</span>AUMETZ</div>
        <div className="brand-sub">Mécanique &amp; entretien · Aumetz 57</div>
      </div>
    </div>
  );
}

const PRESTATIONS = [
  { ic: "🛢️", t: "Vidange & entretien", d: "Huile, filtres et contrôle complet des niveaux.", p: "dès 89 €" },
  { ic: "🛑", t: "Freinage", d: "Plaquettes, disques et purge du liquide de frein.", p: "dès 120 €" },
  { ic: "⚙️", t: "Distribution & embrayage", d: "Kit de distribution, pompe à eau, embrayage.", p: "dès 450 €" },
  { ic: "🔧", t: "Suspension & trains", d: "Amortisseurs, rotules, géométrie et parallélisme.", p: "dès 160 €" },
  { ic: "🩺", t: "Diagnostic électronique", d: "Lecture des défauts et recherche de panne.", p: "dès 55 €" },
  { ic: "❄️", t: "Climatisation", d: "Recharge, étanchéité, filtre d'habitacle.", p: "dès 79 €" },
  { ic: "🛞", t: "Pneumatiques", d: "Montage, équilibrage et permutation.", p: "dès 22 €/pneu" },
  { ic: "🔋", t: "Batterie & démarrage", d: "Batterie, alternateur, démarreur.", p: "dès 95 €" },
];

const STEPS = [
  { n: "1", t: "Décrivez votre besoin", d: "Choisissez vos prestations : entretien, panne, pneus… en quelques clics." },
  { n: "2", t: "Identifiez votre véhicule", d: "Votre plaque suffit — marque, modèle et motorisation sont retrouvés." },
  { n: "3", t: "Obtenez votre prix & réservez", d: "Devis clair immédiat, puis choisissez votre créneau en atelier." },
];

const WHY = [
  { t: "Garage certifié Vroomly", d: "Charte de confiance, prix respecté, engagement qualité." },
  { t: "Garantie 1 an", d: "Pièces et main d'œuvre garanties sur nos interventions." },
  { t: "Pièces d'origine ou équivalentes", d: "Des pièces de qualité, jamais du bas de gamme." },
  { t: "Prise en charge rapide", d: "Un atelier réactif, un accueil clair, pas de mauvaise surprise." },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
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

  const panels = [
    { cls: "p1", tag: "ENTRETIEN", ic: "🛢️" },
    { cls: "p2", tag: "DIAGNOSTIC", ic: "🩺" },
    { cls: "p3", tag: "FREINAGE", ic: "🛑" },
    { cls: "p4", tag: "PNEUS", ic: "🛞" },
  ];

  return (
    <>
      {/* HEADER */}
      <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <a href="#top"><Logo /></a>
          <nav className="hdr-nav">
            <a className="link" href="#comment">Comment ça marche</a>
            <a className="link" href="#prestations">Prestations</a>
            <a className="link" href="#contact">Contact</a>
            <button className="btn btn-red" onClick={goVroomly}>Devis &amp; RDV en ligne</button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}
            >
              <div className="hero-badge"><span className="pulse" /> Devis en ligne · <b>réponse sous 24 h</b></div>
              <h1 className="display">Votre voiture entre de bonnes mains, <span className="r">sans prise de tête.</span></h1>
              <p className="hero-sub">Choisissez votre prestation, obtenez un prix clair et réservez votre créneau en ligne. Garage indépendant, toutes marques, à Aumetz.</p>
              <div className="hero-cta">
                <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis en ligne <span className="btn-arrow">→</span></button>
                <a className="btn btn-ghost" href="#prestations">Voir les prestations</a>
              </div>
              <p className="hero-micro">Devis instantané et réservation en ligne · <b>via notre partenaire Vroomly</b></p>
              <div className="hero-trust">
                <span><span className="tick">✓</span> Devis clair &amp; rapide</span>
                <span><span className="tick">✓</span> Travail garanti 1 an</span>
                <span><span className="tick">✓</span> Sans engagement</span>
              </div>
            </motion.div>
          </div>

          <div className="panels">
            {panels.map((p, i) => (
              <motion.div
                key={p.cls}
                className={`panel ${p.cls}`}
                initial={reduce ? false : { scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.2, 0.7, 0.3, 1] }}
              >
                <span className="panel-tag">{p.tag}</span>
                <span className="panel-ic">{p.ic}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div className="marquee-item" key={k}>
              <span>Toutes marques</span><span>Pièces d&apos;origine</span><span>Garantie 1 an</span>
              <span>Diagnostic électronique</span><span>Vidange &amp; entretien</span><span>Freinage</span>
              <span>Pneumatiques</span><span>Climatisation</span>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT ÇA MARCHE */}
      <section className="section" id="comment">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow">Simple &amp; rapide</div></Reveal>
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
            <div style={{ textAlign: "center", marginTop: 44 }}>
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
            {PRESTATIONS.map((c, i) => (
              <Reveal key={c.t} delay={(i % 4) * 0.06}>
                <div className="card" onClick={goVroomly} role="button" tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goVroomly()}>
                  <div className="card-ic">{c.ic}</div>
                  <h4>{c.t}</h4>
                  <p>{c.d}</p>
                  <div className="card-foot">
                    <span className="card-from">{c.p}</span>
                    <span className="card-go">Réserver →</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="why">
              <div className="eyebrow">Pourquoi nous choisir</div>
              <h2>Un garage certifié, un travail garanti</h2>
              <p className="why-lead">Garage D&apos;Aumetz est un centre certifié : devis clair, prix respecté, travail garanti. Vous savez ce que vous payez, et pourquoi.</p>
              <div className="why-grid">
                {WHY.map((w) => (
                  <div className="why-item" key={w.t}>
                    <div className="why-check">✓</div>
                    <div><b>{w.t}</b><span>{w.d}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="section ctaband" style={{ paddingTop: 0 }}>
        <div className="wrap">
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
              <Logo />
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
