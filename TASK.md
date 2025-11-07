# Tâches - Le Trousseau

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
