# 🔑 Comment récupérer votre YouTube Channel ID

Pour configurer l'automatisation, vous avez besoin du **Channel ID** de votre chaîne YouTube.

## Votre chaîne
**URL** : https://www.youtube.com/@LeTrousseau-en-video

---

## Méthode 1 : Via les paramètres YouTube (la plus simple)

1. Connectez-vous à YouTube avec le compte **Le Trousseau**
2. Allez sur [YouTube Studio](https://studio.youtube.com)
3. Cliquez sur **Paramètres** (icône engrenage en bas à gauche)
4. Cliquez sur **Chaîne** dans le menu de gauche
5. Sous "Informations de base", vous verrez votre **ID de chaîne**
   - Format : `UCxxxxxxxxxxxxxxxxxx` (24 caractères)

---

## Méthode 2 : Via le code source de la page

1. Allez sur https://www.youtube.com/@LeTrousseau-en-video
2. Faites clic droit → **Afficher le code source de la page**
3. Cherchez (Ctrl+F) : `"channelId"`
4. Vous trouverez : `"channelId":"UCxxxxxxxxxxxxxxxxxx"`

---

## Méthode 3 : Via une extension Chrome

1. Installez l'extension [YouTube Channel ID Finder](https://chrome.google.com/webstore/detail/youtube-channel-id-finder/...)
2. Allez sur votre chaîne YouTube
3. L'extension affiche automatiquement l'ID

---

## Méthode 4 : Via l'API Google (pour développeurs)

```bash
# Si vous avez déjà une clé API YouTube
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=LeTrousseau-en-video&key=YOUR_API_KEY"
```

---

## ⚙️ Où utiliser le Channel ID ?

Une fois récupéré, ajoutez-le dans votre fichier `.env` :

```bash
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxx
```

**Important** : 
- L'ID commence toujours par `UC`
- Il fait exactement 24 caractères
- Il ne change jamais (contrairement au @ qui peut être modifié)

---

## ✅ Test de validation

Pour vérifier que votre Channel ID est correct :

```bash
# Remplacez YOUR_API_KEY et YOUR_CHANNEL_ID
curl "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY"
```

Vous devriez recevoir les informations de votre chaîne **Le Trousseau**.

---

**Note** : Une fois configuré, le système vérifiera automatiquement cette chaîne toutes les 15 minutes pour détecter les nouvelles vidéos.
