# 🎛️ Configuration Admin Dashboard - admin.asso-letrousseau.com

## 📋 Vue d'Ensemble

**Objectif** : Rendre le dashboard de monitoring accessible via un sous-domaine sécurisé.

**URLs Finales** :
- `https://admin.asso-letrousseau.com` → Redirige vers /dashboard
- `https://admin.asso-letrousseau.com/dashboard` → Dashboard de monitoring
- `https://admin.asso-letrousseau.com/api/*` → API backend

---

## 🚀 Étapes de Configuration

### Étape 1 : Configuration DNS (À FAIRE CHEZ VOTRE REGISTRAR)

**Rendez-vous chez votre registrar** (OVH, Gandi, Cloudflare, etc.)

**Ajoutez un enregistrement A** :
```
Type: A
Nom: admin
Valeur: 168.231.85.181
TTL: 3600 (ou Auto)
```

**Résultat** : `admin.asso-letrousseau.com` pointera vers votre VPS.

**Vérification** :
```bash
# Depuis votre Mac, attendez 5-10 minutes puis :
dig admin.asso-letrousseau.com

# Devrait afficher :
# admin.asso-letrousseau.com. 3600 IN A 168.231.85.181
```

---

### Étape 2 : Configuration Nginx sur le VPS

**Automatique** - J'ai créé un script pour vous :

```bash
ssh root@168.231.85.181
cd /tmp

# Télécharger la config (ou copier le contenu du fichier nginx-admin-dashboard.conf)
nano /etc/nginx/sites-available/admin-letrousseau

# Copier le contenu de nginx-admin-dashboard.conf
# Puis sauvegarder (Ctrl+O, Enter, Ctrl+X)

# Activer le site
ln -s /etc/nginx/sites-available/admin-letrousseau /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Si OK, recharger Nginx
systemctl reload nginx
```

---

### Étape 3 : Configuration SSL (Certbot)

**Automatique avec Certbot** :

```bash
# Sur le VPS
certbot --nginx -d admin.asso-letrousseau.com

# Répondre aux questions :
# 1. Email : votre email
# 2. Accepter les TOS : Yes
# 3. Newsletter : Your choice
# 4. Redirect HTTP to HTTPS : 2 (Redirect)

# Certbot va automatiquement :
# - Obtenir le certificat SSL
# - Modifier la config Nginx
# - Configurer le renouvellement automatique
```

**Vérification SSL** :
```bash
# Test
curl -I https://admin.asso-letrousseau.com/dashboard

# Devrait retourner : 200 OK
```

---

### Étape 4 : Vérification Finale

**Tests à faire** :

1. **Accès au dashboard** :
   ```
   https://admin.asso-letrousseau.com/dashboard
   ```
   → Devrait afficher le dashboard de monitoring

2. **API fonctionne** :
   ```bash
   curl https://admin.asso-letrousseau.com/api/health
   ```
   → Devrait retourner : `{"status":"ok",...}`

3. **Toggle automation** :
   - Cliquez sur le toggle dans le dashboard
   - Vérifiez qu'il fonctionne

4. **SSL valide** :
   - Vérifiez le cadenas vert dans le navigateur
   - Pas d'avertissement de sécurité

---

## 🔒 Sécurité (Optionnel mais Recommandé)

### Option A : Protection par IP

Limitez l'accès uniquement à votre IP :

```nginx
# Dans /etc/nginx/sites-available/admin-letrousseau
# Ajoutez avant les locations :

# IP Whitelist
allow 88.187.131.21;    # Votre IP actuelle
allow 192.168.1.0/24;   # Votre réseau local si besoin
deny all;
```

**Puis recharger** :
```bash
systemctl reload nginx
```

### Option B : Protection par Mot de Passe (HTTP Basic Auth)

```bash
# Créer un fichier de mots de passe
apt-get install apache2-utils
htpasswd -c /etc/nginx/.htpasswd admin

# Entrez le mot de passe quand demandé
```

