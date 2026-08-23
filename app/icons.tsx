/* Jeu d'icônes ligne (SVG) — remplace les emojis pour un rendu pro, non-IA. */
import type { SVGProps } from "react";

const base = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconVidange(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3c2.6 3.4 4.5 6 4.5 8.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.5C7.5 9 9.4 6.4 12 3Z" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function IconFrein(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.8v3M12 17.2v3M3.8 12h3M17.2 12h3" />
    </svg>
  );
}

export function IconDistribution(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
    </svg>
  );
}

export function IconSuspension(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M8 3h8M8 21h8" />
      <path d="M9 3v2M15 3v2M9 21v-2M15 21v-2" />
      <path d="M9 5c6 1.6-6 3.6 0 5.2s-6 3.6 0 5.2 6 1.4 0 3.6" />
    </svg>
  );
}

export function IconDiagnostic(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M3 12h4l2 5 4-12 2 7h6" />
    </svg>
  );
}

export function IconClim(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11" />
      <path d="M12 5.5 10 4M12 5.5 14 4M12 18.5 10 20M12 18.5 14 20" />
      <path d="M5.2 8.6 4.9 6.4 6.9 5.9M18.8 8.6l.3-2.2-2-.5M5.2 15.4l-.3 2.2 2 .5M18.8 15.4l.3 2.2-2 .5" />
    </svg>
  );
}

export function IconPneu(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.8 12 8.6M12 15.4v4.8M3.8 12h4.8M15.4 12h4.8" />
    </svg>
  );
}

export function IconBatterie(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <path d="M7 7V5h3v2M14 7V5h3v2" />
      <path d="M8.5 12.5h3M14.5 12.5h-1.5M13 11v3" />
    </svg>
  );
}

export function IconCheck(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} strokeWidth={2.4} {...p}>
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

export function IconStar(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} fill="currentColor" stroke="none" {...p}>
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z" />
    </svg>
  );
}

/* Google "G" — multicolore officiel, pour le badge d'avis */
export function IconGoogle(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M22.5 12.24c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.04 5.04 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.71 3.25-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.67l-3.54-2.75c-.98.66-2.24 1.05-3.74 1.05-2.87 0-5.3-1.94-6.17-4.55H2.18v2.84A11 11 0 0 0 12 23Z" fill="#34A853" />
      <path d="M5.83 14.08a6.6 6.6 0 0 1 0-4.16V7.08H2.18a11 11 0 0 0 0 9.84l3.65-2.84Z" fill="#FBBC05" />
      <path d="M12 4.75c1.62 0 3.06.56 4.21 1.65l3.14-3.14C17.45 1.48 14.97.5 12 .5A11 11 0 0 0 2.18 7.08l3.65 2.84C6.7 6.69 9.13 4.75 12 4.75Z" fill="#EA4335" />
    </svg>
  );
}

/* Bouclier — garantie / confiance */
export function IconShield(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v5c0 4.3 3 8.3 7 9.5 4-1.2 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

/* Horloge — rapidité / horaires */
export function IconClock(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

/* Épingle — localisation */
export function IconPin(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

/* Téléphone */
export function IconPhone(p: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...p}>
      <path d="M6.5 3.5 9 4l1 3.5-1.8 1.4a12 12 0 0 0 5.4 5.4L15 16.9l3.5 1 .5 2.5c0 .8-.7 1.5-1.5 1.4A16.5 16.5 0 0 1 3.2 7c-.1-.8.6-1.5 1.4-1.5l1.9-.5Z" />
    </svg>
  );
}

/* Guillemet — citation d'avis */
export function IconQuote(p: SVGProps<SVGSVGElement>) {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
      <path d="M9.5 6C6.4 6 4 8.4 4 11.5 4 14.4 6.1 16.5 9 16.5c.2 0 .4 0 .6-.1-.6 1.4-1.9 2.4-3.6 2.9-.4.1-.6.5-.5.9.1.4.5.6.9.5C9.2 19.6 11 16.7 11 12.3 11 8.7 10.6 6 9.5 6Zm9 0C15.4 6 13 8.4 13 11.5c0 2.9 2.1 5 5 5 .2 0 .4 0 .6-.1-.6 1.4-1.9 2.4-3.6 2.9-.4.1-.6.5-.5.9.1.4.5.6.9.5 2.8-1.1 4.6-4 4.6-8.4C20 8.7 19.6 6 18.5 6Z" />
    </svg>
  );
}

export const PRESTA_ICONS = {
  vidange: IconVidange,
  frein: IconFrein,
  distribution: IconDistribution,
  suspension: IconSuspension,
  diagnostic: IconDiagnostic,
  clim: IconClim,
  pneu: IconPneu,
  batterie: IconBatterie,
} as const;
