"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { SITE, HOURS, FAQ, RATING, REVIEWS } from "./site";
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

function trackEvent(name: string, props?: Record<string, string>) {
  try { track(name, props); } catch { /* no-op hors Vercel */ }
}

function goVroomly(src = "unknown") {
  trackEvent("vroomly_click", { src });
  window.open(SITE.vroomly, "_blank", "noopener,noreferrer");
}

function onCall(src = "unknown") {
  trackEvent("call_click", { src });
}

/* Header logo (monogramme GDA, fond transparent) */
function LogoImg() {
  return <Image src="/nav-logo.png" alt="Garage D'Aumetz" width={99} height={44} priority className="nav-logo" />;
}

function LogoText() {
  return (
    <div className="brand">
      <div className="brand-name">GARAGE D<span className="r">&apos;</span>AUMETZ</div>
      <div className="brand-sub">Mécanique &amp; entretien · Aumetz 57</div>
    </div>
  );
}

/* Reveal accessible : visible par défaut (sans JS / robots), animé si JS présent */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let done = false;
    const run = () => {
      if (done) return; done = true;
      if (reduce) { setVal(to); return; }
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setVal(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick); else setVal(to);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { run(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="tnum">{Math.round(val)}{suffix}</span>;
}

/* Statut ouvert/fermé calculé en direct */
function OpenStatus({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const today = HOURS[now.getDay()] || [];
    let open = false; let until = 0;
    for (const [s, e] of today) { if (mins >= s && mins < e) { open = true; until = e; } }
    if (open) {
      const h = Math.floor(until / 60); const m = until % 60;
      setState({ open: true, label: `Ouvert · ferme à ${h}h${m ? String(m).padStart(2, "0") : "00"}` });
    } else {
      setState({ open: false, label: "Fermé actuellement" });
    }
  }, []);
  if (!state) return null;
  return (
    <span className={`status ${state.open ? "status-open" : "status-closed"} ${className}`}>
      <i aria-hidden />{state.label}
    </span>
  );
}

/* Écran d'attente — première visite uniquement, court */
function Splash() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem("gda_visited") === "1"; } catch {}
    if (seen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShow(true);
    try { localStorage.setItem("gda_visited", "1"); } catch {}
    const t1 = setTimeout(() => setLeaving(true), reduce ? 300 : 900);
    const t2 = setTimeout(() => setShow(false), reduce ? 500 : 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (!show) return null;
  return (
    <div
      className={`splash ${leaving ? "splash-out" : ""}`}
      aria-hidden
      onClick={() => { setLeaving(true); setTimeout(() => setShow(false), 450); }}
    >
      <div className="splash-inner">
        <Image src="/full-logo.png" alt="Garage D'Aumetz" width={300} height={140} priority className="splash-logo" />
        <div className="splash-bar"><span /></div>
      </div>
    </div>
  );
}

/* Barre d'action collante — mobile uniquement (levier n°1 : l'appel) */
function StickyBar() {
  return (
    <div className="sticky-bar">
      <a className="sticky-btn sticky-call" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("sticky")}>
        <IconPhone width={19} height={19} /> Appeler
      </a>
      <button className="sticky-btn sticky-rdv" onClick={() => goVroomly("sticky")}>
        Devis &amp; RDV <span aria-hidden>→</span>
      </button>
    </div>
  );
}

/* Carte « click-to-load » : l'iframe Google (donc les cookies) ne se charge
   qu'au clic de l'utilisateur = consentement RGPD. Aucun cookie par défaut. */
function LocationMap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map-frame">
      {loaded ? (
        <iframe
          src={SITE.mapsEmbed}
          title="Localisation du Garage D'Aumetz à Aumetz (57710)"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button className="map-consent" onClick={() => { setLoaded(true); trackEvent("map_load"); }}>
          <span className="map-grid" aria-hidden />
          <span className="map-pin"><IconPin width={22} height={22} /></span>
          <b>{SITE.street}</b>
          <span className="map-city">{SITE.postalCode} {SITE.city} · Moselle</span>
          <span className="map-cta">Afficher la carte</span>
          <span className="map-note">Chargement de Google Maps au clic (aucun cookie avant)</span>
        </button>
      )}
    </div>
  );
}

