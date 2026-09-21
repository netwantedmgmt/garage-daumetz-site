"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { SITE, HOURS, FAQ, RATING, REVIEWS } from "./site";
import { InfiniteMovingCards } from "./aceternity";
import { matchQuote, FREQUENT_SEARCHES, type QuoteResult } from "./quote-data";
import { BRANDS, modelsFor, motorisationsFor, type FuelType } from "./vehicle-data";
import {
  PRESTA_ICONS,
  IconCheck,
  IconStar,
  IconGoogle,
  IconShield,
  IconClock,
  IconPin,
  IconPhone,
  IconSearch,
  IconInstagram,
  IconX,
} from "./icons";

function trackEvent(name: string, props?: Record<string, string>) {
  try { track(name, props); } catch { /* no-op hors Vercel */ }
}
function goVroomly(src = "unknown") {
  trackEvent("vroomly_click", { src });
  window.open(SITE.vroomly, "_blank", "noopener,noreferrer");
}
function onCall(src = "unknown") { trackEvent("call_click", { src }); }

/* ---------- Logos ---------- */
function LogoImg() {
  return <Image src="/nav-logo-light.png" alt="Garage D'Aumetz" width={99} height={44} priority className="nav-logo" />;
}
function LogoText() {
  return (
    <div className="brand">
      <div className="brand-name">GARAGE D<span className="r">&apos;</span>AUMETZ</div>
      <div className="brand-sub">Mécanique &amp; entretien · Aumetz 57</div>
    </div>
  );
}

/* ---------- Reveal (visible sans JS) ---------- */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }), { rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>{children}</div>;
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
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } }));
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="tnum">{Math.round(val)}{suffix}</span>;
}

function OpenStatus({ className = "" }: { className?: string }) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const today = HOURS[now.getDay()] || [];
    let open = false; let until = 0;
    for (const [s, e] of today) { if (mins >= s && mins < e) { open = true; until = e; } }
    if (open) { const h = Math.floor(until / 60); const m = until % 60; setState({ open: true, label: `Ouvert · ferme à ${h}h${m ? String(m).padStart(2, "0") : "00"}` }); }
    else setState({ open: false, label: "Fermé actuellement" });
  }, []);
  if (!state) return null;
  return <span className={`status ${state.open ? "status-open" : "status-closed"} ${className}`}><i aria-hidden />{state.label}</span>;
}

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
    const t1 = setTimeout(() => setLeaving(true), reduce ? 400 : 2600);
    const t2 = setTimeout(() => setShow(false), reduce ? 650 : 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (!show) return null;
  return (
    <div className={`splash ${leaving ? "splash-out" : ""}`} aria-hidden onClick={() => { setLeaving(true); setTimeout(() => setShow(false), 450); }}>
      <div className="splash-inner">
        <Image src="/full-logo-light.png" alt="Garage D'Aumetz" width={300} height={140} priority className="splash-logo" />
        <div className="splash-bar"><span /></div>
      </div>
    </div>
  );
}

function StickyBar() {
  return (
    <div className="sticky-bar">
      <a className="sticky-btn sticky-call" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("sticky")}><IconPhone width={19} height={19} /> Appeler</a>
      <button className="sticky-btn sticky-rdv" onClick={() => goVroomly("sticky")}>Devis &amp; RDV <span aria-hidden>→</span></button>
    </div>
  );
}

function CallbackForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err" | "unconfigured">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return;
    setState("sending");
    trackEvent("callback_submit", { need: String(fd.get("need") || "") });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: fd.get("name"), phone: fd.get("phone"), need: fd.get("need"), message: fd.get("message"), company: fd.get("company") }) });
      if (res.ok) { setState("ok"); form.reset(); }
      else if (res.status === 503) setState("unconfigured");
      else setState("err");
    } catch { setState("err"); }
  }
  if (state === "ok") {
    return (
      <div className="form-success" role="status">
        <span className="form-success-ic"><IconCheck width={24} height={24} /></span>
        <b>Merci, c&apos;est noté&nbsp;!</b>
        <span>On vous rappelle au plus vite. Pour une urgence, appelez le {SITE.phone}.</span>
      </div>
    );
  }
  return (
    <form className="qb-form" onSubmit={onSubmit} noValidate>
      <div className="field"><span>Nom *</span><input name="name" type="text" required autoComplete="name" placeholder="Votre nom" /></div>
      <div className="field"><span>Téléphone *</span><input name="phone" type="tel" required autoComplete="tel" placeholder="06 12 34 56 78" /></div>
      <div className="field"><span>Besoin *</span>
        <select name="need" defaultValue="">
          <option value="" disabled>Sélectionner…</option>
          <option>Entretien / Vidange</option><option>Freinage</option><option>Distribution</option>
          <option>Diagnostic / Panne</option><option>Pneumatiques</option><option>Climatisation</option><option>Autre</option>
        </select>
      </div>
      <div className="field"><span>Message</span><textarea name="message" rows={2} placeholder="Marque, modèle, précisions…" /></div>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <button className="btn btn-red qb-submit" type="submit" disabled={state === "sending"}>{state === "sending" ? "Envoi…" : <>Être rappelé <span className="btn-arrow">→</span></>}</button>
      {state === "err" && <p className="form-msg form-err">Une erreur est survenue. Appelez-nous au {SITE.phone}.</p>}
      {state === "unconfigured" && <p className="form-msg form-err">Formulaire bientôt actif. En attendant, appelez le {SITE.phone}.</p>}
    </form>
  );
}

