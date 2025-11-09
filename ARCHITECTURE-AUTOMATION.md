# 🏗️ Architecture de l'Automatisation Le Trousseau

## 📍 Où tourne l'automatisation ?

### ⚡ SUR LE VPS (Production)
```
VPS: 168.231.85.181
Processus: PM2 (letrousseau-api)
Status: 24/7 en arrière-plan
```

**L'automatisation NE TOURNE PAS sur votre Mac en local !**

Elle tourne **sur le serveur VPS** et fonctionne **24/7 automatiquement**.

---

## 🔄 Comment ça fonctionne ?

### Architecture complète

```
┌─────────────────────────────────────────────────────────────┐
│  VOTRE MAC (Local)                                          │
│  - Windsurf IDE                                             │
│  - Modification du code                                     │
│  - Dashboard de monitoring (lecture seule)                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Déploiement (DEPLOY-AUTOMATION.sh)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  VPS 168.231.85.181 (Production)                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PM2 Process: letrousseau-api                         │  │
│  │  - Serveur Express (port 3001)                        │  │
│  │  - Service d'automatisation                           │  │
│  │  - Cron job (toutes les 15 minutes)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          │ Vérifie toutes les 15 min         │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  YouTube Data API                                     │  │
│  │  Recherche nouvelles vidéos de Le Trousseau          │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          │ Si nouvelle vidéo détectée        │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Workflow automatique :                               │  │
│  │  1. Télécharge vidéo/audio                            │  │
│  │  2. Transcription (OpenAI Whisper)                    │  │
│  │  3. Analyse LLM (GPT-4)                               │  │
│  │  4. Génération thread Twitter                         │  │
│  │  5. Publication sur plateformes                       │  │
│  │  6. Mise à jour thread épinglé                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Publications :                                        │  │
│  │  - Twitter (@Le_Trousseau_)                           │  │
│  │  - Instagram (@letrousseau_en_video)                  │  │
│  │  - Newsletter (Brevo)                                 │  │
│  │  - Site web (asso-letrousseau.com)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MySQL Database                                        │  │
│  │  - videos                                              │  │
│  │  - automation_logs                                     │  │
│  │  - platform_publications                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Accessible via HTTP
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  VOUS (n'importe où)                                        │
│  - Browser / Windsurf                                       │
│  - Dashboard monitoring                                     │
│    http://168.231.85.181:3001/monitoring/monitoring.html   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Comment savoir si l'automatisation est active ?

### 1. Via SSH (Terminal)

```bash
# Se connecter au VPS
ssh root@168.231.85.181

# Vérifier le status PM2
pm2 status

# Voir les logs en temps réel
pm2 logs letrousseau-api

# Vérifier les derniers jobs dans la DB
mysql -u root letrousseau_db -e "SELECT * FROM automation_logs ORDER BY started_at DESC LIMIT 5;"
```

**Indicateurs que ça tourne** :
- ✅ PM2 status: `online`
- ✅ Uptime: plusieurs heures/jours
- ✅ Logs montrent des vérifications toutes les 15 min

### 2. Via le Dashboard (Browser)

**URL** : http://168.231.85.181:3001/monitoring/monitoring.html

**Ce que vous voyez si c'est actif** :
- ✅ Stats en temps réel (total jobs, taux succès)
- ✅ Liste des jobs récents
- ✅ Dernière mise à jour < 30 secondes
- ✅ Aucun message d'erreur de connexion

**Ce que vous voyez si c'est arrêté** :
- ❌ "Impossible de contacter le serveur"
- ❌ Page ne charge pas

### 3. Via les logs PM2

```bash
ssh root@168.231.85.181 'pm2 logs letrousseau-api --lines 50'
```

**Logs normaux toutes les 15 minutes** :
```
[2025-01-09 15:00:00] 🔍 Checking for new videos
[2025-01-09 15:00:01] ℹ️  Filtering videos published after: 2025-01-09
[2025-01-09 15:00:02] ✅ Found 0 new videos
[2025-01-09 15:15:00] 🔍 Checking for new videos
...
```

### 4. Publier une vidéo test

**Test ultime** :
1. Publiez une vidéo YouTube sur Le Trousseau
2. Attendez max 15 minutes
3. Vérifiez le dashboard → nouveau job apparaît
4. Mode DRY_RUN=true → aucune publication réelle
5. Vérifiez les logs → vous voyez tout le workflow

---

## 🌐 Où est le dashboard ?

### En local (pendant développement)
```
http://localhost:3001/monitoring/monitoring.html
```
**Fonctionne seulement si** :
- Backend tourne en local (`npm start`)
- MySQL configuré en local

### En production (VPS)
```
http://168.231.85.181:3001/monitoring/monitoring.html
```
**Accessible depuis** :
- Votre Mac
- N'importe quel browser
- Même votre téléphone

### Avec domaine (après config Nginx)
```
https://api.asso-letrousseau.com/monitoring/monitoring.html
```
**Nécessite** :
- Nginx configuré en reverse proxy
- SSL configuré

---

## 🔍 Commandes utiles

### Vérifier que tout tourne
```bash
ssh root@168.231.85.181 << 'EOF'
  echo "🔍 Status PM2:"
  pm2 status
  echo ""
  echo "📊 Derniers jobs:"
  mysql -u root letrousseau_db -e "SELECT job_id, video_title, status, started_at FROM automation_logs ORDER BY started_at DESC LIMIT 3;"
  echo ""
  echo "🐦 Dernières publications Twitter:"
  mysql -u root letrousseau_db -e "SELECT platform, status, published_at FROM platform_publications WHERE platform='twitter' ORDER BY published_at DESC LIMIT 3;"
