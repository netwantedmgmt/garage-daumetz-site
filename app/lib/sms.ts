import { SITE } from "../site";
import { logError } from "./log";

/* Notification SMS au garage via Twilio (Alphanumeric Sender ID — envoi seul,
   pas de numéro à louer). Best-effort : ne doit jamais faire échouer le flux
   principal (email) si le SMS échoue ou si Twilio n'est pas encore configuré. */
export async function sendGarageSms(body: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM || "GDAumetz";
  const to = process.env.GARAGE_SMS_TO || SITE.phoneTel;

  if (!sid || !token) return; // Twilio pas encore configuré — pas d'erreur, juste ignoré.

  try {
    const auth = Buffer.from(`${sid}:${token}`).toString("base64");
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body.slice(0, 300) }),
    });
    if (!res.ok) {
      logError("sms.twilio", { status: res.status, body: await res.text().catch(() => "") });
    }
  } catch (e) {
    // Best-effort : l'email reste le canal de référence, on n'échoue pas la requête pour un SMS raté.
    logError("sms.twilio", { message: e instanceof Error ? e.message : String(e) });
  }
}
