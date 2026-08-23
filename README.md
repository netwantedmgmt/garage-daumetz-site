# Garage D'Aumetz — Site vitrine

Site vitrine premium du **Garage D'Aumetz** (Aumetz, Moselle, 57710).
Le devis et la réservation sont gérés par Vroomly : chaque appel à l'action
redirige vers la page Vroomly du garage.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (animations : hero à panneaux, scroll-reveals)

## Développement
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Personnalisation
- **Logo** : déposez `public/logo.png` puis remplacez le composant `<Logo />` (SVG placeholder) dans `app/page.tsx`.
- **Lien Vroomly** : constante `VROOMLY_URL` en haut de `app/page.tsx`.
- **Charte** : variables CSS (`--ink`, `--red`…) dans `app/globals.css`.

## Déploiement
Déployé sur Vercel — import du repo GitHub, build automatique.

---
Conçu par Netwanted.