EOF
```

### Redémarrer l'automatisation
```bash
ssh root@168.231.85.181 'pm2 restart letrousseau-api'
```

### Arrêter l'automatisation
```bash
ssh root@168.231.85.181 'pm2 stop letrousseau-api'
```

### Activer/désactiver via .env
```bash
# Sur le VPS, éditer .env
AUTOMATION_ENABLED=false  # Désactivé
AUTOMATION_ENABLED=true   # Activé

# Puis redémarrer
pm2 restart letrousseau-api
```

---

## 📊 Dashboard - Fonctionnalités

### Statistiques en temps réel
- Total jobs exécutés
- Taux de succès (%)
- Durée moyenne d'exécution
- Nombre de vidéos publiées

### Liste des jobs
- Date/heure
- Titre de la vidéo
- Status (pending, completed, failed)
- Durée d'exécution
- Plateformes activées

### Dernières vidéos
- Titre
- ID YouTube
- Date de publication
- Nombre de vues

### Auto-refresh
- Mise à jour automatique toutes les 30 secondes
- Bouton refresh manuel

---

## 🎯 Workflow de développement

### 1. Développement local (optionnel)
```bash
# Sur votre Mac
cd backend
npm install
npm start

# Ouvrir dashboard local
open http://localhost:3001/monitoring/monitoring.html
```

**Limites** :
- Nécessite MySQL en local
- Ne tourne pas 24/7
- Doit rester ouvert

### 2. Déploiement sur VPS (recommandé)
```bash
# Sur votre Mac
./DEPLOY-AUTOMATION.sh

# L'automatisation tourne maintenant sur le VPS 24/7
```

**Avantages** :
- MySQL déjà configuré
- Tourne 24/7 automatiquement
- PM2 gère les redémarrages
- Accessible depuis n'importe où

---

## 🚨 Troubleshooting

### Le dashboard ne charge pas
```bash
# Vérifier que le serveur tourne
ssh root@168.231.85.181 'pm2 status'

# Vérifier les ports ouverts
ssh root@168.231.85.181 'netstat -tulpn | grep 3001'
```

### L'automatisation ne détecte pas les vidéos
```bash
# Vérifier les logs
ssh root@168.231.85.181 'pm2 logs letrousseau-api --lines 100 | grep "Checking for new videos"'

# Vérifier la config YouTube
ssh root@168.231.85.181 'cat /var/www/letrousseau/backend/.env | grep YOUTUBE'
```

### Les tweets ne sont pas publiés (mode DRY_RUN)
```bash
# Vérifier le mode
ssh root@168.231.85.181 'cat /var/www/letrousseau/backend/.env | grep DRY_RUN'

# Si DRY_RUN=true → changez en false
ssh root@168.231.85.181 'sed -i "s/AUTOMATION_DRY_RUN=true/AUTOMATION_DRY_RUN=false/" /var/www/letrousseau/backend/.env'
ssh root@168.231.85.181 'pm2 restart letrousseau-api'
```

---

## 📝 Résumé

| Question | Réponse |
|----------|---------|
| **Où tourne l'automation ?** | Sur le VPS 168.231.85.181 (pas en local) |
| **Comment savoir si c'est actif ?** | Dashboard + `pm2 status` + logs |
| **Où est le dashboard ?** | http://168.231.85.181:3001/monitoring/monitoring.html |
| **Faut-il laisser Windsurf ouvert ?** | Non, ça tourne sur le serveur 24/7 |
| **Comment déployer ?** | `./DEPLOY-AUTOMATION.sh` |
| **Comment arrêter ?** | `pm2 stop letrousseau-api` ou `AUTOMATION_ENABLED=false` |

---

**L'automatisation est un service qui tourne en permanence sur votre VPS, indépendamment de votre ordinateur !** 🚀
