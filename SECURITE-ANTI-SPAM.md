# 🔒 Sécurité Anti-Spam et Anti-Doublons

## 🎯 Protections en place

### 1. Protection contre les doublons

#### Base de données (table `videos`)
```sql
CREATE UNIQUE INDEX idx_youtube_id ON videos(youtube_id);
```

**Mécanisme** :
- Chaque vidéo YouTube a un ID unique
- Avant de traiter une vidéo, le système vérifie si elle existe déjà
- Si elle existe → **IGNORÉE**
- Impossible d'avoir deux fois la même vidéo

#### Logs d'automatisation (table `automation_logs`)
```sql
SELECT * FROM automation_logs WHERE video_id = ? AND status = 'completed'
```

**Mécanisme** :
- Chaque job a un ID unique avec l'ID de la vidéo
- Double vérification avant de lancer un nouveau job

---

### 2. Protection contre les anciennes vidéos

#### Filtre par date (`AUTOMATION_START_DATE`)
```bash
# Dans .env
AUTOMATION_START_DATE=2025-01-09
```

**Comportement** :
- Seules les vidéos publiées **après cette date** seront traitées
- Les anciennes vidéos de votre chaîne sont **ignorées automatiquement**

**Configuration recommandée** :
- Mettez la date du jour de mise en prod
- Ou mettez une date dans le passé si vous voulez traiter certaines anciennes vidéos

#### Limite de résultats (`YOUTUBE_MAX_RESULTS`)
```bash
# Dans .env
YOUTUBE_MAX_RESULTS=5
```

**Comportement** :
- Maximum de 5 vidéos récupérées par vérification (toutes les 15 min)
- Protection contre un traitement massif accidentel

---

### 3. Protection contre la publication accidentelle

#### Mode dry-run (simulation)
```bash
# Dans .env
AUTOMATION_DRY_RUN=true
```

**Comportement avec dry-run activé** :
- ✅ Détection des vidéos
- ✅ Transcription et analyse
- ✅ Génération de contenu
- ✅ Logs complets
- ❌ **AUCUNE publication réelle** sur Twitter/Instagram/etc.

**Parfait pour tester sans risque !**

#### Plateformes désactivables individuellement
```bash
TWITTER_ENABLED=true      # Publier sur Twitter
INSTAGRAM_ENABLED=false   # Ne PAS publier sur Instagram
NEWSLETTER_ENABLED=false  # Ne PAS envoyer de newsletter
```

---

### 4. Validation du contenu avant publication

#### Vérification automatique
```javascript
// Avant de publier un tweet
function validateTweetContent(content) {
  // Vérifier longueur
  if (content.length > 280) {
    throw new Error('Tweet trop long');
  }
  
  // Vérifier qu'il y a du contenu
  if (!content.trim()) {
    throw new Error('Tweet vide');
  }
  
  // Vérifier qu'il y a un lien YouTube
  if (!content.includes('youtu.be') && !content.includes('youtube.com')) {
    logger.warning('Pas de lien YouTube dans le tweet');
  }
  
  return true;
}
```

#### Review manuel (optionnel)
Vous pouvez activer un mode "approval requis" :
```bash
AUTOMATION_REQUIRE_APPROVAL=true
```

**Comportement** :
- Le contenu est généré
- Stocké dans la DB avec status `pending_approval`
- Vous recevez une notification (email/webhook)
- Vous approuvez via le dashboard
- Seulement après → publication

---

## 🛡️ Scénarios protégés

### Scénario 1 : Backend arrêté pendant 2 jours
**Situation** : Vous publiez 3 vidéos pendant que le backend est off

**Ce qui se passe au redémarrage** :
1. Le backend vérifie YouTube
2. Trouve 3 nouvelles vidéos (max 5 grâce à `YOUTUBE_MAX_RESULTS`)
3. Vérifie la DB → aucune n'existe
4. Les 3 vidéos sont traitées séquentiellement
5. Publications créées pour les 3

**Protection** : Limite de 5 vidéos max, pas de spam massif

---

