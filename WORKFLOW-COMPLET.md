# 🎬 Workflow Complet d'Automatisation - Le Trousseau

> Système d'automatisation IA pour **Le Trousseau** - Association artistique

## 🎯 Comptes concernés

- **YouTube** : [@LeTrousseau-en-video](https://www.youtube.com/@LeTrousseau-en-video)
- **Instagram** : [@letrousseau_en_video](https://www.instagram.com/letrousseau_en_video/)
- **Twitter** : [@Le_Trousseau_](https://x.com/Le_Trousseau_)
- **Site web** : [asso-letrousseau.com](https://www.asso-letrousseau.com)
- **Newsletter** : Abonnés via le site

---

## 📊 Vue d'ensemble

```
┌───────────────────────────────────────────────────────────────┐
│                   NOUVELLE VIDÉO YOUTUBE                      │
│                    (Détection automatique)                    │
└─────────────────────────┬─────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │   ÉTAPE 1 : EXTRACTION              │
        │   ─────────────────────             │
        │   • Métadonnées vidéo               │
        │   • Transcription audio → texte     │
        │   • Téléchargement vidéo source    │
        └─────────────┬───────────────────────┘
                      │
        ┌─────────────┼───────────────┐
        │             │               │
        ▼             ▼               ▼
┌──────────┐  ┌──────────────┐  ┌─────────────┐
│TRANSCRIP │  │  CLIPPAGE    │  │ SCREENSHOTS │
│  TION    │  │   VIDÉO      │  │   & FRAMES  │
│          │  │              │  │             │
│ Whisper  │  │ FFmpeg       │  │  FFmpeg     │
│ API      │  │ 10-60s clips │  │  Moments    │
│          │  │ Formats:     │  │  clés       │
│          │  │ • 9:16       │  │             │
│          │  │ • 1:1        │  │             │
│          │  │ • 16:9       │  │             │
└────┬─────┘  └──────┬───────┘  └──────┬──────┘
     │               │                  │
     └───────────────┼──────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────┐
        │   ÉTAPE 2 : ANALYSE IA              │
        │   ──────────────────                │
        │   • Résumé intelligent              │
        │   • Identification moments clés     │
        │   • Génération de tags/hashtags     │
        │   • Analyse du ton                  │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   ÉTAPE 3 : GÉNÉRATION CONTENU      │
        │   ──────────────────────            │
        │   LLM adaptatif par plateforme      │
        └─────────────┬───────────────────────┘
                      │
        ┌─────────────┼─────────────┬──────────────┬──────────────┐
        │             │             │              │              │
        ▼             ▼             ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ TWITTER  │  │INSTAGRAM │  │ TIKTOK   │  │SNAPCHAT  │  │ WEBSITE  │
│ THREAD   │  │CARROUSEL │  │ CLIP     │  │  STORY   │  │ ARTICLE  │
│          │  │+ REELS   │  │          │  │          │  │          │
│3-10 tweets│ │+ STORY   │  │Clip vert │  │Clip vert │  │Blog post │
│Ton adapté│  │Multi-img │  │15-60s    │  │10s       │  │SEO opt   │
│Link fin  │  │          │  │          │  │          │  │          │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │              │              │
     ▼             ▼             ▼              ▼              ▼
┌────────────────────────────────────────────────────────────────┐
│                   ÉTAPE 4 : PUBLICATION                        │
│                   ───────────────────                          │
│   • Publication principale immédiate                           │
│   • Planning diffusion clips (étalé sur plusieurs jours)       │
│   • Ajout au thread épinglé Twitter                           │
│   • Newsletter (si activée)                                    │
└────────────────────────┬───────────────────────────────────────┘
                         │
                         ▼
        ┌─────────────────────────────────────┐
        │   ÉTAPE 5 : MONITORING              │
        │   ──────────────────                │
        │   • Logs détaillés                  │
        │   • Métriques de performance        │
        │   • Alertes en cas d'échec          │
        └─────────────────────────────────────┘
```

---

## 🔄 Workflow détaillé par phase

### Phase 1 : Détection & Extraction (5-10 min)

```javascript
{
  "trigger": "YouTube video published",
  "videoId": "dQw4w9WgXcQ",
  "actions": [
    "Download video (yt-dlp)",
    "Extract audio",
    "Transcribe with Whisper API",
    "Extract metadata",
    "Store in database"
  ],
  "outputs": {
    "transcription": "Texte complet...",
    "metadata": {...},
    "videoFile": "/tmp/video_id.mp4"
  }
}
```

### Phase 2 : Clippage & Visuels (10-15 min)

```javascript
{
  "input": "Transcription + Video file",
  "analysis": {
    "keyMoments": [
      { "start": "00:30", "end": "00:45", "description": "Hook principal" },
      { "start": "05:20", "end": "05:50", "description": "Point clé #1" },
      { "start": "12:10", "end": "12:35", "description": "Conclusion" }
    ]
  },
  "clips": [
    {
      "id": "clip_1",
      "duration": 15,
      "formats": {
        "vertical": "/clips/clip_1_9x16.mp4",
        "square": "/clips/clip_1_1x1.mp4",
        "landscape": "/clips/clip_1_16x9.mp4"
      },
      "caption": "Generated by LLM",
      "hashtags": ["tag1", "tag2"]
    }
  ],
  "screenshots": [
    { "timestamp": "00:35", "path": "/screens/thumb_1.jpg" },
    { "timestamp": "05:25", "path": "/screens/thumb_2.jpg" }
  ]
}
```

### Phase 3 : Génération de Contenu Adaptatif

#### Twitter Thread (adaptatif)

```javascript
{
  "videoLength": "15min",
  "contentDensity": "high",
  "threadSize": 7,  // Auto-calculé
  "tweets": [
    {
      "order": 1,
      "text": "🎬 [Hook accrocheur basé sur transcription]\n\nJe vous explique [sujet] en 15min 👇",
      "media": ["screenshot_1.jpg"]
    },
    {
      "order": 2,
      "text": "1/ [Premier point développé]\n\n[2-3 phrases clés extraites]"
    },
    // ... tweets 3-6 générés selon contenu
    {
      "order": 7,
      "text": "7/ [Conclusion + CTA]\n\nVidéo complète 👇\nhttps://youtu.be/dQw4w9WgXcQ"
    }
  ],
  "pinnedThreadAction": {
    "method": "addToExisting",
    "pinnedThreadId": "1234567890",
    "newTweetText": "🆕 [Titre vidéo] - [Date]"
  }
}
```

#### Instagram Carrousel

```javascript
{
  "type": "carousel",
  "slides": [
    {
      "order": 1,
      "type": "image",
      "source": "youtube_thumbnail",
      "overlay": {
        "text": "NOUVELLE VIDÉO",
        "style": "brand"
      }
    },
    {
      "order": 2,
      "type": "image",
      "source": "screenshot_key_moment_1"
    },
    {
      "order": 3,
      "type": "video_clip",
      "source": "clip_1_square.mp4",
      "duration": 15
    }
  ],
  "caption": "[Légende Instagram adaptée]",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "location": null
}
```

#### Instagram Story Sequence

```javascript
{
  "stories": [
    {
      "order": 1,
      "type": "image",
      "source": "generated_story_template.jpg",
      "text": "NOUVELLE VIDÉO 🎬",
      "stickers": [
        { "type": "countdown", "endsIn": "24h" }
      ]
    },
    {
      "order": 2,
      "type": "video",
      "source": "clip_1_vertical.mp4",
      "link": "https://youtu.be/..."
    }
  ]
}
```

### Phase 4 : Plan de Diffusion

```javascript
{
  "mainPublication": {
    "immediate": true,
    "platforms": ["website", "newsletter"],
    "timestamp": "2025-01-08T15:00:00Z"
  },
  "socialMedia": {
    "delay": "30min",  // Après publication principale
    "platforms": ["twitter", "instagram"],
    "timestamp": "2025-01-08T15:30:00Z"
  },
  "clipsSchedule": [
    {
      "clipId": "clip_1",
      "platforms": ["tiktok", "instagram_reels"],
      "scheduledFor": "2025-01-09T10:00:00Z",
      "caption": "Extrait #1 : [Description]"
    },
    {
      "clipId": "clip_2",
      "platforms": ["tiktok", "snapchat"],
      "scheduledFor": "2025-01-10T14:00:00Z",
      "caption": "Extrait #2 : [Description]"
    },
    {
      "clipId": "clip_3",
      "platforms": ["instagram_reels"],
      "scheduledFor": "2025-01-11T18:00:00Z",
      "caption": "Extrait #3 : [Description]"
    }
  ],
  "stories": {
    "frequency": "daily",
    "duration": "3_days",
    "schedule": [
      {
        "day": 1,
        "platforms": ["instagram", "snapchat"],
        "content": "story_1"
      },
      {
        "day": 2,
        "platforms": ["instagram"],
        "content": "story_2_reminder"
      },
      {
        "day": 3,
        "platforms": ["snapchat"],
        "content": "story_3_last_chance"
      }
    ]
  }
}
```

---

## 🎯 Critères de décision automatiques

### Longueur du Thread Twitter

```javascript
function calculateThreadLength(video) {
  const baseLength = 3; // Minimum
  const factors = {
    duration: video.duration > 900 ? 2 : 1,  // +2 si > 15min
    transcriptionLength: Math.ceil(video.transcription.length / 5000),
    keyPoints: Math.ceil(video.keyMoments.length / 2)
  };
  
  return Math.min(
    baseLength + factors.duration + factors.transcriptionLength + factors.keyPoints,
    12  // Maximum 12 tweets
  );
}
```

### Nombre de Clips à générer

```javascript
function determineClipsCount(video) {
  if (video.duration < 300) return 1;  // < 5min : 1 clip
  if (video.duration < 900) return 2;  // 5-15min : 2 clips
  if (video.duration < 1800) return 3; // 15-30min : 3 clips
  return 4;  // > 30min : 4 clips max
}
```

### Type de contenu Instagram

```javascript
function selectInstagramFormat(video, clips, screenshots) {
  const hasGoodClips = clips.filter(c => c.quality > 0.7).length > 0;
  const hasMultipleScreenshots = screenshots.length >= 3;
  
  if (hasGoodClips && hasMultipleScreenshots) {
    return {
      feed: "carousel",  // Miniature + screenshots + clip
      reels: clips[0],   // Meilleur clip
      story: "sequence"  // Multiple stories
    };
  } else if (hasGoodClips) {
    return {
      feed: "single_image",  // Miniature uniquement
      reels: clips[0],
      story: "single"
    };
  } else {
    return {
      feed: "single_image",
      reels: null,
      story: "static"
    };
  }
}
```

---

## 💾 Structure de données en base

### Table `video_processing`

```sql
CREATE TABLE video_processing (
  id VARCHAR(36) PRIMARY KEY,
  video_id VARCHAR(50) NOT NULL,
  job_id VARCHAR(100) NOT NULL,
  
  -- Transcription
  transcription_text LONGTEXT,
  transcription_provider ENUM('whisper', 'youtube', 'assemblyai'),
  transcription_language VARCHAR(10),
  transcription_duration INT,
  
  -- Summary
  summary TEXT,
  key_moments JSON,
  
  -- Files
  video_file_path VARCHAR(500),
  clips JSON,
  screenshots JSON,
  generated_images JSON,
  
  -- Status
  status ENUM('pending', 'transcribing', 'clipping', 'generating', 'completed', 'failed'),
  error_message TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (job_id) REFERENCES automation_logs(job_id)
);
```

### Table `scheduled_posts`

```sql
CREATE TABLE scheduled_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id VARCHAR(36) NOT NULL,
  platform ENUM('twitter', 'instagram', 'tiktok', 'snapchat', 'instagram_reels', 'instagram_story'),
  content_type ENUM('clip', 'image', 'story', 'post'),
  content_path VARCHAR(500),
  caption TEXT,
  scheduled_for DATETIME NOT NULL,
  status ENUM('pending', 'published', 'failed') DEFAULT 'pending',
  published_at DATETIME,
  platform_post_id VARCHAR(200),
  error_message TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (video_id) REFERENCES videos(id),
  INDEX idx_scheduled_for (scheduled_for, status)
);
```

---

## 🛠️ Outils & Technologies

| Composant | Technologie | Fonction |
|-----------|-------------|----------|
| Transcription | Whisper API / YouTube API | Audio → Texte |
| Téléchargement | yt-dlp | Récupération vidéo source |
| Clippage | FFmpeg | Extraction segments vidéo |
| Screenshots | FFmpeg | Extraction frames |
| Génération d'images | DALL-E 3 / Stable Diffusion | Visuels pour stories |
| Analyse & Contenu | GPT-4 / Claude | Threads, captions, articles |
| Scheduling | BullMQ + Redis | File d'attente et planification |
| Stockage | S3 / MinIO | Clips et images |

---

## ⏱️ Temps d'exécution estimés

| Étape | Durée | Dépend de |
|-------|-------|-----------|
| Détection vidéo | < 1 min | Polling interval |
| Téléchargement | 2-5 min | Longueur vidéo |
| Transcription | 3-10 min | Longueur vidéo |
| Clippage | 5-15 min | Nombre de clips |
| Analyse IA | 2-5 min | Complexité |
| Génération contenu | 3-8 min | Nombre de plateformes |
| Publication | 2-5 min | Nombre de plateformes |
| **TOTAL** | **17-48 min** | Configuration |

**Note** : Le workflow s'exécute en arrière-plan, aucune intervention manuelle nécessaire.

---

## 📈 KPIs de succès

- ✅ **Taux de réussite** : > 95% des vidéos traitées sans erreur
- ✅ **Délai de publication** : < 1h après publication YouTube
- ✅ **Qualité des clips** : Score > 0.7 (évaluation IA)
- ✅ **Engagement Twitter** : Thread complet publié avec lien
- ✅ **Cohérence tonale** : Match à 85%+ avec historique compte
- ✅ **Couverture plateformes** : 100% des plateformes actives

---

**Version** : 2.0.0  
**Dernière mise à jour** : 2025-01-08
