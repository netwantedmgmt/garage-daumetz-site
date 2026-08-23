"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView, useScroll, useSpring } from "framer-motion";
import {
  PRESTA_ICONS,
  IconCheck,
  IconStar,
  IconGoogle,
  IconShield,
  IconClock,
  IconPin,
  IconPhone,
  IconQuote,
} from "./icons";

const VROOMLY_URL =
  "https://www.vroomly.com/garages/garage-daumetz-57710-scierie/";

function goVroomly() {
  window.open(VROOMLY_URL, "_blank", "noopener,noreferrer");
}

/* Header logo (monogramme GDA, fond transparent) */
function LogoImg() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/nav-logo.png" alt="Garage D'Aumetz" style={{ height: 44, width: "auto" }} />;
}

function LogoText() {
  return (
    <div className="brand">
      <div className="brand-name">GARAGE D<span className="r">&apos;</span>AUMETZ</div>
      <div className="brand-sub">Mécanique &amp; entretien · Aumetz 57</div>
    </div>
  );
}

/* Écran d'attente affiché à la première visite */
function Splash() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem("gda_visited") === "1"; } catch {}
    if (seen) return;
    setShow(true);
    try { localStorage.setItem("gda_visited", "1"); } catch {}
    const t1 = setTimeout(() => setLeaving(true), reduce ? 500 : 1700);
    const t2 = setTimeout(() => setShow(false), reduce ? 750 : 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduce]);

  if (!show) return null;
  return (
    <div
      className={`splash ${leaving ? "splash-out" : ""}`}
      aria-hidden
      onClick={() => { setLeaving(true); setTimeout(() => setShow(false), 550); }}
    >
      <div className="splash-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/full-logo.png" alt="Garage D'Aumetz" className="splash-logo" />
        <div className="splash-bar"><span /></div>
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

const PACKS = [
  {
    price: "dès 89 €",
    name: "Entretien & vidange",
    d: "L'essentiel pour garder votre voiture en pleine forme.",
    lines: ["Vidange huile + filtre", "Contrôle des niveaux", "Point sécurité complet"],
    featured: false,
  },
  {
    price: "dès 120 €",
    name: "Freinage",
    d: "Un freinage sûr, contrôlé et garanti 1 an.",
    lines: ["Plaquettes & disques", "Purge liquide de frein", "Contrôle de l'usure"],
    featured: true,
  },
  {
    price: "dès 55 €",
    name: "Diagnostic",
    d: "On identifie la panne avant de toucher à quoi que ce soit.",
    lines: ["Lecture des défauts", "Recherche de panne", "Devis clair immédiat"],
    featured: false,
  },
] as const;

const WHY = [
  { t: "Garantie 1 an", d: "Pièces et main d'œuvre garanties sur nos interventions." },
  { t: "Pièces de qualité", d: "Pièces d'origine ou équivalentes, jamais du bas de gamme." },
];

/* Avis clients — attribution générique « vérifié », à remplacer par de vrais avis Google. */
const REVIEWS = [
  {
    q: "Travail impeccable et devis respecté à l'euro près. Accueil au top, on m'a tout expliqué clairement. Je recommande sans hésiter.",
    who: "Client vérifié",
    meta: "Entretien & freinage",
  },
  {
    q: "Panne prise en charge le jour même, diagnostic clair et prix honnête. Ça change des grandes enseignes, on se sent en confiance.",
    who: "Client vérifié",
    meta: "Diagnostic & réparation",
  },
  {
    q: "Vidange et distribution faites nickel, rendez-vous facile à réserver en ligne. Un garage indépendant sérieux comme on en trouve peu.",
    who: "Client vérifié",
    meta: "Vidange & distribution",
  },
] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className="tnum">
      {Math.round(val)}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Splash />
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden />

      {/* HEADER */}
      <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <a href="#top" aria-label="Garage D'Aumetz"><LogoImg /></a>
          <nav className="hdr-nav">
            <a className="link" href="#prestations">Prestations</a>
            <a className="link" href="#tarifs">Tarifs</a>
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
            className="hero-copy"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <div className="eyebrow">Garage indépendant · Aumetz (57)</div>
            <h1 className="display">
              Votre voiture entre de <span className="r">bonnes mains</span>
            </h1>
            <p className="hero-sub">
              Choisissez votre prestation, obtenez un prix clair et réservez votre créneau en
              ligne. Toutes marques, travail garanti&nbsp;1&nbsp;an.
            </p>
            <div className="hero-cta">
              <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis <span className="btn-arrow">→</span></button>
              <a className="btn btn-outline" href="#prestations">Nos prestations</a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-stars" aria-hidden>
                {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={15} height={15} />)}
              </span>
              <span><b>Avis vérifiés</b> · Garage certifié Vroomly</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-media"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <span className="accent-block" aria-hidden />
            <div className="hero-media-frame">
              {/* Photo d'illustration — à remplacer par une vraie photo de l'atelier GDA */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/hero.jpg" alt="Mécanicien intervenant sur une voiture dans l'atelier" />
              <span className="media-badge" aria-hidden>Atelier · Aumetz</span>
            </div>
            <div className="hero-media-panel">
              <h3>Mécanique de confiance</h3>
              <p>Devis clair, prix respecté, travail garanti&nbsp;1&nbsp;an. Vous savez ce que vous payez.</p>
              <a className="panel-link" href="#prestations">Nos prestations <span>→</span></a>
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

      {/* ABOUT / BELIEF */}
      <section className="section about">
        <div className="wrap about-grid">
          <div className="about-media">
            <span className="accent-block accent-block-left" aria-hidden />
            <div className="about-media-frame about-media-big">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/engine.jpg" alt="Intervention mécanique sur un moteur" />
            </div>
            <div className="about-media-frame about-media-small">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/wheel.jpg" alt="Montage et équilibrage de pneumatiques" />
            </div>
          </div>
          <Reveal className="about-copy">
            <div className="eyebrow">À propos</div>
            <h2 className="display">On a fait de la mécanique un métier de confiance</h2>
            <p>
              Garage indépendant certifié : devis clair, prix respecté, travail garanti. Vous
              savez ce que vous payez, et pourquoi. Toutes marques, pièces d&apos;origine ou
              équivalentes, jamais du bas de gamme.
            </p>
            <div className="about-stats">
              <div className="stat"><b><CountUp to={10} suffix="+" /></b><span>ans d&apos;expérience</span></div>
              <div className="stat"><b><CountUp to={3} /></b><span>mécaniciens</span></div>
              <div className="stat"><b>Toutes</b><span>marques</span></div>
            </div>
            <button className="btn btn-dark" onClick={goVroomly}>Prendre rendez-vous <span className="btn-arrow">→</span></button>
          </Reveal>
        </div>
      </section>

      {/* PRESTATIONS */}
      <section className="section prestations" id="prestations">
        <div className="wrap">
          <div className="section-head">
            <div className="head-left">
              <Reveal><div className="eyebrow">Nos prestations</div></Reveal>
              <Reveal delay={0.05}><h2 className="display">Ce qu&apos;on prend en charge</h2></Reveal>
            </div>
            <Reveal delay={0.1} className="head-right">
              <p>Toutes marques, pièces d&apos;origine ou équivalentes, tarifs de garage indépendant.</p>
              <button className="btn btn-outline" onClick={goVroomly}>Voir tout <span className="btn-arrow">→</span></button>
            </Reveal>
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
      <section className="section expertise">
        <div className="wrap exp-grid">
          <Reveal className="exp-media">
            <span className="accent-block" aria-hidden />
            <div className="exp-media-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/dark.jpg" alt="Voiture sur le pont de l'atelier" />
            </div>
            <div className="exp-stat-chip">
              <b className="tnum"><CountUp to={10} suffix="+" /></b>
              <span>ans d&apos;expérience</span>
            </div>
          </Reveal>
          <Reveal className="exp-copy" delay={0.1}>
            <div className="eyebrow">Pourquoi nous choisir</div>
            <h2 className="display">On maîtrise l&apos;art de la mécanique</h2>
            <p>
              Des années passées sous le capot : on met la même précision et le même soin sur
              chaque voiture qui entre à l&apos;atelier. Pas de surprise, pas de superflu.
            </p>
            <div className="exp-list">
              {WHY.map((w) => (
                <div className="exp-item" key={w.t}>
                  <div className="exp-check"><IconCheck /></div>
                  <div><b>{w.t}</b><span>{w.d}</span></div>
                </div>
              ))}
            </div>
            <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis <span className="btn-arrow">→</span></button>
          </Reveal>
        </div>
      </section>

      {/* TARIFS */}
      <section className="section tarifs" id="tarifs">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow center">Tarifs</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Des prix clairs, sans surprise</h2></Reveal>
            <Reveal delay={0.1}><p>Nos interventions les plus demandées. Le prix exact est confirmé après identification de votre voiture — via Vroomly, en ligne.</p></Reveal>
          </div>
          <div className="packs">
            {PACKS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className={`pack ${p.featured ? "pack-featured" : ""}`}>
                  {p.featured && <span className="pack-tag">Le plus demandé</span>}
                  <div className="pack-price tnum">{p.price}</div>
                  <h3>{p.name}</h3>
                  <p>{p.d}</p>
                  <ul className="pack-list">
                    {p.lines.map((l) => (
                      <li key={l}><span className="pack-check"><IconCheck width={13} height={13} /></span>{l}</li>
                    ))}
                  </ul>
                  <button className={`btn ${p.featured ? "btn-light" : "btn-dark"}`} onClick={goVroomly}>
                    Réserver <span className="btn-arrow">→</span>
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section className="section reviews" id="avis">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow center">Avis clients</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Ils nous ont fait confiance</h2></Reveal>
            <Reveal delay={0.1}>
              {/* Badge d'agrégat — brancher la vraie note / le lien Google Business ici */}
              <div className="rating-badge">
                <IconGoogle />
                <span className="rating-stars" aria-hidden>
                  {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={17} height={17} />)}
                </span>
                <span className="rating-label">Avis clients vérifiés sur Google</span>
              </div>
            </Reveal>
          </div>
          <div className="review-grid">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.meta} delay={i * 0.08}>
                <div className="review-card">
                  <span className="review-quote-ic" aria-hidden><IconQuote /></span>
                  <div className="review-stars" aria-hidden>
                    {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={16} height={16} />)}
                  </div>
                  <p className="review-quote">{r.q}</p>
                  <div className="review-foot">
                    <div className="review-avatar" aria-hidden>{r.who.charAt(0)}</div>
                    <div>
                      <div className="review-who">{r.who}</div>
                      <div className="review-meta">{r.meta} · Avis Google</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING / VROOMLY */}
      <section className="section booking" id="contact">
        <div className="wrap booking-grid">
          <Reveal className="booking-copy">
            <div className="eyebrow">Rendez-vous</div>
            <h2 className="display">Réservez en ligne en 2 minutes</h2>
            <p>
              Décrivez votre besoin, identifiez votre voiture avec la plaque, obtenez un prix clair
              et choisissez votre créneau. Tout se fait en ligne via notre partenaire Vroomly.
            </p>
            <div className="booking-cta">
              <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis <span className="btn-arrow">→</span></button>
              <a className="btn btn-outline" href="tel:+33382872650">
                <IconPhone width={17} height={17} /> 03 82 87 26 50
              </a>
            </div>
            <div className="booking-info">
              <div className="binfo"><span className="binfo-ic"><IconPin width={17} height={17} /></span><div><b>Adresse</b><span>6 rue de l&apos;ancienne scierie, 57710 Aumetz</span></div></div>
              <div className="binfo"><span className="binfo-ic"><IconClock width={17} height={17} /></span><div><b>Horaires</b><span>Lun–Ven 8h30-12h / 14h-18h · Sam 9h-12h</span></div></div>
            </div>
          </Reveal>
          <motion.div
            className="booking-media"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <span className="accent-block" aria-hidden />
            <div className="booking-media-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos/service.jpg" alt="Intervention sur une voiture au garage" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="ctaband">
        <div className="wrap inner">
          <Reveal><h2 className="display">Prêt à passer à l&apos;atelier&nbsp;?</h2></Reveal>
          <Reveal delay={0.05}><p>Obtenez votre devis et réservez votre créneau en ligne, en moins de deux minutes.</p></Reveal>
          <Reveal delay={0.1}>
            <button className="btn btn-red" onClick={goVroomly}>Obtenir mon devis en ligne <span className="btn-arrow">→</span></button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div>
              <LogoText />
              <p className="foot-lead">Votre garage automobile indépendant à Aumetz, en Moselle. Toutes marques.</p>
            </div>
            <div className="foot-col">
              <h5>Coordonnées</h5>
              <p className="foot-line"><IconPin width={16} height={16} /><span>6 rue de l&apos;ancienne scierie<br />57710 Aumetz</span></p>
              <a className="foot-line" href="tel:+33382872650"><IconPhone width={16} height={16} /><span>03 82 87 26 50</span></a>
              <a className="foot-line" href="mailto:garagedaumetz@gmail.com"><span className="foot-at">@</span><span>garagedaumetz@gmail.com</span></a>
            </div>
            <div className="foot-col">
              <h5>Horaires</h5>
              <p className="foot-line"><IconClock width={16} height={16} /><span>Lun – Ven : 8h30-12h / 14h-18h</span></p>
              <p className="foot-line foot-line-indent">Samedi : 9h-12h</p>
              <p className="foot-line foot-line-indent">Dimanche : fermé</p>
            </div>
            <div className="foot-col">
              <h5>Devis en ligne</h5>
              <a href={VROOMLY_URL} target="_blank" rel="noopener noreferrer">Faire mon devis</a>
              <a href="#prestations">Prestations</a>
              <a href="#tarifs">Tarifs</a>
              <a href="#avis">Avis</a>
            </div>
          </div>
          <div className="foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/full-logo-light.png" alt="Garage D'Aumetz" />
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
