# Intégration Formulaire de Contact → Base de Données MySQL

## 🎯 Objectif

Connecter le formulaire de contact du site https://www.asso-letrousseau.com à une base de données MySQL sur le VPS pour collecter et stocker les soumissions.

## ✅ Ce qui a été fait

### 1. Backend API créé

Un backend complet Node.js/Express a été créé dans le dossier `backend/` :

```
backend/
├── config/
│   └── database.js           # Configuration MySQL avec pool de connexions
├── controllers/
│   └── submissionController.js  # Logique métier pour les soumissions
├── middleware/
│   ├── validation.js         # Validation des entrées (express-validator)
│   └── rateLimiter.js        # Protection anti-spam (5 req/15min)
├── routes/
│   └── submissions.js        # Routes API
├── server.js                 # Point d'entrée Express
├── package.json
├── .env.example
└── README.md
```

**Fonctionnalités** :
- ✅ Connexion sécurisée à MySQL avec pool
- ✅ Validation stricte des données entrantes
- ✅ Rate limiting pour éviter le spam
- ✅ Sécurité : Helmet, CORS, prepared statements
- ✅ Gestion d'erreurs robuste
- ✅ Logs détaillés

### 2. Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | Health check de l'API |
| `/api/submissions/contact` | POST | Formulaire de contact |
| `/api/submissions/booking` | POST | Formulaire de réservation |
| `/api/submissions/newsletter` | POST | Inscription newsletter |
| `/api/submissions/quiz` | POST | Soumission quiz |

### 3. Frontend modifié

Le service `FormSubmissionService.ts` a été réécrit pour :
- ❌ **Supprimer** la dépendance `mysql2` (impossible côté client)
- ✅ **Appeler** l'API backend via `fetch()`
- ✅ Gérer les erreurs réseau
- ✅ Configurable via `VITE_API_URL`

### 4. Documentation complète

- 📄 **DEPLOYMENT-GUIDE.md** : Guide pas-à-pas pour déployer sur le VPS
- 📄 **PLANNING.md** : Architecture et documentation technique
- 📄 **TASK.md** : Liste des tâches et checklist de déploiement
- 📄 **backend/README.md** : Documentation de l'API
- 🚀 **deploy.sh** : Script de déploiement automatisé

### 5. Schéma de base de données

Le fichier `sql/create-submissions-table.sql` est prêt à être exécuté. Il crée une table `submissions` avec :
- Support de 4 types de formulaires (contact, booking, newsletter, quiz)
- Champs JSON pour les données complexes
- Index optimisés
- Conformité RGPD

## 📋 Prochaines étapes (À FAIRE)

### Étape 1 : Préparer la base de données

```bash
# Se connecter au VPS
ssh root@168.231.85.181

# Se connecter à MySQL
mysql -u root -p

# Créer la base et l'utilisateur
CREATE DATABASE letrousseau_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'letrousseau_app'@'localhost' IDENTIFIED BY 'VotreMotDePasse';
GRANT SELECT, INSERT, UPDATE ON letrousseau_db.* TO 'letrousseau_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Exécuter le script SQL
mysql -u root -p letrousseau_db < /chemin/vers/create-submissions-table.sql
```

### Étape 2 : Déployer le backend

```bash
# Option A : Script automatique
./deploy.sh backend

# Option B : Manuel
cd backend
npm install
# Configurer .env
# Transférer vers VPS
# Démarrer avec PM2
```

### Étape 3 : Configurer Nginx

Créer un reverse proxy pour l'API sur `api.asso-letrousseau.com`

### Étape 4 : Déployer le frontend

```bash
# Créer .env.production
echo "VITE_API_URL=https://api.asso-letrousseau.com/api" > .env.production

# Builder et déployer
./deploy.sh frontend
```

### Étape 5 : Tester

```bash
# Test API
curl https://api.asso-letrousseau.com/api/health

# Test formulaire
# Aller sur https://www.asso-letrousseau.com/contact
# Remplir et soumettre

# Vérifier dans MySQL
mysql -u root -p
USE letrousseau_db;
SELECT * FROM submissions ORDER BY timestamp DESC LIMIT 5;
```

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| **DEPLOYMENT-GUIDE.md** | Guide complet de déploiement (COMMENCER ICI) |
| **PLANNING.md** | Architecture et documentation technique |
| **TASK.md** | Checklist des tâches |
| **backend/README.md** | Documentation de l'API backend |
| **deploy.sh** | Script de déploiement automatisé |

## 🔧 Configuration requise

### Sur le VPS
- Node.js >= 18.x
- MySQL >= 8.0
- Nginx
- PM2 (process manager)
- Certbot (SSL)

### Variables d'environnement

**Backend** (`backend/.env`) :
```env
PORT=3001
DB_HOST=localhost
DB_NAME=letrousseau_db
DB_USER=letrousseau_app
DB_PASSWORD=VotreMotDePasse
CORS_ORIGIN=https://www.asso-letrousseau.com
```

**Frontend** (`.env.production`) :
```env
VITE_API_URL=https://api.asso-letrousseau.com/api
```

## 🚀 Déploiement rapide

```bash
# 1. Préparer la base de données (voir Étape 1 ci-dessus)

# 2. Configurer les .env
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos credentials

# 3. Déployer tout
./deploy.sh all

# 4. Vérifier
curl https://api.asso-letrousseau.com/api/health
```

## 🆘 Support

En cas de problème :

1. **Consulter les logs** :
   ```bash
   ssh root@168.231.85.181
   pm2 logs letrousseau-api
   tail -f /var/log/nginx/letrousseau-api-error.log
   ```

2. **Vérifier la connexion MySQL** :
   ```bash
   mysql -u letrousseau_app -p letrousseau_db
   ```

3. **Redémarrer l'API** :
   ```bash
   pm2 restart letrousseau-api
   ```

4. **Consulter la documentation** : DEPLOYMENT-GUIDE.md

## 📊 Architecture finale

```
┌─────────────────────────────────────────────┐
│  Utilisateur                                 │
│  https://www.asso-letrousseau.com/contact   │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────┐
│  Frontend (React/Vite)                       │
│  - Validation côté client                    │
│  - CAPTCHA                                   │
└──────────────────┬──────────────────────────┘
                   │ POST /api/submissions/contact
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────┐
│  Nginx (Reverse Proxy)                       │
│  api.asso-letrousseau.com                    │
└──────────────────┬──────────────────────────┘
                   │ HTTP localhost:3001
                   ▼
┌─────────────────────────────────────────────┐
│  Backend API (Node.js/Express)               │
│  - Validation                                │
│  - Rate limiting                             │
│  - Sécurité (Helmet, CORS)                  │
└──────────────────┬──────────────────────────┘
                   │ MySQL queries
                   ▼
┌─────────────────────────────────────────────┐
│  MySQL Database                              │
│  Table: submissions                          │
└─────────────────────────────────────────────┘
```

## ✨ Résumé

**Problème initial** : Le formulaire de contact n'était pas connecté à une base de données.

**Solution implémentée** :
1. ✅ Backend API Node.js/Express créé
2. ✅ Connexion sécurisée à MySQL
3. ✅ Frontend modifié pour appeler l'API
4. ✅ Documentation complète
5. ✅ Scripts de déploiement

**Reste à faire** :
- Déployer sur le VPS (suivre DEPLOYMENT-GUIDE.md)
- Configurer la base de données
- Tester l'intégration

**Temps estimé pour le déploiement** : 30-60 minutes

---

**Prêt à déployer ?** → Consultez **DEPLOYMENT-GUIDE.md** 🚀
