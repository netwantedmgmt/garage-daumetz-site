"use client";

/* Composants inspirés d'Aceternity UI (ui.aceternity.com), adaptés à la charte
   GDA (blanc / noir / rouge #e12f2f). Implémentés en CSS + état minimal (zéro
   moteur d'animation JS) : le contenu reste TOUJOURS visible — sans JS, pour les
   robots, et même si le rendu est ralenti. Aucune image ne peut disparaître. */

import { useEffect, useState } from "react";
import { cn } from "./lib/utils";

/* ---- Flip Words (Text Animations) — opacité toujours à 1, glissement CSS ---- */
export function FlipWords({
  words,
  duration = 2800,
  className = "",
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setCycling(true);
      setIndex((i) => (i + 1) % words.length);
    }, duration);
    return () => clearInterval(id);
  }, [words.length, duration]);

  return (
    <span className="flip-wrap">
      {/* key = remontage → rejoue le glissement CSS ; jamais d'opacité 0 durable */}
      <span key={index} className={cn("flip-word", cycling && "flip-anim", className)}>
        {words[index]}
      </span>
    </span>
  );
}

/* ---- Infinite Moving Cards (Card Components) — défilement CSS ---- */
export type MovingCard = { name: string; tag: string; text: string };

export function InfiniteMovingCards({
  items,
  speed = 55,
}: {
  items: readonly MovingCard[];
  speed?: number;
}) {
  return (
    <div className="imc">
      <ul className="imc-track" style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items].map((it, i) => (
          <li className="imc-card" key={i} aria-hidden={i >= items.length}>
            <div className="imc-stars" aria-hidden>★★★★★</div>
            <p className="imc-text">{it.text}</p>
            <div className="imc-foot">
              <span className="imc-avatar" aria-hidden>{it.name.charAt(0)}</span>
              <span>
                <b className="imc-name">{it.name}</b>
                <span className="imc-tag">{it.tag} · Avis Google</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Card Hover Effect — halo rouge au survol (CSS) ---- */
export function HoverGrid<T>({
  items,
  className,
  render,
}: {
  items: readonly T[];
  className?: string;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <div key={i} className="hg-item">
          <span className="hg-halo" aria-hidden />
          {render(item, i)}
        </div>
      ))}
    </div>
  );
}