### Scénario 2 : Redémarrage accidentel du backend
**Situation** : Le backend crash et redémarre 5 fois en 1 heure

**Ce qui se passe** :
1. À chaque redémarrage, vérifie YouTube
2. Trouve les mêmes vidéos
3. Vérifie la DB → **déjà traitées**
4. **Aucune action**, juste des logs

**Protection** : Vérification DB avant tout traitement

---

### Scénario 3 : Anciennes vidéos sur la chaîne
**Situation** : Vous avez 50 vidéos déjà sur YouTube avant l'activation du bot

**Ce qui se passe au premier lancement** :
1. `AUTOMATION_START_DATE=2025-01-09` est configuré
2. YouTube API filtre les vidéos : `publishedAfter=2025-01-09`
3. Seules les vidéos publiées **après le 9 janvier 2025** sont récupérées
4. Les 50 anciennes vidéos sont **ignorées**

**Protection** : Filtre par date côté API YouTube

---

### Scénario 4 : Contenu généré incorrect
**Situation** : L'IA génère un tweet bizarre ou trop long

**Ce qui se passe** :
1. Validation automatique du contenu
2. Si invalide → **erreur, pas de publication**
3. Log dans `automation_logs` avec status `failed`
4. Vous recevez une alerte (si configuré)
5. Vous pouvez corriger et relancer manuellement

**Protection** : Validation stricte avant publication

---

## 📊 Dashboard de monitoring

### Vue en temps réel
- Status de chaque job (pending, completed, failed)
- Détails des publications par plateforme
- Erreurs et warnings
- Historique complet

### Indicateurs de sécurité
- Nombre de doublons évités
- Vidéos ignorées (anciennes)
- Taux de succès par plateforme
- Rate limits restants

---

## 🚨 Mode d'urgence : Arrêt d'urgence

### Arrêter immédiatement l'automatisation
```bash
# Sur le VPS
pm2 stop letrousseau-api

# Ou dans .env
AUTOMATION_ENABLED=false
```

### Rollback d'une publication
Si un tweet a été publié par erreur :
1. Le supprimer manuellement sur Twitter
2. Marquer le job comme `failed` dans la DB
3. Ajuster les filtres pour éviter que ça se reproduise

---

## ✅ Checklist avant la mise en production

- [ ] `AUTOMATION_START_DATE` configuré à la date du jour
- [ ] `YOUTUBE_MAX_RESULTS=5` (ou moins)
- [ ] Tester en `AUTOMATION_DRY_RUN=true` d'abord
- [ ] Vérifier que les threads Twitter existent
- [ ] Vérifier que `TWITTER_PINNED_THREAD_ID` est correct
- [ ] Surveiller les premiers jobs dans le dashboard
- [ ] Configurer des alertes (email/webhook) pour les erreurs

---

## 🎯 Recommandations

### Phase de test (1-2 semaines)
```bash
AUTOMATION_ENABLED=true
AUTOMATION_DRY_RUN=true          # Simulation uniquement
TWITTER_ENABLED=true
INSTAGRAM_ENABLED=false           # Désactiver Instagram au début
NEWSLETTER_ENABLED=false          # Désactiver newsletter au début
```

### Phase de production
```bash
AUTOMATION_ENABLED=true
AUTOMATION_DRY_RUN=false         # Publication réelle
AUTOMATION_START_DATE=2025-01-09 # Date de démarrage
YOUTUBE_MAX_RESULTS=5            # Limite de sécurité
TWITTER_ENABLED=true
INSTAGRAM_ENABLED=true
NEWSLETTER_ENABLED=true
```

---

## 📞 En cas de problème

1. **Arrêter l'automatisation** : `AUTOMATION_ENABLED=false`
2. **Consulter les logs** : `pm2 logs letrousseau-api`
3. **Vérifier le dashboard** : http://localhost:3001/monitoring/monitoring.html
4. **Vérifier la DB** : Table `automation_logs` pour les détails

---

**Système sécurisé** : Multiples couches de protection contre les doublons, le spam et les erreurs ! 🛡️
