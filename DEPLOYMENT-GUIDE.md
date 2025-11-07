# Guide de Déploiement - Le Trousseau

Ce guide explique comment déployer le site web et l'API backend sur votre VPS.

## 📋 Prérequis

- VPS accessible via SSH : `root@168.231.85.181`
- MySQL installé sur le VPS
- Node.js >= 18.x installé sur le VPS
- Nginx installé et configuré
- Nom de domaine configuré : `www.asso-letrousseau.com`

## 🎯 Architecture

```
Frontend (React/Vite)
    ↓ (HTTPS)
Backend API (Node.js/Express) sur port 3001
    ↓ (MySQL)
Base de données MySQL
```

---

## ÉTAPE 1 : Préparer la base de données MySQL

### 1.1 Se connecter au VPS

```bash
ssh root@168.231.85.181
```

### 1.2 Se connecter à MySQL

```bash
mysql -u root -p
```

### 1.3 Créer la base de données et l'utilisateur

```sql
-- Créer la base de données
CREATE DATABASE letrousseau_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer l'utilisateur pour l'application
CREATE USER 'letrousseau_app'@'localhost' IDENTIFIED BY 'VotreMotDePasseSecurise123!';

-- Donner les permissions nécessaires
GRANT SELECT, INSERT, UPDATE ON letrousseau_db.* TO 'letrousseau_app'@'localhost';
FLUSH PRIVILEGES;

-- Vérifier
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user = 'letrousseau_app';

-- Quitter MySQL
EXIT;
```

### 1.4 Créer la table submissions

```bash
# Depuis votre machine locale, transférer le fichier SQL
scp sql/create-submissions-table.sql root@168.231.85.181:/tmp/

# Sur le VPS, exécuter le script
mysql -u root -p letrousseau_db < /tmp/create-submissions-table.sql

# Vérifier que la table a été créée
mysql -u root -p -e "USE letrousseau_db; SHOW TABLES; DESCRIBE submissions;"
```

---

## ÉTAPE 2 : Déployer le Backend API

### 2.1 Transférer les fichiers du backend

```bash
# Depuis votre machine locale
cd /Users/macbook/MASTERSHELL/B-Projets/4-Dev/2025-11-02\ asso-letrousseau.com/LOVABLE/V1/sonic-trousseau-lab

# Créer une archive
tar -czf backend.tar.gz backend/

# Transférer vers le VPS
scp backend.tar.gz root@168.231.85.181:/var/www/
```

### 2.2 Installer sur le VPS

```bash
# Sur le VPS
ssh root@168.231.85.181

# Créer le dossier si nécessaire
mkdir -p /var/www/letrousseau

# Extraire l'archive
cd /var/www/letrousseau
tar -xzf /var/www/backend.tar.gz

# Aller dans le dossier backend
cd backend

# Installer les dépendances (production uniquement)
npm install --production
```

### 2.3 Configurer l'environnement

```bash
# Créer le fichier .env
nano .env
```

Contenu du fichier `.env` :

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=letrousseau_db
DB_USER=letrousseau_app
DB_PASSWORD=VotreMotDePasseSecurise123!

# CORS - Autoriser le domaine frontend
CORS_ORIGIN=https://www.asso-letrousseau.com,https://asso-letrousseau.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
API_SECRET_KEY=generer-une-cle-secrete-ici

# Logging
LOG_LEVEL=info
```

**Important** : Remplacez `VotreMotDePasseSecurise123!` par le mot de passe MySQL que vous avez créé.

### 2.4 Tester le backend manuellement

```bash
# Démarrer le serveur en mode test
node server.js
```

Vous devriez voir :
```
✅ Le Trousseau API Server
==========================
🚀 Server running on port 3001
🌍 Environment: production
📊 Database: Connected
```

Appuyez sur `Ctrl+C` pour arrêter.

### 2.5 Configurer PM2 (Process Manager)

```bash
# Installer PM2 globalement si pas déjà installé
npm install -g pm2

# Démarrer l'application avec PM2
pm2 start server.js --name letrousseau-api

# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs letrousseau-api --lines 50

# Sauvegarder la configuration PM2
pm2 save

