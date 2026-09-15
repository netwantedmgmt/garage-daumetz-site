/* Log structuré pour les échecs des intégrations externes (RapidAPI, Resend,
   Twilio). Visible en direct dans Vercel → Observability → Logs, sans
   dépendance ni compte supplémentaire à créer. Pas une alerte proactive
   (personne n'est notifié automatiquement) — pour ça, un vrai outil comme
   Sentry (gratuit jusqu'à 5k erreurs/mois) est la prochaine étape si le
   besoin s'en fait sentir : il suffit de me donner le DSN pour le brancher. */
export function logError(scope: string, details: Record<string, unknown>) {
  console.error(JSON.stringify({ level: "error", scope, time: new Date().toISOString(), ...details }));
}