/* Formulaire de rappel — capture de lead en direct (endpoint /api/contact). */
function CallbackForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err" | "unconfigured">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot
    setState("sending");
    trackEvent("callback_submit", { need: String(fd.get("need") || "") });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"), phone: fd.get("phone"),
          need: fd.get("need"), message: fd.get("message"), company: fd.get("company"),
        }),
      });
      if (res.ok) { setState("ok"); form.reset(); }
      else if (res.status === 503) setState("unconfigured");
      else setState("err");
    } catch { setState("err"); }
  }

  if (state === "ok") {
    return (
      <div className="form-success" role="status">
        <span className="form-success-ic"><IconCheck width={24} height={24} /></span>
        <b>Merci, c&apos;est noté !</b>
        <span>On vous rappelle au plus vite. Pour une urgence, appelez le {SITE.phone}.</span>
      </div>
    );
  }

  return (
    <form className="callback" onSubmit={onSubmit} noValidate>
      <div className="callback-row">
        <label className="field">
          <span>Nom *</span>
          <input name="name" type="text" required autoComplete="name" placeholder="Votre nom" />
        </label>
        <label className="field">
          <span>Téléphone *</span>
          <input name="phone" type="tel" required autoComplete="tel" placeholder="06 12 34 56 78" />
        </label>
      </div>
      <label className="field">
        <span>Besoin</span>
        <select name="need" defaultValue="">
          <option value="" disabled>Choisir…</option>
          <option>Entretien / Vidange</option>
          <option>Freinage</option>
          <option>Distribution</option>
          <option>Diagnostic / Panne</option>
          <option>Pneumatiques</option>
          <option>Climatisation</option>
          <option>Autre</option>
        </select>
      </label>
      <label className="field">
        <span>Message (optionnel)</span>
        <textarea name="message" rows={2} placeholder="Marque, modèle, précisions…" />
      </label>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <button className="btn btn-red callback-submit" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Envoi…" : <>Être rappelé <span className="btn-arrow">→</span></>}
      </button>
      {state === "err" && <p className="form-msg form-err">Une erreur est survenue. Appelez-nous au {SITE.phone}.</p>}
      {state === "unconfigured" && <p className="form-msg form-err">Formulaire bientôt actif. En attendant, appelez le {SITE.phone} ou faites votre devis en ligne.</p>}
      <p className="callback-legal">Vos coordonnées servent uniquement à vous recontacter. Aucun spam.</p>
    </form>
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
    price: "dès 89 €", name: "Entretien & vidange",
    d: "L'essentiel pour garder votre voiture en pleine forme.",
    lines: ["Vidange huile + filtre", "Contrôle des niveaux", "Point sécurité complet"],
    featured: false,
  },
  {
    price: "dès 120 €", name: "Freinage",
    d: "Un freinage sûr, contrôlé et garanti 1 an.",
    lines: ["Plaquettes & disques", "Purge liquide de frein", "Contrôle de l'usure"],
    featured: true,
  },
  {
    price: "dès 55 €", name: "Diagnostic",
    d: "On identifie la panne avant de toucher à quoi que ce soit.",
    lines: ["Lecture des défauts", "Recherche de panne", "Devis clair immédiat"],
    featured: false,
  },
] as const;