function LocationMap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="map-frame">
      {loaded ? (
        <iframe src={SITE.mapsEmbed} title="Localisation du Garage D'Aumetz à Aumetz (57710)" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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

/* ---------- Devis instantané (estimation par correspondance mots-clés) ---------- */
type PlateResult = {
  marque: string; modele: string; motorisation: string; carburant: FuelType; annee: number | null; label: string;
  vin?: string; kType?: string; engineCode?: string; performance?: boolean;
};

function QuoteEstimator() {
  const [problem, setProblem] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [motor, setMotor] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const models = modelsFor(brand);
  const motorisations = brand && model ? motorisationsFor(brand, model) : [];
  const manualFuel: FuelType | "" = motorisations.find((m) => m.label === motor)?.fuel ?? "";

  const [plate, setPlate] = useState("");
  const [plateStatus, setPlateStatus] = useState<"idle" | "loading" | "ok" | "notfound" | "error">("idle");
  const [plateResult, setPlateResult] = useState<PlateResult | null>(null);

  const [sendOpen, setSendOpen] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "ok" | "err" | "unconfigured">("idle");

  const fuel: FuelType | "" = plateResult ? plateResult.carburant : manualFuel;
  const effectiveYear = plateResult ? plateResult.annee ?? undefined : year ? parseInt(year, 10) : undefined;
  const vehicleLabel = plateResult ? plateResult.label : [brand, model, year, motor].filter(Boolean).join(" · ");
  const performance = plateResult ? !!plateResult.performance : !!motorisations.find((m) => m.label === motor)?.performance;

  function onBrandChange(v: string) { setBrand(v); setModel(""); setMotor(""); }
  function onModelChange(v: string) { setModel(v); setMotor(""); }

  function resetPlate() { setPlateResult(null); setPlateStatus("idle"); setPlate(""); }

  async function lookupPlate() {
    const p = plate.trim();
    if (!p) return;
    setPlateStatus("loading");
    trackEvent("plate_lookup_attempt");
    try {
      const res = await fetch(`/api/plate-lookup?plaque=${encodeURIComponent(p)}`);
      if (res.status === 404) { setPlateStatus("notfound"); setPlateResult(null); return; }
      if (!res.ok) { setPlateStatus("error"); setPlateResult(null); return; }
      const data = await res.json();
      setPlateResult({
        marque: data.marque, modele: data.modele, motorisation: data.motorisation, carburant: data.carburant,
        annee: data.annee, label: data.label, vin: data.vin, kType: data.kType, engineCode: data.engineCode,
        performance: data.performance,
      });
      setPlateStatus("ok");
      trackEvent("plate_lookup_success", { marque: data.marque });
    } catch {
      setPlateStatus("error");
      setPlateResult(null);
    }
  }

  function runEstimate(text?: string) {
    const q = (text ?? problem).trim();
    if (!q) return;
    if (text !== undefined) setProblem(text);
    const r = matchQuote(q, effectiveYear && !Number.isNaN(effectiveYear) ? effectiveYear : undefined, fuel || undefined, plateResult?.marque || brand || undefined, performance);
    setResult(r);
    setSubmitted(true);
    setSendOpen(false);
    setSendState("idle");
    trackEvent("quote_estimate", { matched: r ? r.category.id : "none", brand: plateResult?.marque || brand, fuel });
  }

  function onSubmit(e: React.FormEvent) { e.preventDefault(); runEstimate(); }
  function onChip(query: string, label: string) { trackEvent("quote_chip_click", { label }); runEstimate(query); }

  async function onSendQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!result || result.notApplicable) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return;
    setSendState("sending");
    trackEvent("quote_send_submit", { category: result.category.id });
    try {
      const res = await fetch("/api/send-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          company: fd.get("company"),
          vehicleLabel,
          problem,
          categoryId: result.category.id,
          year: effectiveYear,
          fuel: fuel || undefined,
          brand: plateResult?.marque || brand || undefined,
          performance,
          vin: plateResult?.vin,
          kType: plateResult?.kType,
          engineCode: plateResult?.engineCode,
        }),
      });
      if (res.ok) { setSendState("ok"); trackEvent("quote_send_success", { category: result.category.id }); }
      else if (res.status === 503) setSendState("unconfigured");
      else setSendState("err");
    } catch {
      setSendState("err");
    }
  }

  return (
    <section className="section quote" id="devis-instantane">
      <div className="wrap">
        <div className="section-head center">
          <Reveal><div className="eyebrow eyebrow-bar center">Devis instantané</div></Reveal>
          <Reveal delay={0.05}><h2 className="display">Décrivez le problème, on vous chiffre</h2></Reveal>
          <Reveal delay={0.1}><p>Un bruit, un voyant allumé, une panne&nbsp;? Indiquez-le et obtenez une première estimation immédiate.</p></Reveal>
        </div>

        <Reveal delay={0.12}>
          <form className="qsearch" onSubmit={onSubmit}>
            <div className="qsearch-box">
              <div className="qsearch-row-main">
                <div className="qsearch-field qsearch-main">
                  <IconSearch width={18} height={18} />
                  <input type="text" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Ex : bruit au freinage, voyant moteur allumé…" />
                </div>
                <button className="btn btn-red qsearch-submit" type="submit">Estimer <span className="btn-arrow">→</span></button>
              </div>
              <div className="qplate-row">
                <div className="qplate-field">
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="Plaque d'immatriculation (ex : FH-034-DD)"
                    maxLength={12}
                    disabled={!!plateResult}
                  />
                  {!plateResult && (
                    <button type="button" className="btn btn-outline qplate-btn" onClick={lookupPlate} disabled={!plate.trim() || plateStatus === "loading"}>
                      {plateStatus === "loading" ? "Recherche…" : "Identifier mon véhicule"}
                    </button>
                  )}
                </div>
                {plateStatus === "ok" && plateResult && (
                  <div className="qplate-status qplate-ok">
                    <IconCheck width={14} height={14} /> {plateResult.label}
                    <button type="button" className="qplate-reset" onClick={resetPlate}>Modifier / saisir manuellement</button>
                  </div>
                )}
                {plateStatus === "notfound" && (
                  <div className="qplate-status qplate-warn">Véhicule non reconnu — renseignez-le manuellement ci-dessous.</div>
                )}
                {plateStatus === "error" && (
                  <div className="qplate-status qplate-warn">Service indisponible pour le moment — renseignez votre véhicule manuellement ci-dessous.</div>
                )}
              </div>
              {!plateResult && (
                <div className="qsearch-row-filters">
                  <select className="qsearch-side" value={brand} onChange={(e) => onBrandChange(e.target.value)}>
                    <option value="">Marque</option>
                    {BRANDS.map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                  <select className="qsearch-side" value={model} onChange={(e) => onModelChange(e.target.value)} disabled={!brand}>
                    <option value="">Modèle</option>
                    {models.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input className="qsearch-side qsearch-year" type="number" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Année" min={1980} max={new Date().getFullYear()} />
                  <select className="qsearch-side" value={motor} onChange={(e) => setMotor(e.target.value)} disabled={!model}>
                    <option value="">Motorisation</option>
                    {motorisations.map((m) => <option key={m.label} value={m.label}>{m.label}</option>)}
                  </select>
                </div>
              )}
            </div>
          </form>
          <div className="qchips">
            <span className="qchips-label">Recherches fréquentes</span>
            <div className="qchips-row">
              {FREQUENT_SEARCHES.map((f) => (
                <button key={f.label} type="button" className={`qchip ${f.featured ? "qchip-featured" : ""}`} onClick={() => onChip(f.query, f.label)}>{f.label}</button>
              ))}
            </div>
          </div>
        </Reveal>

        {submitted && (
          <Reveal className="qresult">
            {result && !result.notApplicable ? (
              <div className="qresult-card">
                <div className="qresult-head">
                  <span className="qresult-tag">{result.category.label}</span>
                  {vehicleLabel && <span className="qresult-vehicle">{vehicleLabel}</span>}
                </div>
                <div className="qresult-breakdown">
                  {result.partsMax > 0 && (
                    <div className="qline"><span>Pièces</span><b className="tnum">{result.partsMin}–{result.partsMax} €</b></div>
                  )}
                  <div className="qline"><span>Main d&apos;œuvre (≈{result.hoursMin}–{result.hoursMax} h)</span><b className="tnum">{result.laborMin}–{result.laborMax} €</b></div>
                  <div className="qline qline-total"><span>Total estimé</span><b className="tnum">{result.totalMin}–{result.totalMax} €</b></div>
                </div>
                {result.category.note && <p className="qresult-note">{result.category.note}</p>}
                {result.ageNote && <p className="qresult-note">{result.ageNote}</p>}
                {result.fuelNote && <p className="qresult-note">{result.fuelNote}</p>}

                {sendState === "ok" ? (
                  <div className="form-success" role="status">
                    <span className="form-success-ic"><IconCheck width={22} height={22} /></span>
                    <b>Devis envoyé au garage&nbsp;!</b>
                    <span>On vous recontacte rapidement pour confirmer votre créneau.</span>
                  </div>
                ) : sendOpen ? (
                  <form className="qsend-form" onSubmit={onSendQuote} noValidate>
                    <div className="field"><span>Nom *</span><input name="name" type="text" required autoComplete="name" placeholder="Votre nom" /></div>
                    <div className="field"><span>Téléphone *</span><input name="phone" type="tel" required autoComplete="tel" placeholder="06 12 34 56 78" /></div>
                    <div className="field"><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="Optionnel" /></div>
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
                    <div className="qsend-actions">
                      <button className="btn btn-red" type="submit" disabled={sendState === "sending"}>{sendState === "sending" ? "Envoi…" : <>Envoyer ce devis au garage <span className="btn-arrow">→</span></>}</button>
                      <button className="btn btn-outline" type="button" onClick={() => setSendOpen(false)}>Annuler</button>
                    </div>
                    {sendState === "err" && <p className="form-msg form-err">Une erreur est survenue. Appelez-nous au {SITE.phone}.</p>}
                    {sendState === "unconfigured" && <p className="form-msg form-err">Envoi bientôt actif. En attendant, appelez le {SITE.phone}.</p>}
                  </form>
                ) : (
                  <div className="qresult-cta">
                    <button className="btn btn-red" onClick={() => { setSendOpen(true); trackEvent("quote_send_open", { category: result.category.id }); }}>Envoyer ce devis au garage <span className="btn-arrow">→</span></button>
                    <a className="btn btn-outline" href="#contact">Être rappelé</a>
                  </div>
                )}
                {!sendOpen && sendState !== "ok" && (
                  <button type="button" className="qresult-vroomly-link" onClick={() => goVroomly("quote_" + result.category.id)}>ou réserver directement en ligne via Vroomly →</button>
                )}
                <p className="qresult-disclaimer">Estimation indicative TTC à partir de tarifs moyens constatés, confirmée après diagnostic en atelier.</p>
              </div>
            ) : result?.notApplicable ? (
              <div className="qresult-card qresult-empty">
                <div className="qresult-head"><span className="qresult-tag">{result.category.label}</span></div>
                <p>Cette prestation concerne les moteurs thermiques et ne s&apos;applique pas à un véhicule 100&nbsp;% électrique. Nos équipes restent à votre disposition pour un diagnostic adapté (freinage, climatisation, batterie de servitude…).</p>
                <div className="qresult-cta">
                  <button className="btn btn-red" onClick={() => goVroomly("quote_ev_" + result.category.id)}>Nous contacter <span className="btn-arrow">→</span></button>
                  <a className="btn btn-outline" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("quote_ev")}><IconPhone width={16} height={16} /> {SITE.phone}</a>
                </div>
              </div>
            ) : (
              <div className="qresult-card qresult-empty">
                <p>On n&apos;a pas identifié automatiquement votre panne. Un diagnostic complet reste la solution la plus fiable.</p>
                <div className="qresult-cta">
                  <button className="btn btn-red" onClick={() => goVroomly("quote_no_match")}>Diagnostic dès 55&nbsp;€ <span className="btn-arrow">→</span></button>
                  <a className="btn btn-outline" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("quote_no_match")}><IconPhone width={16} height={16} /> {SITE.phone}</a>
                </div>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------- Services accordion (numéroté, façon Autovera) ---------- */
/* Une photo dédiée par prestation (générées IA, cf. mémoire projet) — plus de
   cycle générique sur 4 photos sans rapport avec la prestation affichée. */
const SERVICE_IMG: Record<string, string> = {
  vidange: "/photos/vidange.jpg",
  frein: "/photos/freinage.jpg",
  distribution: "/photos/distribution.jpg",
  diagnostic: "/photos/diagnostic.jpg",
  suspension: "/photos/suspension.jpg",
  pneu: "/photos/pneumatiques.jpg",
  clim: "/photos/climatisation.jpg",
  batterie: "/photos/batterie.jpg",
};
function ServicesAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc">
      {PRESTATIONS.map((s, i) => {
        const isOpen = open === i;
        const img = SERVICE_IMG[s.ic] || "/photos/hero.jpg";
        return (
          <div className={`acc-item ${isOpen ? "open" : ""}`} key={s.t}>
            <button className="acc-head" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
              <span className="acc-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="acc-title">{s.t}</span>
              <span className="acc-toggle" aria-hidden />
            </button>
            <div className="acc-body">
              <div className="acc-body-inner">
                <div className="acc-grid">
                  <div className="acc-media">
                    <Image src={img} alt={`${s.t} — Garage D'Aumetz à Aumetz (57)`} fill sizes="(max-width: 820px) 100vw, 40vw" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="acc-content">
                    <div className="acc-kicker">Ce qu&apos;on prend en charge</div>
                    <p>{s.d}</p>
                    <div className="acc-foot">
                      <span className="acc-price tnum">{s.p}</span>
                      <button className="btn btn-red" onClick={() => goVroomly("service_" + s.ic)}>Réserver <span className="btn-arrow">→</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PRESTATIONS = [
  { ic: "vidange", t: "Vidange & entretien", d: "Huile, filtres et contrôle complet des niveaux, pour garder votre voiture en pleine forme toute l'année.", p: "dès 89 €" },
  { ic: "frein", t: "Freinage", d: "Plaquettes, disques et purge du liquide de frein. Un freinage sûr, contrôlé et garanti 1 an.", p: "dès 120 €" },
  { ic: "distribution", t: "Distribution", d: "Kit de distribution, pompe à eau, embrayage. L'intervention lourde faite dans les règles.", p: "dès 450 €" },
  { ic: "diagnostic", t: "Diagnostic", d: "Lecture des défauts et recherche de panne. On identifie avant de toucher à quoi que ce soit.", p: "dès 55 €" },
  { ic: "suspension", t: "Suspension & géométrie", d: "Amortisseurs, rotules, parallélisme. Une tenue de route saine et un roulage confortable.", p: "dès 160 €" },
  { ic: "pneu", t: "Pneumatiques", d: "Montage, équilibrage et permutation, toutes dimensions. Un vrai contact avec la route.", p: "dès 22 €/pneu" },
  { ic: "clim", t: "Climatisation", d: "Recharge, contrôle d'étanchéité et filtre d'habitacle. Le confort qui revient l'été.", p: "dès 79 €" },
  { ic: "batterie", t: "Batterie & démarrage", d: "Batterie, alternateur, démarreur. Fini les mauvaises surprises un matin d'hiver.", p: "dès 95 €" },
] as const;

const PACKS = [
  { price: "89", old: "117", name: "Entretien & vidange", d: "L'essentiel pour rouler serein.", lines: ["Vidange huile + filtre", "Contrôle des niveaux", "Point sécurité complet"], featured: false },
  { price: "120", old: "159", name: "Freinage", d: "Un freinage sûr, garanti 1 an.", lines: ["Plaquettes & disques", "Purge liquide de frein", "Contrôle de l'usure", "Essai routier"], featured: true },
  { price: "55", old: "75", name: "Diagnostic", d: "On trouve la panne, puis on décide.", lines: ["Lecture des défauts", "Recherche de panne", "Devis clair immédiat"], featured: false },
] as const;

const WHY = [
  { ic: "shield", t: "Garantie 1 an", d: "Pièces et main d'œuvre garanties sur toutes nos interventions." },
  { ic: "clock", t: "Prise en charge rapide", d: "Souvent dans la journée. On téléphone, on vous prend, c'est réglé." },
  { ic: "check", t: "Prix respecté", d: "Devis clair, respecté à l'euro près. Aucune surprise à la facture." },
  { ic: "star", t: "5/5 sur Google", d: "29 avis vérifiés. Un garage indépendant en qui on a confiance." },
] as const;
const WHY_ICON: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = { shield: IconShield, clock: IconClock, check: IconCheck, star: IconStar };

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
            <a className="link" href="#devis-instantane">Devis instantané</a>
            <a className="link" href="#prestations">Prestations</a>
            <a className="link" href="#tarifs">Tarifs</a>
            <a className="link" href="#avis">Avis</a>
            <a className="link" href="#faq">FAQ</a>
            <a className="link hdr-tel" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("header")}><IconPhone width={16} height={16} /> {SITE.phone}</a>
            <button className="btn btn-red btn-sm" onClick={() => goVroomly("header")}>Devis &amp; RDV</button>
          </nav>
        </div>
      </header>

      {/* HERO plein écran */}
      <section className="hero" id="top">
        <div className="hero-bg">
          <Image src="/photos/hero-m4.jpg" alt="BMW M4 en intervention au Garage D'Aumetz" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          <div className="hero-scrim" aria-hidden />
        </div>
        <div className="wrap hero-inner">
          <h1 className="display hero-title">
            Votre voiture entre de<br /><span className="r hero-title-accent">bonnes mains</span>
          </h1>
          <p className="hero-sub">Devis clair en 2 minutes, prix respecté à l&apos;euro près, travail garanti 1 an. Toutes marques — entretien, freinage, distribution, diagnostic.</p>
          <div className="hero-cta">
            <button className="btn btn-red btn-lg" onClick={() => goVroomly("hero")}>Obtenir mon devis <span className="btn-arrow">→</span></button>
            <a className="btn btn-glass btn-lg" href="#tarifs">Voir les tarifs</a>
          </div>
          <div className="hero-meta">
            <OpenStatus />
            <span className="hero-rating-inline"><span className="stars-inline" aria-hidden>{[0,1,2,3,4].map((s) => <IconStar key={s} width={14} height={14} />)}</span><b>5,0</b> · 29 avis Google</span>
          </div>
        </div>
        <div className="hero-progress" aria-hidden><div className="wrap"><div className="hero-progress-bar" /></div></div>
      </section>

      <QuoteEstimator />

      {/* STATS BAR */}
      <section className="stats">
        <div className="wrap stats-grid">
          <Reveal className="stat-cell"><div className="stat-num"><CountUp to={10} suffix="+" /></div><div className="stat-bar" /><div className="stat-label">Ans d&apos;expérience</div><p>Des années sous le capot, sur toutes les marques.</p></Reveal>
          <Reveal className="stat-cell" delay={0.06}><div className="stat-num"><CountUp to={3} /></div><div className="stat-bar" /><div className="stat-label">Mécaniciens</div><p>Une équipe réactive et un accueil clair.</p></Reveal>
          <Reveal className="stat-cell" delay={0.12}><div className="stat-num">5<span className="stat-num-sm">/5</span></div><div className="stat-bar" /><div className="stat-label">Note Google</div><p>29 avis vérifiés, 100&nbsp;% de clients satisfaits.</p></Reveal>
        </div>
      </section>

      {/* PRESTATIONS — accordéon numéroté */}
      <section className="section services" id="prestations">
        <div className="wrap">
          <div className="section-head split-head">
            <div>
              <Reveal><div className="eyebrow eyebrow-bar">Nos prestations</div></Reveal>
              <Reveal delay={0.05}><h2 className="display">Ce qu&apos;on prend en charge</h2></Reveal>
            </div>
            <Reveal delay={0.1} className="split-head-side">
              <p>Toutes marques, pièces d&apos;origine ou équivalentes, tarifs de garage indépendant.</p>
              <button className="btn btn-outline" onClick={() => goVroomly("services_head")}>Tout réserver <span className="btn-arrow">→</span></button>
            </Reveal>
          </div>
          <Reveal delay={0.12}><ServicesAccordion /></Reveal>
        </div>
      </section>

      {/* POURQUOI NOUS CHOISIR */}
      <section className="section why">
        <div className="wrap why-grid">
          <div className="why-left">
            <Reveal><div className="eyebrow eyebrow-bar">Pourquoi nous choisir</div></Reveal>
            <Reveal delay={0.05}><h2 className="display">La mécanique, un métier de confiance</h2></Reveal>
            <div className="why-list">
              {WHY.map((w, i) => {
                const Ic = WHY_ICON[w.ic];
                return (
                  <Reveal key={w.t} delay={0.06 + i * 0.05}>
                    <div className="why-item">
                      <div className="why-ic"><Ic width={22} height={22} /></div>
                      <div><b>{w.t}</b><span>{w.d}</span></div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <Reveal className="why-media" delay={0.1}>
            <Image src="/photos/m4wood.jpg" alt="Mécanicien intervenant sur une BMW M4" fill sizes="(max-width: 900px) 100vw, 46vw" style={{ objectFit: "cover" }} />
          </Reveal>
        </div>
      </section>

      {/* TARIFS */}
      <section className="section tarifs" id="tarifs">
        <div className="wrap">
          <div className="section-head split-head">
            <div>
              <Reveal><div className="eyebrow eyebrow-bar">Tarifs</div></Reveal>
              <Reveal delay={0.05}><h2 className="display">Des prix clairs, sans surprise</h2></Reveal>
            </div>
            <Reveal delay={0.1} className="split-head-side"><p>Nos interventions les plus demandées. Le prix exact est confirmé en ligne après identification de votre voiture.</p></Reveal>
          </div>
          <div className="packs">
            {PACKS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className={`pack ${p.featured ? "pack-featured" : ""}`}>
                  {p.featured && <span className="pack-tag">Le plus demandé</span>}
                  <div className="pack-name">{p.name}</div>
                  <div className="pack-price"><span className="pack-cur">dès</span> <b className="tnum">{p.price} €</b> <s className="tnum">{p.old} €</s></div>
                  <p className="pack-desc">{p.d}</p>
                  <ul className="pack-list">
                    {p.lines.map((l) => <li key={l}><span className="pack-check"><IconCheck width={13} height={13} /></span>{l}</li>)}
                  </ul>
                  <button className={`btn ${p.featured ? "btn-red" : "btn-outline"} pack-btn`} onClick={() => goVroomly("pack_" + p.name)}>Réserver {p.name} <span className="btn-arrow">→</span></button>
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
            <Reveal><div className="eyebrow eyebrow-bar center">Avis clients</div></Reveal>
            <Reveal delay={0.05}><h2 className="display"><span className="r">{RATING.value}/5</span> sur {RATING.count} avis Google</h2></Reveal>
            <Reveal delay={0.1}>
              <a className="rating-badge" href={SITE.googleReviews} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("google_reviews_click", { src: "badge" })}>
                <IconGoogle />
                <span className="rating-score tnum">{RATING.value.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}</span>
                <span className="rating-stars" aria-hidden>{[0,1,2,3,4].map((s) => <IconStar key={s} width={16} height={16} />)}</span>
                <span className="rating-label">Voir tous nos avis</span>
              </a>
            </Reveal>
          </div>
          <InfiniteMovingCards items={REVIEWS} />
        </div>
      </section>

      {/* À PROPOS (split + stats sur image) */}
      <section className="section about">
        <div className="about-bg" aria-hidden>
          <Image src="/photos/engine.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
          <div className="about-scrim" />
        </div>
        <div className="wrap about-grid">
          <div className="about-stats">
            <Reveal className="about-stat"><b><CountUp to={10} suffix="+" /></b><span>Ans d&apos;expérience</span></Reveal>
            <Reveal className="about-stat" delay={0.06}><b><CountUp to={3} /></b><span>Mécaniciens</span></Reveal>
            <Reveal className="about-stat" delay={0.12}><b>5/5</b><span>Note Google</span></Reveal>
          </div>
          <Reveal className="about-card" delay={0.08}>
            <div className="eyebrow eyebrow-bar">Le garage</div>
            <h2 className="display">Passion mécanique.<br />Exigence du travail bien fait.</h2>
            <p>Garage indépendant certifié à Aumetz, on met la même précision et le même soin sur chaque voiture qui entre à l&apos;atelier. Pièces d&apos;origine ou équivalentes, jamais du bas de gamme.</p>
            <p>Devis clair, prix respecté, travail garanti 1 an. Vous savez ce que vous payez, et pourquoi.</p>
            <button className="btn btn-red" onClick={() => goVroomly("about")}>Prendre rendez-vous <span className="btn-arrow">→</span></button>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="wrap">
          <div className="section-head center">
            <Reveal><div className="eyebrow eyebrow-bar center">FAQ</div></Reveal>
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

      {/* CTA + RÉSERVATION RAPIDE */}
      <section className="section booking" id="contact">
        <div className="wrap booking-grid">
          <Reveal className="booking-copy">
            <div className="eyebrow eyebrow-bar">Rendez-vous</div>
            <h2 className="display">Prêt à confier votre voiture&nbsp;?</h2>
            <p>Laissez votre numéro : on vous rappelle rapidement. Ou obtenez votre devis en ligne en 2 minutes.</p>
            <div className="booking-cta">
              <button className="btn btn-red btn-lg" onClick={() => goVroomly("contact")}>Obtenir mon devis <span className="btn-arrow">→</span></button>
              <a className="btn btn-outline btn-lg" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("contact")}><IconPhone width={17} height={17} /> {SITE.phone}</a>
            </div>
            <div className="booking-info">
              <div className="binfo"><span className="binfo-ic"><IconPin width={17} height={17} /></span><div><b>Adresse</b><span>{SITE.street}, {SITE.postalCode} {SITE.city}</span></div></div>
              <div className="binfo"><span className="binfo-ic"><IconClock width={17} height={17} /></span><div><b>Horaires <OpenStatus className="status-inline" /></b><span>Lun–Ven 8h30-12h / 14h-18h · Sam 9h-12h</span></div></div>
              <a className="binfo binfo-link" href={SITE.mapsDir} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("directions_click")}><span className="binfo-ic"><IconPin width={17} height={17} /></span><div><b>Itinéraire</b><span>Ouvrir dans Google Maps →</span></div></a>
            </div>
            <LocationMap />
          </Reveal>
          <Reveal className="qb" delay={0.08}>
            <div className="qb-head"><h3>Réservation rapide</h3><p>On vous rappelle pour caler l&apos;intervention.</p></div>
            <CallbackForm />
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand-col">
              <LogoText />
              <p className="foot-lead">Votre garage automobile indépendant à Aumetz, en Moselle. Toutes marques, devis clair, travail garanti.</p>
              <div className="foot-social">
                {/* Instagram/X à brancher quand les comptes seront créés */}
                <a href="#" aria-label="Instagram (bientôt disponible)" className="foot-social-btn" onClick={(e) => e.preventDefault()}><IconInstagram width={18} height={18} /></a>
                <a href="#" aria-label="X / Twitter (bientôt disponible)" className="foot-social-btn" onClick={(e) => e.preventDefault()}><IconX width={18} height={18} /></a>
                <a href={SITE.vroomly} target="_blank" rel="noopener noreferrer" aria-label="Vroomly" className="foot-social-btn" onClick={() => goVroomly("footer_social")}><span className="icon-vroomly" aria-hidden /></a>
              </div>
            </div>
            <div className="foot-col">
              <h5>Prestations</h5>
              {PRESTATIONS.slice(0, 6).map((p) => <a key={p.t} href="#prestations">{p.t}</a>)}
            </div>
            <div className="foot-col">
              <h5>Liens</h5>
              <a href={SITE.vroomly} target="_blank" rel="noopener noreferrer" onClick={() => goVroomly("footer")}>Devis en ligne</a>
              <a href="#tarifs">Tarifs</a><a href="#faq">FAQ</a>
              <a href={SITE.googleReviews} target="_blank" rel="noopener noreferrer">Avis Google</a>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a className="foot-line" href={`tel:${SITE.phoneTel}`} onClick={() => onCall("footer")}><IconPhone width={16} height={16} /><span>{SITE.phone}</span></a>
              <a className="foot-line" href={`mailto:${SITE.email}`}><span className="foot-at">@</span><span>{SITE.email}</span></a>
              <p className="foot-line"><IconPin width={16} height={16} /><span>{SITE.street}<br />{SITE.postalCode} {SITE.city}</span></p>
              <p className="foot-line"><IconClock width={16} height={16} /><span>Lun–Ven 8h30-12h / 14h-18h<br />Samedi 9h-12h</span></p>
            </div>
          </div>
          <div className="foot-brand"><Image src="/full-logo-light.png" alt="Garage D'Aumetz" width={128} height={60} /></div>
          <div className="foot-legal">
            <span>© 2026 {SITE.name} — {SITE.city} ({SITE.postalCode}), {SITE.region}.</span>
            <span><a href="/mentions-legales">Mentions légales &amp; confidentialité</a> · Site conçu par Netwanted</span>
          </div>
        </div>
      </footer>

      <StickyBar />
    </>
  );
}
