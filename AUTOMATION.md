# 🤖 Système d'Automatisation Multi-Plateforme - Le Trousseau

> Service d'automatisation IA pour **Le Trousseau** - Publication cross-platform automatique

## 🎯 Comptes Le Trousseau

- **YouTube** : [@LeTrousseau-en-video](https://www.youtube.com/@LeTrousseau-en-video)
- **Instagram** : [@letrousseau_en_video](https://www.instagram.com/letrousseau_en_video/)
- **Twitter** : [@Le_Trousseau_](https://x.com/Le_Trousseau_)
- **Site web** : [asso-letrousseau.com](https://www.asso-letrousseau.com)
- **Newsletter** : Abonnés via formulaire site web

## 📋 Vue d'ensemble

Ce système automatise entièrement la publication de contenu lorsque vous publiez une vidéo sur YouTube :

1. **Détection** : Surveillance automatique de votre chaîne YouTube
2. **Génération** : Création de contenus adaptés via LLM (GPT-4/Claude)
3. **Publication** : Diffusion simultanée sur Twitter, Instagram, site web, newsletter
4. **Suivi** : Logs détaillés et monitoring de chaque publication

### 🎯 Objectifs

- ✅ Zéro intervention manuelle pour la publication cross-platform
- ✅ Contenus optimisés pour chaque plateforme (ton, longueur, format)
- ✅ Cohérence de la brand identity
- ✅ Gain de temps massif (de 2h à 2 minutes par vidéo)
- ✅ Extensible pour d'autres triggers (Instagram → Twitter, etc.)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUTUBE (Source)                         │
│                Nouvelle vidéo publiée                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   YouTube Service             │
        │   - Webhook (PubSubHubbub)    │
        │   - Polling (fallback)        │
        │   - Extract metadata          │
        └───────────┬───────────────────┘
                    │
                    ▼
        ┌───────────────────────────────┐
        │   Job Processor               │
        │   - Orchestration workflow    │
        │   - Error handling            │
        │   - Database logging          │
        └───────────┬───────────────────┘
                    │
                    ▼
        ┌───────────────────────────────┐
        │   LLM Service                 │
        │   - Generate Twitter post     │
        │   - Generate Instagram caption│
        │   - Generate story text       │
        │   - Generate blog article     │
        │   - Generate newsletter       │
        └───────────┬───────────────────┘
                    │
                    ▼
     ┌──────────────┴──────────────┐
     │    Publication Services      │
     └──────────────┬──────────────┘
                    │
        ┌───────────┼───────────┬─────────────┬──────────┐
        ▼           ▼           ▼             ▼          ▼
    ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐
    │Twitter │ │Instagram│ │Instagram│ │Newsletter│ │Website │
    │        │ │  Post   │ │  Story  │ │          │ │        │
    └────────┘ └────────┘ └─────────┘ └──────────┘ └────────┘
```

---

## 📁 Structure des fichiers

```
backend/
├── automation/
│   ├── index.js                    # Point d'entrée principal
│   ├── config/
│   │   ├── platforms.js           # Configuration plateformes
│   │   └── prompts.js             # Templates LLM
│   ├── services/
│   │   ├── youtube.js             # Détection vidéos YouTube
│   │   ├── llm.js                 # Génération contenu IA
│   │   ├── twitter.js             # Publication Twitter
│   │   ├── instagram.js           # Publication Instagram
│   │   ├── newsletter.js          # Envoi newsletters
│   │   └── website.js             # Publication site web
│   ├── queue/
│   │   └── jobProcessor.js        # Orchestration jobs
│   └── utils/
│       ├── logger.js              # Logs structurés
│       └── errors.js              # Erreurs personnalisées
├── controllers/
│   └── videosController.js        # CRUD vidéos
└── routes/
    └── videos.js                  # Routes API vidéos
```

---

## ⚙️ Configuration

### 1. Variables d'environnement

Créez un fichier `.env` avec toutes les clés API nécessaires :

```bash
# YouTube
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxx

# LLM Provider
LLM_PROVIDER=openai  # ou 'anthropic'
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Twitter
TWITTER_ENABLED=true
TWITTER_API_KEY=...
TWITTER_API_SECRET=...
TWITTER_ACCESS_TOKEN=...
TWITTER_ACCESS_SECRET=...

# Instagram
INSTAGRAM_ENABLED=true
INSTAGRAM_ACCESS_TOKEN=...
INSTAGRAM_BUSINESS_ACCOUNT_ID=...

# Newsletter
NEWSLETTER_ENABLED=true
NEWSLETTER_PROVIDER=brevo
BREVO_API_KEY=...
BREVO_LIST_ID=...

# Automation
AUTOMATION_ENABLED=true
AUTOMATION_CRON_SCHEDULE=*/15 * * * *
```

### 2. Base de données

Exécutez le script SQL pour créer les tables :

```bash
mysql -u root -p letrousseau_db < sql/create-automation-tables.sql
```

Tables créées :
- `videos` : Stocke les vidéos publiées
- `automation_logs` : Logs des jobs d'automatisation
- `platform_publications` : Suivi des publications par plateforme
- `generated_content_cache` : Cache des contenus générés

### 3. Installation des dépendances

```bash
cd backend
npm install
```

Nouvelles dépendances :
- `googleapis` : YouTube Data API
- `openai` : OpenAI GPT-4
- `@anthropic-ai/sdk` : Claude (alternatif)
- `twitter-api-v2` : Twitter API v2
- `node-cron` : Scheduler cron jobs

---

## 🚀 Utilisation

### Démarrage du service

Le service d'automatisation démarre automatiquement avec le serveur :

```bash
npm start
```

Logs au démarrage :
```
✅ Le Trousseau API Server
==========================
🚀 Server running on port 3001
🌍 Environment: production
📊 Database: Connected
🤖 Automation: Enabled
📅 Polling schedule: */15 * * * *
```

### Désactiver l'automatisation

Pour démarrer le serveur sans automatisation :

```bash
AUTOMATION_ENABLED=false npm start
```

---

## 📊 Workflow détaillé

### 1. Détection de nouvelle vidéo

**Méthode 1 : Webhook (recommandé)**
- YouTube envoie une notification via PubSubHubbub
- Temps réel (quelques secondes après publication)
- Nécessite URL publique

**Méthode 2 : Polling (fallback)**
- Vérification périodique (toutes les 15 min par défaut)
- Plus de latence mais fonctionne partout
- Configuré via `AUTOMATION_CRON_SCHEDULE`

### 2. Extraction des métadonnées

```javascript
{
  id: "dQw4w9WgXcQ",
  title: "Titre de la vidéo",
  description: "Description complète...",
  thumbnailUrl: "https://i.ytimg.com/...",
  tags: ["tag1", "tag2"],
  duration: "PT5M30S",
  publishedAt: "2025-01-08T12:00:00Z",
  statistics: {
    viewCount: 1000,
    likeCount: 50,
    commentCount: 10
  }
}
```

### 3. Génération de contenu (LLM)

Pour chaque plateforme, le LLM génère un contenu adapté :

**Twitter (280 caractères)**
```json
{
  "text": "🎥 Nouvelle vidéo : [Titre accrocheur] ✨\n\nDécouvrez [teaser court]... 🔗\n\n#Tag1 #Tag2 #Tag3\n\nhttps://youtu.be/...",
  "hashtags": ["Tag1", "Tag2", "Tag3"]
}
```

**Instagram (2200 caractères)**
```json
{
  "caption": "🎬 [Hook accrocheur]\n\n[Développement 2-3 paragraphes]\n\n✨ [Call to action]\n\n🔗 Lien en bio\n\n#hashtag1 #hashtag2 ...",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "firstComment": "Commentaire optionnel"
}
```

**Instagram Story**
```json
{
  "text": "Nouvelle vidéo ! 🎥\nSwipe up ⬆️",
  "sticker": "countdown",
  "callToAction": "Voir maintenant"
}
```

**Article Blog (HTML)**
```json
{
  "title": "Titre optimisé SEO",
  "metaDescription": "Meta description 160 caractères",
  "body": "<h2>Introduction</h2><p>...</p>...",
  "keywords": ["mot-clé1", "mot-clé2"]
}
```

**Newsletter (Email HTML)**
```json
{
  "subject": "Nouvelle vidéo : [Titre]",
  "preheader": "Teaser court...",
  "body": "<html>...</html>",
  "cta": {
    "text": "Regarder maintenant",
    "url": "https://youtu.be/..."
  }
}
```

### 4. Publication multi-plateforme

Publication séquentielle pour éviter les rate limits :

1. **Website** (prioritaire) → Ajoute la vidéo à la section vidéos
2. **Twitter** → Publie le tweet avec hashtags
3. **Instagram Feed** → Post avec miniature YouTube
4. **Instagram Story** → Story temporaire (24h)
5. **Newsletter** → Email à la liste d'abonnés

### 5. Logging et monitoring

Chaque job est tracé dans `automation_logs` :

```sql
SELECT 
  job_id,
  status,
  video_title,
  duration_ms,
  started_at,
  completed_at
FROM automation_logs
ORDER BY started_at DESC
LIMIT 10;
```

---

## 🔌 API Endpoints

### Déclencher manuellement un job

```bash
POST /api/automation/trigger
Content-Type: application/json

{
  "videoId": "dQw4w9WgXcQ"
}
```

Réponse :
```json
{
  "success": true,
  "data": {
    "jobId": "job_1704715200000_abc123",
    "status": "completed",
    "duration": 45230,
    "results": {
      "website": { "success": true, "url": "..." },
      "twitter": { "success": true, "tweetId": "..." },
      "instagram": { "success": true, "postId": "..." },
      "instagramStory": { "success": true, "storyId": "..." },
      "newsletter": { "success": true, "messageId": "..." }
    }
  }
}
```

### Vérifier le statut d'un job

```bash
GET /api/automation/status/:jobId
```

### Forcer une vérification manuelle

```bash
GET /api/automation/check-now
```

---

## 🎨 Personnalisation des prompts

Les prompts LLM sont dans `backend/automation/config/prompts.js`.

Exemple de personnalisation pour Twitter :

```javascript
export const PLATFORM_PROMPTS = {
  TWITTER: {
    system: `Tu es [VOTRE TON DE MARQUE].
Règles spécifiques :
- Utilise toujours un emoji en début de tweet
- Maximum 2 hashtags
- Ton engageant et authentique
`,
    user: (videoData) => `
Génère un tweet pour cette vidéo :
Titre : ${videoData.title}
...
`
  }
}
```

---

## 🔐 Sécurité

### Clés API

- ✅ Toutes les clés stockées dans `.env` (jamais commité)
- ✅ Variables chiffrées sur le VPS
- ✅ Rate limiting sur endpoints d'automatisation
- ✅ Authentification par `X-API-Key` header

### Permissions requises

**YouTube API** : Lecture seule
**Twitter API** : Essential+ access (tweet, media upload)
**Instagram API** : Business account + Facebook App
**LLM APIs** : Pay-as-you-go (budget alerts recommandés)

---

## 📈 Monitoring et logs

### Consulter les logs

```bash
# Logs temps réel
pm2 logs letrousseau-api

# Logs automation uniquement
pm2 logs letrousseau-api | grep "AutomationMain"

# Derniers jobs
mysql -u root -p letrousseau_db -e "
  SELECT job_id, status, video_title, duration_ms
  FROM automation_logs
  ORDER BY started_at DESC
  LIMIT 20;
"
```

### Métriques importantes

- **Taux de succès** : Jobs completed / total jobs
- **Durée moyenne** : Moyenne de `duration_ms`
- **Erreurs par plateforme** : Analyser `results` JSON
- **Rate limits** : Surveiller erreurs 429

---

## 🐛 Dépannage

### L'automatisation ne démarre pas

1. Vérifier `AUTOMATION_ENABLED=true` dans `.env`
2. Vérifier les credentials API (YouTube, LLM)
3. Consulter les logs : `pm2 logs`

### Aucune vidéo détectée

1. Vérifier `YOUTUBE_CHANNEL_ID` est correct
2. Tester manuellement : `GET /api/automation/check-now`
3. Vérifier quota YouTube API : https://console.cloud.google.com

### Erreur LLM

1. Vérifier crédit API (OpenAI/Anthropic)
2. Tester connexion : Voir logs de test au démarrage
3. Réduire `maxTokens` si erreur de limite

### Échec publication Twitter

1. Vérifier permissions API (Essential+ minimum)
2. Respecter rate limits (300 tweets / 3h)
3. Vérifier que le compte n'est pas suspendu

### Échec publication Instagram

1. Vérifier que c'est un **Business Account**
2. L'image doit être une URL publique (HTTPS)
3. Respecter aspect ratios (0.8 à 1.91)

---

## 🔄 Extension future : Instagram → Twitter

Architecture prévue pour ajouter d'autres triggers :

```javascript
// backend/automation/triggers/instagram.js
class InstagramTrigger {
  async checkForNewPosts() {
    // Detect new Instagram post
    // Generate adapted content for other platforms
    // Publish to Twitter, Twitter, website
  }
}
```

Similaire à YouTube mais déclenché par posts Instagram.

---

## 💰 Coûts estimés

| Service | Coût | Fréquence |
|---------|------|-----------|
| YouTube API | Gratuit | Quota 10K/jour |
| OpenAI GPT-4 | ~$0.03/vidéo | Par vidéo |
| Twitter API | Gratuit | Essential+ |
| Instagram API | Gratuit | Business account requis |
| Brevo (Newsletter) | Gratuit | < 300 emails/jour |

**Coût mensuel estimé** (10 vidéos/mois) : **< $1**

---

## ✅ Checklist de déploiement

- [ ] Créer toutes les tables SQL
- [ ] Configurer toutes les variables `.env`
- [ ] Obtenir YouTube API key
- [ ] Créer Twitter Developer App
- [ ] Convertir Instagram en Business account
- [ ] Configurer service newsletter (Brevo)
- [ ] Tester chaque service individuellement
- [ ] Déployer sur VPS
- [ ] Configurer PM2 pour auto-restart
- [ ] Mettre en place monitoring
- [ ] Tester avec une vraie vidéo

---

## 📞 Support

Pour toute question :
- Consulter les logs : `pm2 logs letrousseau-api`
- Vérifier TASK.md pour bugs connus
- Tester APIs individuellement

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2025-01-08  
**Auteur** : Le Trousseau Team
