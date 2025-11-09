# Tâches - Le Trousseau

## ✅ Complétées (2025-11-09)

- [x] Remplacer le logo (src/assets et public) et déployer le frontend sur le VPS

## ✅ Complétées (2025-01-07)

### Backend API
- [x] Créer la structure du backend Node.js/Express
- [x] Configurer la connexion MySQL avec pool
- [x] Implémenter les middlewares de validation
- [x] Implémenter le rate limiting
- [x] Créer les controllers pour les soumissions
- [x] Créer les routes API
- [x] Configurer CORS et sécurité (Helmet)
- [x] Créer le serveur Express principal
- [x] Documenter l'API (README backend)

### Frontend
- [x] Modifier FormSubmissionService pour appeler l'API
- [x] Supprimer la dépendance mysql2 du frontend
- [x] Ajouter la variable d'environnement VITE_API_URL

### Base de données
- [x] Créer le schéma SQL (déjà existant dans sql/)

### Documentation
- [x] Créer DEPLOYMENT-GUIDE.md complet
- [x] Créer PLANNING.md
- [x] Créer script de déploiement deploy.sh
- [x] Documenter l'architecture

## 📋 À faire - Déploiement

### Prérequis VPS
- [ ] Vérifier que Node.js >= 18 est installé
- [ ] Vérifier que MySQL est installé et accessible
- [ ] Vérifier que Nginx est configuré
- [ ] Vérifier que PM2 est installé

### Base de données
- [ ] Se connecter au VPS MySQL
- [ ] Créer la base de données `letrousseau_db`
- [ ] Créer l'utilisateur `letrousseau_app`
- [ ] Exécuter le script `create-submissions-table.sql`
- [ ] Vérifier que la table est créée correctement

### Backend
- [ ] Transférer le dossier backend vers le VPS
- [ ] Installer les dépendances npm
- [ ] Créer le fichier .env avec les bonnes credentials
- [ ] Tester le démarrage manuel
- [ ] Configurer PM2
- [ ] Vérifier que l'API démarre au boot

### Nginx
- [ ] Créer la configuration pour api.asso-letrousseau.com
- [ ] Activer le site
- [ ] Tester la configuration
- [ ] Recharger Nginx

### DNS
- [ ] Ajouter l'enregistrement A pour api.asso-letrousseau.com
- [ ] Attendre la propagation DNS (peut prendre quelques heures)

### SSL
- [ ] Installer Certbot si nécessaire
- [ ] Obtenir un certificat pour api.asso-letrousseau.com
- [ ] Configurer le renouvellement automatique

### Frontend
- [ ] Créer .env.production avec VITE_API_URL=https://api.asso-letrousseau.com/api
- [ ] Builder le frontend avec npm run build
- [ ] Transférer dist/ vers le VPS
- [ ] Déployer dans /var/www/html
- [ ] Vérifier les permissions

### Tests
- [ ] Tester l'API : curl https://api.asso-letrousseau.com/api/health
- [ ] Tester le formulaire de contact sur le site
- [ ] Vérifier que les données arrivent dans MySQL
- [ ] Tester tous les formulaires (contact, booking, newsletter, quiz)
- [ ] Vérifier les logs PM2
- [ ] Vérifier les logs Nginx

## 🔮 Futures améliorations

### Fonctionnalités
- [ ] Système d'envoi d'emails (SMTP ou SendGrid)
- [ ] Dashboard admin pour consulter les soumissions
- [ ] Export CSV/Excel des soumissions
- [ ] Statistiques et analytics
- [ ] Système de notifications par email
- [ ] Archivage automatique des anciennes soumissions

### Sécurité
- [ ] Implémenter l'authentification pour l'admin
- [ ] Ajouter des logs d'audit
- [ ] Mettre en place des alertes de sécurité
- [ ] Scanner régulier des vulnérabilités

### Performance
- [ ] Mettre en place un cache Redis
- [ ] Optimiser les requêtes SQL
- [ ] Compression des réponses API
- [ ] CDN pour les assets statiques

### Monitoring
- [ ] Mettre en place un monitoring (Uptime Robot, etc.)
- [ ] Alertes en cas de downtime
- [ ] Métriques de performance
- [ ] Logs centralisés

### Tests
- [ ] Tests unitaires backend (Jest)
- [ ] Tests d'intégration API
- [ ] Tests E2E frontend (Playwright)
- [ ] Tests de charge

## 📝 Notes

### Credentials à configurer
- MySQL : DB_PASSWORD
- API : API_SECRET_KEY (générer avec `openssl rand -hex 32`)
- Cloudflare Turnstile : VITE_TURNSTILE_SITE_KEY

### Commandes utiles
```bash
# Déployer
./deploy.sh all

# Voir les logs
ssh root@168.231.85.181 "pm2 logs letrousseau-api"

# Redémarrer l'API
ssh root@168.231.85.181 "pm2 restart letrousseau-api"

# Backup DB
ssh root@168.231.85.181 "mysqldump -u root -p letrousseau_db > backup.sql"
```

