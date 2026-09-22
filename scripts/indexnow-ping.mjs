#!/usr/bin/env node
// Notifie IndexNow (Bing, Yandex, etc.) que des pages ont changé, au lieu
// d'attendre leur prochain crawl. À relancer après un déploiement notable.
// Usage: node scripts/indexnow-ping.mjs

const HOST = "www.garagedaumetz.fr";
const KEY = "101890960aebc4ad509824d0b6c17272";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urlList = [
  `https://${HOST}/`,
  `https://${HOST}/mentions-legales`,
];

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

console.log(`IndexNow: HTTP ${res.status}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
