# 🎛️ Dashboard de Contrôle de l'Automation

## 📍 Accès au Dashboard

**URL** : http://168.231.85.181:3001/monitoring/monitoring.html

---

## ✨ Nouvelles Fonctionnalités

### 🔴🟢 Voyant de Statut Interactif

Le dashboard affiche maintenant un **voyant lumineux** indiquant l'état de l'automation :

#### 🟢 Voyant VERT (avec animation pulse)
- **Signification** : Automation **ACTIVE**
- **Affichage** : "Automation ACTIVE"
- **Détails** :
  - Mode actuel : DRY RUN ou PRODUCTION
  - Fréquence de vérification : Toutes les 15 minutes
  - Animation pulsée pour indiquer l'activité

#### 🔴 Voyant ROUGE
- **Signification** : Automation **INACTIVE**
- **Affichage** : "Automation INACTIVE"
- **Détails** : "L'automation est actuellement désactivée"

---

## 🎛️ Toggle Interactif

### Contrôle On/Off

Un **interrupteur toggle** permet de démarrer/arrêter l'automation **directement depuis le dashboard** :

```
┌────────────────────────────────────────────┐
│ 🟢 Automation ACTIVE                       │
│ Mode: DRY RUN • Vérification: */15 * * * * │
│                                             │
│ Activer/Désactiver  [━━━●]  ON            │
└────────────────────────────────────────────┘
```

### Comment utiliser

1. **Activer l'automation**
   - Cliquez sur le toggle → il passe à ON (vert)
   - Le voyant devient vert avec animation
   - Message : "Automation activée !"
   - L'automation démarre et vérifie YouTube toutes les 15 min

2. **Désactiver l'automation**
   - Cliquez sur le toggle → il passe à OFF (gris)
   - Le voyant devient rouge
   - Message : "Automation désactivée"
   - Les vérifications automatiques s'arrêtent

---

## 🔧 Comment ça fonctionne

### Backend

Le toggle modifie le fichier `.env` sur le serveur :

```bash
# Avant (inactif)
AUTOMATION_ENABLED=false

# Après activation
AUTOMATION_ENABLED=true
```

### Routes API

**GET** `/api/monitoring/automation/status`
- Récupère le statut actuel
- Retourne : enabled, dryRun, schedule, etc.

**POST** `/api/monitoring/automation/toggle`
- Body : `{ "enabled": true/false }`
- Met à jour le `.env`
- Redémarre l'automation si nécessaire

### Frontend

- **Auto-refresh** : Le statut est vérifié toutes les 30 secondes
- **Feedback visuel** : Messages de confirmation en vert
- **Animation** : Pulse sur le voyant actif

---

## 📊 Informations Affichées

### Statut Actif (🟢)
```
🟢 Automation ACTIVE
Mode: DRY RUN (simulation) • Vérification: */15 * * * *
```

### Statut Inactif (🔴)
```
🔴 Automation INACTIVE
L'automation est actuellement désactivée
```

---

## ⚙️ Modes de Fonctionnement

### DRY RUN Mode (simulation)
```env
AUTOMATION_DRY_RUN=true
```
- ✅ Détecte les vidéos
- ✅ Transcrit et analyse
- ✅ Génère le contenu
- ❌ **NE PUBLIE PAS** sur Twitter

### Production Mode
```env
AUTOMATION_DRY_RUN=false
```
- ✅ Détecte les vidéos
- ✅ Transcrit et analyse
- ✅ Génère le contenu
- ✅ **PUBLIE** sur Twitter et autres plateformes

**⚠️ Important** : Le mode (DRY_RUN/PRODUCTION) ne peut pas être changé depuis le dashboard. Il faut éditer le fichier `.env` manuellement.

---

## 🛡️ Sécurité

### Protections Intégrées

1. **Validation** : Le toggle vérifie que la valeur est bien un boolean
2. **Persistance** : Les changements sont sauvegardés dans `.env`
3. **Feedback** : Messages de confirmation/erreur
4. **Revert** : En cas d'erreur, le toggle revient à son état précédent

### Limitations

- **Pas de redémarrage PM2 automatique** : Le changement prend effet au prochain cycle
- **Mode DRY_RUN non modifiable** : Pour des raisons de sécurité

---

## 🔍 Dépannage

### Le toggle ne répond pas

```bash
# Vérifier les logs
ssh root@168.231.85.181
pm2 logs letrousseau-api --lines 50
```

### Le statut ne se met pas à jour

- **Attendre 30 secondes** : auto-refresh
- **Actualiser manuellement** : Bouton "🔄 Actualiser"

### L'automation ne démarre pas après activation

```bash
# Vérifier le .env sur le serveur
ssh root@168.231.85.181
cat /var/www/letrousseau/backend/.env | grep AUTOMATION_ENABLED

# Devrait afficher: AUTOMATION_ENABLED=true

# Si nécessaire, redémarrer manuellement
pm2 restart letrousseau-api
```

---

## 📸 Aperçu Visuel

### État Actif
```
┌──────────────────────────────────────────────────┐
│ 🎬 Le Trousseau - Monitoring Automatisation      │
│ Suivi en temps réel des jobs d'automatisation    │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ ● 🟢 Automation ACTIVE                           │
│    Mode: DRY RUN • Vérification: */15 * * * *    │
│                                                   │
│         Activer/Désactiver l'automation [━━━●] ON│
└──────────────────────────────────────────────────┘
```

### État Inactif
```
┌──────────────────────────────────────────────────┐
│ ● 🔴 Automation INACTIVE                         │
│    L'automation est actuellement désactivée      │
│                                                   │
│         Activer/Désactiver l'automation [●━━━] OFF│
└──────────────────────────────────────────────────┘
```

---

## 🎯 Workflow Typique

### 1. Consulter le Dashboard
```
http://168.231.85.181:3001/monitoring/monitoring.html
```

### 2. Vérifier le Statut
- Voyant vert = actif
- Voyant rouge = inactif

### 3. Activer/Désactiver
- Clic sur le toggle
- Confirmation visuelle immédiate

### 4. Observer les Jobs
- Les stats se mettent à jour automatiquement
- Jobs listés en temps réel

---

## 💡 Astuces

### Auto-refresh intelligent
Le dashboard se rafraîchit automatiquement toutes les 30 secondes, y compris le statut de l'automation.

### Raccourci clavier
- Pas de raccourci pour l'instant, mais le toggle est accessible facilement

### Mobile-friendly
Le dashboard est responsive et fonctionne sur mobile !

---

## 🚀 Prochaines Améliorations Possibles

- [ ] Toggle pour le mode DRY_RUN
- [ ] Bouton "Forcer un scan maintenant"
- [ ] Historique des activations/désactivations
- [ ] Notifications desktop
- [ ] Mode sombre

---

**Le dashboard est maintenant entièrement interactif !** 🎉

Vous pouvez contrôler l'automation YouTube → Twitter en un seul clic, avec feedback visuel en temps réel.