**Puis dans Nginx** :
```nginx
# Dans /etc/nginx/sites-available/admin-letrousseau
# Ajoutez dans le bloc location /dashboard :

location /dashboard {
    auth_basic "Admin Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    proxy_pass http://localhost:3001/monitoring/monitoring.html;
    # ... reste de la config
}
```

---

## 📊 Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ DNS Resolution
                       ▼
        admin.asso-letrousseau.com (168.231.85.181)
                       │
                       │ Port 443 (HTTPS)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx (VPS)                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ SSL Termination (Certbot)                             │  │
│  │ Security Headers                                      │  │
│  │ Access Control (Optional)                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                       │                                      │
│                       │ Proxy Pass                           │
│                       ▼                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ /dashboard → http://localhost:3001/monitoring/*.html  │  │
│  │ /api/*     → http://localhost:3001/api/*             │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Port 3001 (Internal)
                       ▼
        ┌──────────────────────────────────┐
        │    Node.js Backend (PM2)         │
        │  - Express Server                │
        │  - Automation Service            │
        │  - Monitoring API                │
        └──────────────────────────────────┘
```

---

## 🎯 Résultat Final

### URLs Disponibles

| URL | Fonction | Sécurité |
|-----|----------|----------|
| `https://asso-letrousseau.com` | Site public | Public |
| `https://api.asso-letrousseau.com` | API backend | CORS |
| `https://admin.asso-letrousseau.com/dashboard` | **Dashboard admin** | **SSL + Auth** |

---

## 🔧 Dépannage

### Problème : DNS ne résout pas

**Solution** :
```bash
# Vérifier la propagation DNS
nslookup admin.asso-letrousseau.com

# Attendre jusqu'à 24h (généralement 5-10 min)
# Vider le cache DNS local :
# Mac: sudo dscacheutil -flushcache
# Windows: ipconfig /flushdns
```

### Problème : 502 Bad Gateway

**Solution** :
```bash
# Vérifier que le backend tourne
pm2 list

# Vérifier les logs
pm2 logs letrousseau-api

# Redémarrer si nécessaire
pm2 restart letrousseau-api
```

### Problème : Certificat SSL ne fonctionne pas

**Solution** :
```bash
# Relancer certbot
certbot --nginx -d admin.asso-letrousseau.com --force-renewal

# Vérifier les certificats
certbot certificates
```

### Problème : CORS errors

**Solution** :
Le dashboard est servi depuis le même domaine, donc pas de CORS.
Si problème, vérifiez le fichier `.env` :
```env
CORS_ORIGIN=https://asso-letrousseau.com,https://admin.asso-letrousseau.com
```

---

## 📝 Checklist de Déploiement

- [ ] DNS configuré (enregistrement A)
- [ ] Nginx configuré et rechargé
- [ ] SSL Certbot configuré
- [ ] Dashboard accessible via https://admin.asso-letrousseau.com/dashboard
- [ ] API accessible via https://admin.asso-letrousseau.com/api/health
- [ ] Toggle automation fonctionne
- [ ] Sécurité configurée (IP whitelist ou Basic Auth)
- [ ] Tests complets effectués

---

## 🎉 Après Configuration

**Accès quotidien** :
```
https://admin.asso-letrousseau.com/dashboard
```

**Fonctionnalités disponibles** :
- ✅ Monitoring en temps réel
- ✅ Toggle activation/désactivation
- ✅ Statistiques des jobs
- ✅ Logs des vidéos traitées
- ✅ Vue détaillée (bientôt)

---

## 🚀 Évolutions Futures

Sur `https://admin.asso-letrousseau.com` :

- `/dashboard` → Monitoring automation ✅
- `/settings` → Paramètres système
- `/content` → Gestion de contenu
- `/analytics` → Statistiques avancées
- `/logs` → Logs système
- `/users` → Gestion utilisateurs

---

**Prêt à configurer ?** 

1. Configurez le DNS
2. Attendez 10 minutes
3. Lancez le script de configuration sur le VPS
4. Testez !

🔐 **Important** : Pensez à ajouter la protection par IP ou mot de passe après la configuration initiale !
