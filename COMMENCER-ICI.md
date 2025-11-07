# 🚀 COMMENCER ICI - Guide Rapide

## 📌 Situation actuelle

Votre formulaire de contact sur https://www.asso-letrousseau.com n'est **pas encore connecté** à la base de données MySQL.

## ✅ Ce qui a été fait

Un **backend API complet** a été créé pour gérer la connexion à MySQL de manière sécurisée :

- ✅ Backend Node.js/Express dans `backend/`
- ✅ Frontend modifié pour appeler l'API
- ✅ Documentation complète
- ✅ Scripts de déploiement automatisés

**Tout le code est prêt**, il ne reste plus qu'à le déployer sur votre VPS.

---

## 🎯 Ce qu'il faut faire maintenant

### Option 1 : Déploiement guidé (RECOMMANDÉ)

Suivez le guide complet étape par étape :

📖 **Ouvrez : [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)**

Ce guide contient :
- Instructions MySQL détaillées
- Configuration Nginx
- Installation SSL
- Tests et vérification
- Dépannage

**Temps estimé : 30-60 minutes**

### Option 2 : Déploiement rapide (pour utilisateurs avancés)

```bash
# 1. Préparer MySQL sur le VPS
ssh root@168.231.85.181
mysql -u root -p
# Exécuter les commandes SQL (voir DEPLOYMENT-GUIDE.md section "ÉTAPE 1")

# 2. Configurer le backend
cd backend
cp .env.example .env
nano .env  # Éditer avec vos credentials MySQL

# 3. Déployer
./deploy.sh all

# 4. Configurer Nginx et SSL (voir DEPLOYMENT-GUIDE.md)
```

---

## 📚 Documentation disponible

| Fichier | Quand l'utiliser |
|---------|------------------|
| **DEPLOYMENT-GUIDE.md** | 👈 **COMMENCEZ ICI** - Guide complet de déploiement |
| **README-INTEGRATION.md** | Vue d'ensemble de l'intégration |
| **rapport.md** | Résumé de tous les changements effectués |
| **PLANNING.md** | Architecture technique détaillée |
| **TASK.md** | Checklist des tâches |
| **backend/README.md** | Documentation de l'API |

---

## 🔑 Informations importantes

### Credentials à préparer

Avant de déployer, vous aurez besoin de :

1. **Accès MySQL sur le VPS**
   - User : `root`
   - Password : (votre mot de passe MySQL)

2. **Créer un mot de passe pour l'application**
   - Pour l'utilisateur `letrousseau_app`
   - Générez un mot de passe fort (ex: `openssl rand -base64 24`)

3. **Nom de domaine pour l'API**
   - Recommandé : `api.asso-letrousseau.com`
   - Vous devrez ajouter un enregistrement DNS de type A

### Architecture finale

```
Frontend (www.asso-letrousseau.com)
    ↓ HTTPS
Backend API (api.asso-letrousseau.com:3001)
    ↓ MySQL
Base de données (letrousseau_db)
```

---

## 🆘 Besoin d'aide ?

### Problèmes courants

**"Je ne sais pas comment me connecter à MySQL"**
→ Voir DEPLOYMENT-GUIDE.md, section "ÉTAPE 1"

**"L'API ne démarre pas"**
→ Vérifier les logs : `pm2 logs letrousseau-api`

**"Erreur de connexion à la base de données"**
→ Vérifier le fichier `backend/.env` et les credentials

**"Le formulaire ne s'envoie pas"**
→ Ouvrir la console du navigateur (F12) et vérifier les erreurs

### Commandes de dépannage

```bash
# Voir les logs de l'API
ssh root@168.231.85.181
pm2 logs letrousseau-api

# Redémarrer l'API
pm2 restart letrousseau-api

# Vérifier MySQL
mysql -u letrousseau_app -p letrousseau_db

# Voir les soumissions
mysql -u root -p
USE letrousseau_db;
SELECT * FROM submissions ORDER BY timestamp DESC LIMIT 5;
```

---

## ✨ Prêt à commencer ?

### Étape suivante immédiate

1. **Ouvrez** : [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
2. **Suivez** les instructions de l'ÉTAPE 1 (Base de données)
3. **Continuez** étape par étape

---

## 📊 Checklist rapide

Avant de déployer, vérifiez que vous avez :

- [ ] Accès SSH au VPS : `ssh root@168.231.85.181`
- [ ] MySQL installé et accessible sur le VPS
- [ ] Node.js >= 18 installé sur le VPS
- [ ] Nginx installé sur le VPS
- [ ] Un mot de passe MySQL prêt pour l'application
- [ ] 30-60 minutes devant vous

Si tout est OK → **Ouvrez DEPLOYMENT-GUIDE.md et commencez ! 🚀**

---

**Questions ?** Consultez la documentation ou les logs pour diagnostiquer les problèmes.

**Tout est prêt !** Le code est testé et fonctionnel, il suffit de suivre le guide.
