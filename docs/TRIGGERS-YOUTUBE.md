# 🎬 Triggers YouTube - Comment l'Automation Détecte les Vidéos

## ❓ Question : Qu'est-ce qui déclenche l'automation ?

### 📺 Statut des Vidéos YouTube

YouTube a 3 statuts de visibilité :

1. **Privée** 🔒
   - Invisible sur YouTube
   - Accessible uniquement par vous
   - **❌ PAS détectée par l'API**

2. **Non répertoriée** 🔗
   - Visible uniquement avec le lien
   - N'apparaît pas dans les recherches
   - **✅ DÉTECTÉE par l'API** (si vous utilisez `videos.list`)
   - **❌ PAS détectée par `search.list`** (notre cas actuel)

3. **Publique** 🌍
   - Visible par tous
   - Apparaît dans les recherches
   - **✅ DÉTECTÉE par l'API**

---

## 🔍 Notre Configuration Actuelle

### Code dans `youtube.js`

```javascript
const response = await this.youtube.search.list({
  part: 'id,snippet',
  channelId: this.channelId,
  order: 'date',
  type: 'video',
  maxResults: 5,
  publishedAfter: '2025-01-09T00:00:00Z'
});
```

### Ce qui est détecté

✅ **OUI - Détecté :**
- Vidéo publiée en **PUBLIC**
- Date de publication >= 2025-01-09

❌ **NON - Pas détecté :**
- Vidéo en **PRIVÉ**
- Vidéo **NON RÉPERTORIÉE** (avec `search.list`)
- Vidéo publiée avant 2025-01-09

---

## 🎯 Réponse à votre question

### Non-répertorié → Public = Trigger ?

**Avec le code actuel (search.list) :**

**❌ NON** - Une vidéo non-répertoriée n'est PAS détectée par `search.list`.

**Scénario :**
1. Vous publiez une vidéo en **non-répertoriée** à 10h00
   → ❌ Pas détectée
2. Vous la passez en **public** à 11h00
   → ✅ Détectée au prochain scan (max 15 min)

**Mais attention :** La date considérée sera la date de publication **originale** (10h00), pas la date du changement de statut.

---

## 🔧 Solutions pour Détecter les Non-Répertoriées

### Option A : Utiliser `playlistItems.list` (Recommandé)

Les vidéos "Uploads" incluent TOUTES les vidéos (public + non-répertorié) :

```javascript
// Récupérer l'ID de la playlist "Uploads"
const channelResponse = await youtube.channels.list({
  part: 'contentDetails',
  id: channelId
});

const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

// Lister toutes les vidéos uploadées (y compris non-répertoriées)
const response = await youtube.playlistItems.list({
  part: 'snippet,status',
  playlistId: uploadsPlaylistId,
  maxResults: 5
});

// Filtrer par privacyStatus
videos.filter(v => v.status.privacyStatus === 'public' || v.status.privacyStatus === 'unlisted');
```

### Option B : Utiliser `videos.list` avec des IDs

Si vous connaissez les IDs des vidéos, vous pouvez les interroger directement :

```javascript
const response = await youtube.videos.list({
  part: 'snippet,status',
  id: 'VIDEO_ID_1,VIDEO_ID_2,VIDEO_ID_3'
});
```

---

## ⏱️ Fréquence de Détection

### Configuration Actuelle

```env
AUTOMATION_CRON_SCHEDULE=*/15 * * * *
```

**Vérifie YouTube toutes les 15 minutes**

### Timeline Exemple

```
10:00 → Vidéo publiée en PUBLIC
10:05 → Scan automatique (détectée ✅)
10:06 → Transcription commence
10:15 → Génération du contenu
10:20 → Publication Twitter (si DRY_RUN=false)
```

**Délai maximum :** 15 minutes entre la publication et la détection

---

## 📋 Recommandations

### Pour Détecter Immédiatement

**Option 1 : Réduire la fréquence**
```env
AUTOMATION_CRON_SCHEDULE=*/5 * * * *  # Toutes les 5 minutes
```

**Option 2 : Webhooks YouTube (Avancé)**
- YouTube PubSubHubbub
- Notification instantanée
- Plus complexe à implémenter

**Option 3 : Bouton manuel "Forcer un scan"**
- Ajouter un bouton dans le dashboard
- Lance un scan immédiat
- Utile après publication

---

## 🎬 Workflow de Publication Recommandé

### Pour Publier une Vidéo

**Méthode 1 : Public Direct**
1. Uploadez la vidéo en **PUBLIC**
2. L'automation la détecte dans les 15 minutes
3. Traitement automatique

**Méthode 2 : Non-Répertorié puis Public**
1. Uploadez en **NON-RÉPERTORIÉ**
2. Vérifiez la vidéo (titre, description, etc.)
3. Passez en **PUBLIC**
4. L'automation la détecte dans les 15 minutes

**Méthode 3 : Programmation YouTube**
1. Uploadez en **PRIVÉ**
2. Programmez la publication (YouTube native)
3. À l'heure programmée → devient PUBLIC
4. L'automation la détecte automatiquement

---

## 🔄 Ce qui Déclenche Concrètement

### Conditions TOUTES Requises

1. ✅ **Automation activée**
   ```env
   AUTOMATION_ENABLED=true
   ```

2. ✅ **Vidéo PUBLIQUE**
   - Statut : `public` (pas `private` ou `unlisted` avec search.list)

3. ✅ **Date >= Start Date**
   ```env
   AUTOMATION_START_DATE=2025-01-09
   ```

4. ✅ **Pas déjà traitée**
   - Vérifié dans la base `videos` par `youtube_id`

5. ✅ **Dans les X résultats**
   ```env
   YOUTUBE_MAX_RESULTS=5
   ```

---

## 💡 En Résumé

| Scénario | Détecté ? | Délai |
|----------|-----------|-------|
| Vidéo publiée en PUBLIC | ✅ OUI | Max 15 min |
| Vidéo en NON-RÉPERTORIÉ | ❌ NON (avec search.list) | - |
| Non-répertorié → Public | ✅ OUI (après passage en public) | Max 15 min |
| Vidéo en PRIVÉ | ❌ NON | - |
| Privé → Public | ✅ OUI | Max 15 min |
| Vidéo < 2025-01-09 | ❌ NON (filtre date) | - |

---

## 🎯 Modifications Suggérées

### 1. Détecter les Non-Répertoriées

Je peux modifier le code pour utiliser `playlistItems.list` au lieu de `search.list`.

**Avantages :**
- ✅ Détecte public + non-répertorié
- ✅ Plus fiable

**Inconvénients :**
- Consomme légèrement plus de quota API

### 2. Ajouter un Bouton "Scan Maintenant"

Dans le dashboard, ajouter un bouton pour forcer un scan immédiat sans attendre les 15 minutes.

---

**Voulez-vous que je modifie le code pour détecter aussi les vidéos non-répertoriées ?** 🎬