# Configurer le démarrage automatique au boot
pm2 startup
# Suivre les instructions affichées
```

---

## ÉTAPE 3 : Configurer Nginx (Reverse Proxy)

### 3.1 Créer la configuration pour l'API

```bash
# Créer le fichier de configuration
nano /etc/nginx/sites-available/letrousseau-api
```

Contenu :

```nginx
server {
    listen 80;
    server_name api.asso-letrousseau.com;

    # Logs
    access_log /var/log/nginx/letrousseau-api-access.log;
    error_log /var/log/nginx/letrousseau-api-error.log;

    # Proxy vers l'API Node.js
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Cache
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.2 Activer la configuration

```bash
# Créer le lien symbolique
ln -s /etc/nginx/sites-available/letrousseau-api /etc/nginx/sites-enabled/

# Tester la configuration Nginx
nginx -t

# Si OK, recharger Nginx
systemctl reload nginx
```

### 3.3 Configurer le DNS

Dans votre gestionnaire de DNS (chez votre registrar), ajoutez :

```
Type: A
Nom: api
Valeur: 168.231.85.181
TTL: 3600
```

### 3.4 Installer SSL avec Certbot

```bash
# Installer Certbot si pas déjà fait
apt update
apt install certbot python3-certbot-nginx

# Obtenir un certificat SSL pour l'API
certbot --nginx -d api.asso-letrousseau.com

# Suivre les instructions
# Choisir l'option 2 (Redirect HTTP to HTTPS)
```

---

## ÉTAPE 4 : Déployer le Frontend

### 4.1 Configurer les variables d'environnement

Sur votre machine locale, créez un fichier `.env.production` :

```bash
cd /Users/macbook/MASTERSHELL/B-Projets/4-Dev/2025-11-02\ asso-letrousseau.com/LOVABLE/V1/sonic-trousseau-lab

nano .env.production
```

Contenu :

```env
VITE_API_URL=https://api.asso-letrousseau.com/api
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

### 4.2 Builder le frontend

```bash
# Sur votre machine locale
npm run build

# Vérifier que le dossier dist/ a été créé
ls -la dist/
```

### 4.3 Transférer vers le VPS

```bash
# Créer une archive
tar -czf dist.tar.gz dist/

# Transférer
scp dist.tar.gz root@168.231.85.181:/var/www/
```

### 4.4 Déployer sur le VPS

```bash
# Sur le VPS
ssh root@168.231.85.181

# Sauvegarder l'ancien site (optionnel)
mv /var/www/html /var/www/html.backup.$(date +%Y%m%d)

# Extraire le nouveau site
cd /var/www
tar -xzf dist.tar.gz
mv dist html

# Vérifier les permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
```

### 4.5 Vérifier la configuration Nginx du frontend

```bash
# Vérifier le fichier de configuration existant
cat /etc/nginx/sites-available/default
```

Assurez-vous qu'il contient :

```nginx
server {
    listen 80;
    server_name www.asso-letrousseau.com asso-letrousseau.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## ÉTAPE 5 : Tests et Vérification

### 5.1 Tester l'API

```bash
# Test de santé
curl https://api.asso-letrousseau.com/api/health

# Devrait retourner :
# {"success":true,"status":"healthy","timestamp":"...","database":"connected"}
```

### 5.2 Tester le formulaire de contact

1. Ouvrir le navigateur : `https://www.asso-letrousseau.com/contact`
2. Remplir le formulaire
3. Soumettre
4. Vérifier que le message de succès s'affiche

### 5.3 Vérifier dans la base de données

```bash
# Sur le VPS
mysql -u root -p

# Dans MySQL
USE letrousseau_db;
SELECT * FROM submissions ORDER BY timestamp DESC LIMIT 5;
```

Vous devriez voir les soumissions récentes.

---

## 🔧 Maintenance et Monitoring

### Logs de l'API

```bash
# Voir les logs PM2
pm2 logs letrousseau-api

# Logs en temps réel
pm2 logs letrousseau-api --lines 100

# Logs Nginx
tail -f /var/log/nginx/letrousseau-api-access.log
tail -f /var/log/nginx/letrousseau-api-error.log
```

### Redémarrer l'API

```bash
pm2 restart letrousseau-api
```

### Mettre à jour l'API

```bash
# Sur votre machine locale, créer une nouvelle archive
tar -czf backend.tar.gz backend/
scp backend.tar.gz root@168.231.85.181:/var/www/

# Sur le VPS
cd /var/www/letrousseau
tar -xzf /var/www/backend.tar.gz
cd backend
npm install --production
pm2 restart letrousseau-api
```

### Sauvegarder la base de données

```bash
# Créer un backup
mysqldump -u root -p letrousseau_db > backup_$(date +%Y%m%d).sql

# Restaurer depuis un backup
mysql -u root -p letrousseau_db < backup_20250107.sql
```

---

## 🚨 Dépannage

### L'API ne démarre pas

```bash
# Vérifier les logs
pm2 logs letrousseau-api --err

# Vérifier la connexion MySQL
mysql -u letrousseau_app -p -h localhost letrousseau_db
```

### Erreur CORS

Vérifiez que `CORS_ORIGIN` dans `/var/www/letrousseau/backend/.env` contient bien votre domaine.

### Le formulaire ne s'envoie pas

1. Ouvrir la console du navigateur (F12)
2. Onglet Network
3. Soumettre le formulaire
4. Vérifier la requête vers l'API

---

## ✅ Checklist de déploiement

- [ ] Base de données MySQL créée
- [ ] Table `submissions` créée
- [ ] Backend déployé et démarré avec PM2
- [ ] Nginx configuré pour l'API
- [ ] SSL installé pour api.asso-letrousseau.com
- [ ] Frontend buildé avec la bonne URL d'API
- [ ] Frontend déployé sur le VPS
- [ ] Tests de soumission de formulaire réussis
- [ ] Vérification des données dans MySQL

---

## 📞 Support

Pour toute question, consultez les logs ou contactez l'équipe technique.
