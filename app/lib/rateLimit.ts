import type { NextRequest } from "next/server";

/* Rate limiting en mémoire (par instance serverless) — protège contre un
   abus évident/rapide sur les routes qui déclenchent un appel payant
   (RapidAPI, Resend, Twilio). Limite honnête : sur Vercel, chaque instance
   serverless a sa propre mémoire (pas de compteur partagé entre régions/
   instances froides), donc ce n'est PAS un rate limit distribué garanti —
   c'est un filet de sécurité basique, pas une garantie absolue. Pour une
   protection stricte, il faudrait un store partagé (ex. Upstash Redis). */
const buckets = new Map<string, { count: number; resetAt: number }>();

// Purge périodique pour éviter une fuite mémoire sur une instance longue durée.
setInterval(() => {
  const now = Date.now();
  for (const [key, b] of buckets) if (b.resetAt < now) buckets.delete(key);
}, 5 * 60 * 1000).unref?.();

export function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

/** true = requête autorisée, false = limite dépassée. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}
