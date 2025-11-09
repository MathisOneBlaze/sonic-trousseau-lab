# Le Trousseau – sonic-trousseau-lab

Site marketing + Dashboard d’automatisation (YouTube → Social).

## Périmètre

- Frontend: Vite + React + TypeScript + Tailwind + shadcn/ui
- Backend: Node/Express + MySQL + PM2 (API sur port 3001)
- Monitoring Admin: page statique servie par l’API (Nginx proxy) avec vue détaillée des jobs

## Dashboard Admin

- URL: https://admin.asso-letrousseau.com/dashboard
- Accès: protégé (mot de passe requis). Ne pas committer de secrets dans le repo.
- Fonctionnalités:
  - Liste des jobs avec icônes d’étapes + barre de progression
  - Modal détail (timeline, durées, métadonnées)
  - Toggle d’activation de l’automation (via API)

Docs associées:
- SETUP-ADMIN-DASHBOARD.md (mise en place Nginx/SSL/Proxy)
- ADMIN-DASHBOARD-COMPLETE.md (récapitulatif complet)
- TRIGGERS-YOUTUBE.md (règles de détection YouTube)

## Développement local

```bash
npm install
npm run dev
```

Backend API (dossier backend/):

```bash
cd backend
npm install
npm run start:dev
```

## Déploiement (résumé)

- VPS: 168.231.85.181
- Nginx reverse proxy vers API (3001) + dashboard `/dashboard`
- PM2 process: `letrousseau-api`

Consulter SETUP-ADMIN-DASHBOARD.md pour la procédure complète (Nginx + Certbot + sécurité).

## Sécurité

- CSP configurée (helmet) pour le dashboard
- Accès admin protégé (éviter d’exposer les secrets dans le README)