## 🐛 Bugs connus

Aucun pour le moment.

## 💡 Idées

- Intégration avec un CRM (HubSpot, Pipedrive)
- Webhook pour notifier d'autres services
- API publique pour les partenaires
- Application mobile pour l'admin

## 🤖 En cours - Automatisation IA (2025-01-08)

### Système d'automatisation multi-plateforme
**Description** : Service backend autonome qui détecte les nouvelles vidéos YouTube et automatise la publication multi-plateforme avec génération de contenu via LLM.

**Workflow** :
1. Détection nouvelle vidéo YouTube (webhook ou polling)
2. Extraction métadonnées (titre, description, tags, miniature)
3. Génération contenus adaptés par plateforme via LLM (GPT-4/Claude)
4. Publication automatique sur site web, Twitter, Instagram, newsletter
5. Logs et monitoring des publications

**Extensions futures** :
- Déclencheur Instagram → Twitter + Stories
- Génération d'images avec modèles personnalisés
- Templates de stories avec brand identity

### Tâches - Phase 1 : MVP (✅ Complété)
- [x] Créer service d'automatisation (`backend/automation/`)
- [x] Implémenter module YouTube (webhook + polling fallback)
- [x] Implémenter module LLM (OpenAI/Anthropic)
- [x] Créer templates de prompts par plateforme
- [x] Implémenter module Twitter API v2
- [x] Implémenter module Instagram Graph API
- [x] Implémenter module Newsletter (Mailchimp/Brevo)
- [x] Créer endpoint API `/api/videos` pour le site
- [x] Créer tables MySQL `videos` et `automation_logs`
- [x] Créer documentation AUTOMATION.md
- [x] Configurer variables d'environnement

### Tâches - Phase 2 : Workflow avancé (En cours)
**Objectif** : Workflow complet avec transcription, clippage, génération d'images, threads Twitter intelligents

#### 2.1 Transcription & Analyse
- [ ] Service de transcription vidéo YouTube
  - Option 1 : YouTube Transcript API (gratuit, si disponible)
  - Option 2 : Whisper API OpenAI (précis, payant)
  - Option 3 : AssemblyAI (alternative)
- [ ] Service de résumé intelligent (LLM analyse transcription)
- [ ] Détection automatique des moments clés (timestamps)

#### 2.2 Clippage Vidéo
- [ ] Service de téléchargement vidéo YouTube (yt-dlp)
- [ ] Service de clippage FFmpeg
  - Extraction de segments 10-60 secondes
  - Identification automatique des moments clés via LLM
  - Export formats optimisés (vertical pour stories, carré pour Instagram)
- [ ] Service de compression et optimisation
- [ ] Stockage temporaire des clips (S3/local)

#### 2.3 Génération & Extraction Visuels
- [ ] Service de screenshot vidéo (FFmpeg)
  - Extraction frames clés
  - Miniatures optimisées
- [ ] Service de génération d'images IA
  - DALL-E 3 (OpenAI)
  - Stable Diffusion XL (alternative)
  - Midjourney API (si disponible)
- [ ] Templates de stories personnalisables
  - Brand identity (couleurs, fonts, logo)
  - Layouts adaptatifs

#### 2.4 Twitter Avancé
- [ ] Système de threads Twitter intelligents
  - Longueur adaptative selon contenu
  - Analyse du ton du compte existant
  - Lien YouTube dans le dernier tweet
- [ ] Service de gestion du thread épinglé
  - Récupération du thread épinglé actuel
  - Ajout du nouveau premier tweet
  - Mise à jour automatique
- [ ] Analyse de performance des threads passés

#### 2.5 Placements Multi-plateformes Étendus
- [ ] API TikTok
  - Publication de clips courts
  - Génération de captions avec hashtags
- [ ] API Snapchat
  - Stories via Snap Publisher API
  - Format vertical optimisé
- [ ] Instagram avancé
  - Carrousels avec miniature + screenshots + clips
  - Reels (clips courts)
  - Stories multiples

#### 2.6 Planification & Orchestration
- [ ] Planificateur de diffusion des clips
  - Calendrier de publication étalé
  - Heures optimales par plateforme
  - Éviter le spam
- [ ] Orchestrateur de workflow complexe
  - Gestion des dépendances entre tâches
  - Retry logic pour chaque étape
  - Rollback en cas d'échec partiel
- [ ] Dashboard de monitoring temps réel

#### 2.7 Infrastructure
- [ ] Queue de jobs robuste (Bull/BullMQ avec Redis)
- [ ] Stockage fichiers (S3 ou équivalent)
- [ ] CDN pour servir clips et images
- [ ] Webhook endpoints sécurisés
- [ ] Tests E2E complets

### Prochaines étapes immédiates
1. Créer service de transcription
2. Créer service de clippage FFmpeg
3. Mettre à jour Twitter pour threads intelligents
4. Ajouter TikTok et Snapchat APIs