const WHY = [
  { t: "Garantie 1 an", d: "Pièces et main d'œuvre garanties sur nos interventions." },
  { t: "Pièces de qualité", d: "Pièces d'origine ou équivalentes, jamais du bas de gamme." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("js");
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Splash />
      <div className="scroll-progress" ref={progressRef} aria-hidden />

      {/* HEADER */}
      <header className={`hdr ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <a href="#top" aria-label="Garage D'Aumetz"><LogoImg /></a>
          <nav className="hdr-nav">
            <a className="link" href="#prestations">Prestations</a>
            <a className="link" href="#tarifs">Tarifs</a>
            <a className="link" href="#avis">Avis</a>
            <a className="link" href="#faq">FAQ</a>
            <a className="link hdr-tel" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("header")}>
              <IconPhone width={16} height={16} /> {SITE.phone}
            </a>
            <button className="btn btn-red btn-sm" onClick={() => goVroomly("header")}>Devis &amp; RDV</button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Garage indépendant · Aumetz (57)</div>
            <h1 className="display">
              Votre voiture entre de <span className="r">bonnes mains</span>
            </h1>
            <p className="hero-sub">
              Devis clair en 2 minutes, prix respecté à l&apos;euro près, travail garanti 1 an.
              Toutes marques — entretien, freinage, distribution, diagnostic.
            </p>
            <div className="hero-cta">
              <button className="btn btn-red" onClick={() => goVroomly("hero")}>Obtenir mon devis <span className="btn-arrow">→</span></button>
              <a className="btn btn-outline" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("hero")}>
                <IconPhone width={17} height={17} /> {SITE.phone}
              </a>
            </div>
            <ul className="hero-proofs">
              <li><span className="proof-ic"><IconCheck width={13} height={13} /></span>Devis en 2 min</li>
              <li><span className="proof-ic"><IconCheck width={13} height={13} /></span>Prix respecté</li>
              <li><span className="proof-ic"><IconCheck width={13} height={13} /></span>Garanti 1 an</li>
            </ul>
            <div className="hero-trust">
              <OpenStatus />
              <a className="hero-rating" href={SITE.googleReviews} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("google_reviews_click", { src: "hero" })}>
                <span className="hero-trust-stars" aria-hidden>
                  {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={15} height={15} />)}
                </span>
                <span><b>{RATING.value.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}/5</b> · {RATING.count} avis Google</span>
              </a>
            </div>
          </div>

          <div className="hero-media">
            <span className="accent-block" aria-hidden />
            <div className="hero-media-frame">
              {/* Photo d'illustration — à remplacer par une vraie photo de l'atelier GDA */}
              <Image
                src="/photos/hero.jpg"
                alt="Mécanicien intervenant sur une voiture dans l'atelier"
                fill priority sizes="(max-width: 980px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <span className="media-badge" aria-hidden>Atelier · Aumetz</span>
            </div>
            <div className="hero-media-panel">
              <h3>Mécanique de confiance</h3>
              <p>Devis clair, prix respecté, travail garanti 1 an. Vous savez ce que vous payez.</p>
              <a className="panel-link" href="#prestations">Nos prestations <span>→</span></a>
            </div>
          </div>
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

      {/* ABOUT */}
      <section className="section about">
        <div className="wrap about-grid">
          <div className="about-media">
            <span className="accent-block accent-block-left" aria-hidden />
            <div className="about-media-frame about-media-big">
              <Image src="/photos/engine.jpg" alt="Intervention mécanique sur un moteur" fill sizes="(max-width: 960px) 100vw, 45vw" style={{ objectFit: "cover" }} />
            </div>
            <div className="about-media-frame about-media-small">
              <Image src="/photos/wheel.jpg" alt="Montage et équilibrage de pneumatiques" fill sizes="(max-width: 960px) 50vw, 22vw" style={{ objectFit: "cover" }} />
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
            <button className="btn btn-dark" onClick={() => goVroomly("about")}>Prendre rendez-vous <span className="btn-arrow">→</span></button>
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
              <button className="btn btn-outline" onClick={() => goVroomly("prestations_head")}>Voir tout <span className="btn-arrow">→</span></button>
            </Reveal>
          </div>
          <div className="presta">
            {PRESTATIONS.map((c, i) => {
              const Ic = PRESTA_ICONS[c.ic];
              return (
                <Reveal key={c.t} delay={(i % 4) * 0.06}>
                  <div className="card" onClick={() => goVroomly("presta_card")} role="button" tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goVroomly("presta_card")}>
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

      {/* EXPERTISE */}
      <section className="section expertise">
        <div className="wrap exp-grid">
          <Reveal className="exp-media">
            <span className="accent-block" aria-hidden />
            <div className="exp-media-frame">
              <Image src="/photos/dark.jpg" alt="Voiture sur le pont de l'atelier" fill sizes="(max-width: 900px) 100vw, 48vw" style={{ objectFit: "cover" }} />
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
            <button className="btn btn-red" onClick={() => goVroomly("expertise")}>Obtenir mon devis <span className="btn-arrow">→</span></button>
          </Reveal>
        </div>
      </section>

      {/* TARIFS */}
      <section className="section tarifs" id="tarifs">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow center">Tarifs</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Des prix clairs, sans surprise</h2></Reveal>
            <Reveal delay={0.1}><p>Nos interventions les plus demandées. Le prix exact est confirmé après identification de votre voiture — en ligne, en 2 minutes.</p></Reveal>
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
                  <button className={`btn ${p.featured ? "btn-light" : "btn-dark"}`} onClick={() => goVroomly("pack_" + p.name)}>
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
            <Reveal delay={0.05}><h2 className="display">{RATING.value}/5 sur {RATING.count} avis Google</h2></Reveal>
            <Reveal delay={0.1}>
              <a className="rating-badge" href={SITE.googleReviews} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("google_reviews_click", { src: "badge" })}>
                <IconGoogle />
                <span className="rating-score tnum">{RATING.value.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}</span>
                <span className="rating-stars" aria-hidden>
                  {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={16} height={16} />)}
                </span>
                <span className="rating-label">{RATING.count} avis · voir sur Google</span>
              </a>
            </Reveal>
          </div>
          <div className="review-grid">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={(i % 3) * 0.08}>
                <div className="review-card">
                  <span className="review-quote-ic" aria-hidden><IconQuote /></span>
                  <div className="review-stars" aria-hidden>
                    {[0, 1, 2, 3, 4].map((s) => <IconStar key={s} width={16} height={16} />)}
                  </div>
                  <p className="review-quote">{r.text}</p>
                  <div className="review-foot">
                    <div className="review-avatar" aria-hidden>{r.name.charAt(0)}</div>
                    <div>
                      <div className="review-who">{r.name}</div>
                      <div className="review-meta">{r.tag} · Avis Google</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow center">FAQ</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">Vos questions, nos réponses</h2></Reveal>
          </div>
          <div className="faq-list">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={(i % 2) * 0.05}>
                <details className="faq-item">
                  <summary>{f.q}<span className="faq-plus" aria-hidden /></summary>
                  <div className="faq-a">{f.a}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / RDV */}
      <section className="section booking" id="contact">
        <div className="wrap booking-grid">
          <Reveal className="booking-copy">
            <div className="eyebrow">Rendez-vous</div>
            <h2 className="display">Réservez, ou on vous rappelle</h2>
            <p>
              Laissez votre numéro : on vous rappelle rapidement pour caler l&apos;intervention.
              Vous préférez tout faire en ligne, tout de suite&nbsp;? Obtenez votre devis en 2 minutes.
            </p>
            <CallbackForm />
            <div className="booking-alt">
              <span className="booking-alt-label">Ou immédiatement</span>
              <div className="booking-cta">
                <button className="btn btn-dark" onClick={() => goVroomly("contact")}>Devis en ligne <span className="btn-arrow">→</span></button>
                <a className="btn btn-outline" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("contact")}>
                  <IconPhone width={17} height={17} /> {SITE.phone}
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal className="booking-media">
            <LocationMap />
            <div className="booking-info">
              <div className="binfo"><span className="binfo-ic"><IconPin width={17} height={17} /></span><div><b>Adresse</b><span>{SITE.street}, {SITE.postalCode} {SITE.city}</span></div></div>
              <div className="binfo"><span className="binfo-ic"><IconClock width={17} height={17} /></span><div><b>Horaires <OpenStatus className="status-inline" /></b><span>Lun–Ven 8h30-12h / 14h-18h · Sam 9h-12h</span></div></div>
              <a className="binfo binfo-link" href={SITE.mapsDir} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("directions_click")}>
                <span className="binfo-ic"><IconPin width={17} height={17} /></span>
                <div><b>Itinéraire</b><span>Ouvrir dans Google Maps →</span></div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="ctaband">
        <div className="wrap inner">
          <Reveal><h2 className="display">Prêt à passer à l&apos;atelier&nbsp;?</h2></Reveal>
          <Reveal delay={0.05}><p>Devis clair en 2 minutes, ou un coup de fil et c&apos;est réglé.</p></Reveal>
          <Reveal delay={0.1}>
            <div className="ctaband-actions">
              <button className="btn btn-red" onClick={() => goVroomly("cta_band")}>Obtenir mon devis <span className="btn-arrow">→</span></button>
              <a className="btn btn-light" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("cta_band")}>
                <IconPhone width={17} height={17} /> {SITE.phone}
              </a>
            </div>
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
              <p className="foot-line"><IconPin width={16} height={16} /><span>{SITE.street}<br />{SITE.postalCode} {SITE.city}</span></p>
              <a className="foot-line" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("footer")}><IconPhone width={16} height={16} /><span>{SITE.phone}</span></a>
              <a className="foot-line" href={`mailto:${SITE.email}`}><span className="foot-at">@</span><span>{SITE.email}</span></a>
            </div>
            <div className="foot-col">
              <h5>Horaires</h5>
              <p className="foot-line"><IconClock width={16} height={16} /><span>Lun – Ven : 8h30-12h / 14h-18h</span></p>
              <p className="foot-line foot-line-indent">Samedi : 9h-12h</p>
              <p className="foot-line foot-line-indent">Dimanche : fermé</p>
            </div>
            <div className="foot-col">
              <h5>Liens</h5>
              <a href={SITE.vroomly} target="_blank" rel="noopener noreferrer" onClick={() => goVroomly("footer")}>Devis en ligne</a>
              <a href="#prestations">Prestations</a>
              <a href="#tarifs">Tarifs</a>
              <a href="#faq">FAQ</a>
              <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer">Avis Google</a>
            </div>
          </div>
          <div className="foot-brand">
            <Image src="/full-logo-light.png" alt="Garage D'Aumetz" width={128} height={60} />
          </div>
          <div className="foot-legal">
            <span>© 2026 {SITE.name} — {SITE.city} ({SITE.postalCode}), {SITE.region}.</span>
            <span>Site conçu par Netwanted</span>
          </div>
        </div>
      </footer>

      <StickyBar />
    </>
  );
}
