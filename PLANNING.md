# Le Trousseau - Documentation Projet

## 📋 Vue d'ensemble

Site web pour l'association Le Trousseau avec formulaire de contact connecté à une base de données MySQL.

## 🏗️ Architecture

### Frontend
- **Framework** : React 18 + Vite + TypeScript
- **UI** : Tailwind CSS + shadcn/ui
- **Routing** : React Router v6
- **État** : Context API
- **Formulaires** : React Hook Form + Zod

### Backend
- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : MySQL 8.0
- **Validation** : express-validator
- **Sécurité** : Helmet, CORS, Rate Limiting

### Infrastructure
- **VPS** : 168.231.85.181
- **Web Server** : Nginx
- **Process Manager** : PM2
- **SSL** : Let's Encrypt (Certbot)

## 📁 Structure du projet

```
sonic-trousseau-lab/
├── backend/                    # API Backend Node.js
│   ├── config/
│   │   └── database.js        # Configuration MySQL
│   ├── controllers/
│   │   └── submissionController.js
│   ├── middleware/
│   │   ├── validation.js      # Validation des entrées
│   │   └── rateLimiter.js     # Protection anti-spam
│   ├── routes/
│   │   └── submissions.js     # Routes API
│   ├── server.js              # Point d'entrée
│   ├── package.json
│   └── .env.example
│
├── src/                        # Frontend React
│   ├── components/
│   │   ├── ContactForm.tsx    # Formulaire de réservation
│   │   └── Navigation.tsx
│   ├── pages/
│   │   └── Contact.tsx        # Page de contact
│   ├── services/
│   │   └── FormSubmissionService.ts  # Client API
│   └── types/
│       └── submission.ts      # Types TypeScript
│
├── sql/
│   └── create-submissions-table.sql  # Schéma DB
│
├── deploy.sh                   # Script de déploiement
├── DEPLOYMENT-GUIDE.md        # Guide complet
└── README.md
```

## 🔄 Flux de données

```
Utilisateur remplit formulaire
    ↓
Frontend (React) valide les données
    ↓
Envoi POST vers API Backend
    ↓
Backend valide + rate limiting
    ↓
Insertion dans MySQL
    ↓
Réponse success/error
    ↓
Affichage toast à l'utilisateur
```

## 🗄️ Schéma de base de données

### Table : `submissions`

| Colonne | Type | Description |
|---------|------|-------------|
| id | VARCHAR(36) | UUID v4 |
| timestamp | DATETIME | Date de soumission |
| source | ENUM | Type : contact, booking, newsletter, quiz |
| consent | BOOLEAN | Consentement RGPD |
| name | VARCHAR(255) | Nom |
| email | VARCHAR(255) | Email |
| phone | VARCHAR(50) | Téléphone (optionnel) |
| subject | VARCHAR(500) | Sujet (contact) |
| message | TEXT | Message |
| newsletter | BOOLEAN | Inscription newsletter |
| formula | VARCHAR(255) | Formule (booking) |
| participants | VARCHAR(100) | Nombre participants |
| location | VARCHAR(255) | Lieu |
| equipment | JSON | Matériel disponible |
| quiz_user_info | JSON | Info utilisateur quiz |
| quiz_answers | JSON | Réponses quiz |
| quiz_results | JSON | Résultats quiz |

## 🔐 Sécurité

### Backend
- **Helmet** : Headers de sécurité HTTP
- **CORS** : Restriction des origines autorisées
- **Rate Limiting** : 5 soumissions / 15 minutes
- **Validation** : Validation stricte avec express-validator
- **Prepared Statements** : Protection SQL injection
- **Variables d'environnement** : Credentials sécurisés

### Frontend
- **Validation côté client** : Zod schemas
- **CAPTCHA** : Cloudflare Turnstile
- **HTTPS** : Tout le trafic chiffré
- **CSP** : Content Security Policy

## 🚀 Déploiement

### Développement local

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configs
npm run dev

# Frontend (dans un autre terminal)
npm install
cp .env.example .env
# Éditer .env avec VITE_API_URL=http://localhost:3001/api
npm run dev
```

### Production

```bash
# Déployer tout
./deploy.sh all

# Ou séparément
./deploy.sh backend
./deploy.sh frontend
```

Voir [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) pour les détails complets.

## 🧪 Tests

### Tester l'API

```bash
# Health check
curl https://api.asso-letrousseau.com/api/health

# Soumettre un formulaire de contact
curl -X POST https://api.asso-letrousseau.com/api/submissions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Message de test",
    "consent": true
  }'
```

### Vérifier dans la base de données

```bash
ssh root@168.231.85.181
mysql -u root -p
USE letrousseau_db;
SELECT * FROM submissions ORDER BY timestamp DESC LIMIT 10;
```

## 📊 Monitoring

### Logs Backend

```bash
# Logs PM2
pm2 logs letrousseau-api

# Logs Nginx
tail -f /var/log/nginx/letrousseau-api-access.log
tail -f /var/log/nginx/letrousseau-api-error.log
```

### Statut des services

```bash
# PM2
pm2 status

# Nginx
systemctl status nginx

# MySQL
systemctl status mysql
```

## 🔧 Maintenance

### Redémarrer l'API

```bash
ssh root@168.231.85.181
pm2 restart letrousseau-api
```

### Backup base de données

```bash
ssh root@168.231.85.181
mysqldump -u root -p letrousseau_db > backup_$(date +%Y%m%d).sql
```

### Restaurer un backup

```bash
mysql -u root -p letrousseau_db < backup_20250107.sql
```

## 📝 Conventions de code

### Backend (JavaScript/Node.js)
- ES Modules (`import/export`)
- Async/await pour les opérations asynchrones
- Gestion d'erreurs avec try/catch
- Logs détaillés avec emojis pour la lisibilité
- Commentaires JSDoc

### Frontend (TypeScript/React)
- Composants fonctionnels avec hooks
- Types stricts TypeScript
- Props interfaces bien définies
- Gestion d'état avec Context API
- Validation avec Zod

## 🐛 Dépannage

### L'API ne répond pas

1. Vérifier que PM2 tourne : `pm2 status`
2. Voir les logs : `pm2 logs letrousseau-api`
3. Vérifier MySQL : `systemctl status mysql`
4. Tester la connexion DB : `mysql -u letrousseau_app -p letrousseau_db`

### Erreur CORS

Vérifier `CORS_ORIGIN` dans `/var/www/letrousseau/backend/.env`

### Le formulaire ne s'envoie pas

1. Console navigateur (F12) → Network
2. Vérifier la requête vers l'API
3. Vérifier les logs backend

## 📞 Contact

Pour toute question technique, consulter les logs ou contacter l'équipe.

## 📅 Historique

- **2025-01-07** : Création du backend API + connexion MySQL
- **2024-XX-XX** : Création du frontend React/Vite
