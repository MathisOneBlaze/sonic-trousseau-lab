# 🔄 Guide de Synchronisation

## 📊 Architecture des fichiers

```
┌─────────────────────────────────────────────┐
│  LOCAL (Mac)                                 │
│  ~/MASTERSHELL/.../sonic-trousseau-lab      │
└──────────────────┬──────────────────────────┘
                   │ git push
                   ↓
┌─────────────────────────────────────────────┐
│  GITHUB                                      │
│  github.com/MathisOneBlaze/sonic-trousseau-lab │
└──────────────────┬──────────────────────────┘
                   │ git pull
                   ↓
┌─────────────────────────────────────────────┐
│  VPS (Production)                            │
│  /var/www/letrousseau-repo (code source)    │
│  /var/www/letrousseau/backend (déployé)     │
│  /var/www/html (frontend déployé)           │
└─────────────────────────────────────────────┘
```

## 🚀 Méthode 1 : Script automatique (RECOMMANDÉ)

### Synchronisation complète

```bash
./sync.sh "Description de vos changements"
```

Ce script fait automatiquement :
1. ✅ Commit local → GitHub
2. ✅ Pull GitHub → VPS
3. ✅ Redémarrage backend si nécessaire

## 🔧 Méthode 2 : Manuelle

### Depuis votre Mac

#### 1. Commit et push vers GitHub

```bash
# Voir les changements
git status

# Ajouter les fichiers modifiés
git add .

# Commiter
git commit -m "Description des changements"

# Pousser vers GitHub
git push origin main
```

#### 2. Synchroniser le VPS

```bash
ssh root@168.231.85.181

# Aller dans le repo
cd /var/www/letrousseau-repo

# Récupérer les derniers changements
git pull origin main

# Si changements backend
cd backend
npm install --production
pm2 restart letrousseau-api

# Si changements frontend
# Rebuild et redéployer (voir section ci-dessous)
```

## 📦 Déploiement après synchronisation

### Backend modifié

```bash
ssh root@168.231.85.181

cd /var/www/letrousseau-repo/backend
npm install --production

# Copier vers le dossier de production
rsync -av --exclude='node_modules' ./ /var/www/letrousseau/backend/

cd /var/www/letrousseau/backend
npm install --production
pm2 restart letrousseau-api

# Vérifier
pm2 logs letrousseau-api --lines 20
```

### Frontend modifié

```bash
# Sur votre Mac
npm run build
tar -czf dist.tar.gz dist/
scp dist.tar.gz root@168.231.85.181:/tmp/

# Sur le VPS
ssh root@168.231.85.181
cd /var/www
rm -rf html
tar -xzf /tmp/dist.tar.gz
mv dist html
chown -R www-data:www-data html
chmod -R 755 html
```

Ou utilisez le script de déploiement :

```bash
./deploy.sh frontend
```

## 📝 Workflow recommandé

### Développement quotidien

1. **Travailler en local**
   ```bash
   npm run dev  # Tester localement
   ```

2. **Commiter régulièrement**
   ```bash
   git add .
   git commit -m "feat: nouvelle fonctionnalité"
   git push origin main
   ```

3. **Déployer en production** (quand prêt)
   ```bash
   ./sync.sh "Deploy: nouvelle fonctionnalité"
   ./deploy.sh all  # ou backend/frontend séparément
   ```

### Hotfix en production

Si vous devez corriger quelque chose rapidement :

```bash
# 1. Faire le changement en local
# 2. Tester
npm run dev

# 3. Déployer rapidement
git add .
git commit -m "hotfix: correction bug"
git push origin main
./deploy.sh backend  # ou frontend selon le cas
```

## 🔍 Vérification de la synchronisation

### Vérifier que tout est synchronisé

```bash
# Local
git status
git log -1

# GitHub (dans le navigateur)
# Vérifier le dernier commit

# VPS
ssh root@168.231.85.181
cd /var/www/letrousseau-repo
git log -1
git status
```

### Comparer les versions

```bash
# Voir les différences entre local et VPS
ssh root@168.231.85.181 "cd /var/www/letrousseau-repo && git log -1 --format='%H'"
git log -1 --format='%H'

# Les deux hash doivent être identiques
```

## ⚠️ Fichiers à NE PAS synchroniser

Ces fichiers sont dans `.gitignore` et ne doivent PAS être dans Git :

- ❌ `.env` (credentials sensibles)
- ❌ `node_modules/` (dépendances)
- ❌ `dist/` (build artifacts)
- ❌ `*.tar.gz` (archives)
- ❌ `*.log` (logs)
- ❌ `*.old` (backups)

## 🆘 Résolution de problèmes

### Conflit Git

```bash
# Si conflit lors du pull
git pull origin main

# Résoudre manuellement les conflits
# Puis
git add .
git commit -m "fix: resolve conflicts"
git push origin main
```

### VPS désynchronisé

```bash
ssh root@168.231.85.181
cd /var/www/letrousseau-repo

# Forcer la synchronisation (ATTENTION: perd les changements locaux VPS)
git fetch origin
git reset --hard origin/main
```

### Backend ne redémarre pas

```bash
ssh root@168.231.85.181
pm2 logs letrousseau-api --err
pm2 restart letrousseau-api
pm2 status
```

## 📊 Checklist de synchronisation

Avant de pousser en production :

- [ ] Code testé localement
- [ ] Pas d'erreurs dans la console
- [ ] `.env` non commité
- [ ] Commit avec message descriptif
- [ ] Push vers GitHub réussi
- [ ] Pull sur VPS réussi
- [ ] Backend redémarré (si modifié)
- [ ] Frontend redéployé (si modifié)
- [ ] Tests sur le site en production
- [ ] Vérification des logs PM2

## 🎯 Commandes rapides

```bash
# Synchronisation complète
./sync.sh "Update: description"

# Déploiement complet
./deploy.sh all

# Vérifier le statut
git status
ssh root@168.231.85.181 "pm2 status"

# Voir les logs
ssh root@168.231.85.181 "pm2 logs letrousseau-api --lines 50"
```

---

**Conseil** : Utilisez `./sync.sh` pour la synchronisation quotidienne, c'est plus simple et plus sûr !
