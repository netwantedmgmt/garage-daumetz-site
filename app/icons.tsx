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
