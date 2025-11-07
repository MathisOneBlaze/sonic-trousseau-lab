# Le Trousseau - Backend API

API backend pour gérer les soumissions de formulaires et la connexion à la base de données MySQL.

## 📋 Prérequis

- Node.js >= 18.x
- MySQL >= 8.0
- npm ou yarn

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos configurations
nano .env
```

## ⚙️ Configuration

Éditez le fichier `.env` avec vos paramètres :

```env
# Server
PORT=3001
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=letrousseau_db
DB_USER=letrousseau_app
DB_PASSWORD=votre-mot-de-passe

# CORS
CORS_ORIGIN=https://www.asso-letrousseau.com
```

## 📊 Base de données

### Créer la base de données et la table

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE letrousseau_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Créer l'utilisateur
CREATE USER 'letrousseau_app'@'localhost' IDENTIFIED BY 'votre-mot-de-passe';
GRANT SELECT, INSERT, UPDATE ON letrousseau_db.* TO 'letrousseau_app'@'localhost';
FLUSH PRIVILEGES;

# Utiliser la base de données
USE letrousseau_db;

# Exécuter le script SQL
source ../sql/create-submissions-table.sql
```

## 🏃 Démarrage

### Développement

```bash
npm run dev
```

### Production

```bash
npm start
```

## 📡 Endpoints API

### Health Check
```
GET /api/health
```

### Contact Form
```
POST /api/submissions/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0612345678",
  "subject": "Question",
  "message": "Bonjour...",
  "newsletter": false,
  "consent": true
}
```

### Booking Form
```
POST /api/submissions/booking
Content-Type: application/json

{
  "name": "Structure XYZ",
  "email": "contact@structure.com",
  "phone": "0612345678",
  "formula": "cycle",
  "participants": "8",
  "location": "Paris 75001",
  "dates": "Janvier 2025",
  "equipment": ["Sono", "Vidéoprojecteur"],
  "message": "Informations complémentaires",
  "consent": true
}
```

### Newsletter
```
POST /api/submissions/newsletter
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "consent": true
}
```

### Quiz
```
POST /api/submissions/quiz
Content-Type: application/json

{
  "userInfo": {
    "name": "John",
    "pseudonym": "JohnDoe",
    "email": "john@example.com",
    "phone": "0612345678",
    "age": "25-34",
    "location": "Paris"
  },
  "answers": [...],
  "results": {
    "score": 85,
    "archetype": "Aventurier",
    "stats": {...},
    "recommendedOffer": "Niveau 2"
  },
  "consent": true
}
```

## 🔒 Sécurité

- **Helmet**: Headers de sécurité HTTP
- **CORS**: Contrôle d'accès cross-origin
- **Rate Limiting**: Protection contre les abus (5 soumissions / 15 min)
- **Validation**: Validation stricte des entrées avec express-validator
- **Prepared Statements**: Protection contre les injections SQL

## 📦 Déploiement sur VPS

### 1. Transférer les fichiers

```bash
# Depuis votre machine locale
scp -r backend root@168.231.85.181:/var/www/letrousseau/
```

### 2. Installer sur le VPS

```bash
# Se connecter au VPS
ssh root@168.231.85.181

# Aller dans le dossier
cd /var/www/letrousseau/backend

# Installer les dépendances
npm install --production

# Configurer .env
nano .env
```

### 3. Configurer PM2 (Process Manager)

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer l'application
pm2 start server.js --name letrousseau-api

# Sauvegarder la configuration
pm2 save

# Configurer le démarrage automatique
pm2 startup
```

### 4. Configurer Nginx (Reverse Proxy)

Créer `/etc/nginx/sites-available/letrousseau-api` :

```nginx
server {
    listen 80;
    server_name api.asso-letrousseau.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/letrousseau-api /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx
```

### 5. Configurer SSL avec Certbot

```bash
# Installer Certbot
apt install certbot python3-certbot-nginx

# Obtenir un certificat SSL
certbot --nginx -d api.asso-letrousseau.com
```

## 📝 Logs

```bash
# Voir les logs PM2
pm2 logs letrousseau-api

# Voir les logs en temps réel
pm2 logs letrousseau-api --lines 100
```

## 🔧 Maintenance

```bash
# Redémarrer l'API
pm2 restart letrousseau-api

# Arrêter l'API
pm2 stop letrousseau-api

# Voir le statut
pm2 status
```

## 📞 Support

Pour toute question, contactez l'équipe technique.
