[DEPRECATED] Ce document est archivé. Référez-vous à SETUP-ADMIN-DASHBOARD.md et ADMIN-DASHBOARD-COMPLETE.md pour l'état actuel.

# 📊 Tableau de Workflow Détaillé - Proposition UI

## 🎯 Objectif

Afficher **toutes les étapes** du workflow pour chaque vidéo YouTube détectée.

---

## 📋 Structure Proposée

### Colonnes du Tableau

| # | Colonne | Icône | États Possibles | Couleur |
|---|---------|-------|-----------------|---------|
| 1 | **Vidéo** | 🎬 | Titre + lien | - |
| 2 | **Détection** | 📡 | Détectée / En cours | Gris/Vert |
| 3 | **Transcription** | 🎙️ | ⏳ En attente / ✅ Terminée / ❌ Échec | Gris/Vert/Rouge |
| 4 | **Analyse LLM** | 🤖 | ⏳ En attente / ✅ Terminée / ❌ Échec | Gris/Vert/Rouge |
| 5 | **Tweet Généré** | 📝 | ⏳ Non / ✅ Généré / ❌ Échec | Gris/Vert/Rouge |
| 6 | **Thread Généré** | 🧵 | ⏳ Non / ✅ Généré (X tweets) / ❌ Échec | Gris/Vert/Rouge |
| 7 | **Images** | 🖼️ | ⏳ Non / ✅ Générées (X images) / ❌ Échec | Gris/Vert/Rouge |
| 8 | **Twitter** | 🐦 | ⏳ Non publié / ✅ Publié / 🧪 Simulé | Gris/Vert/Bleu |
| 9 | **Site Web** | 🌐 | ⏳ Non / ✅ Publié / ❌ Échec | Gris/Vert/Rouge |
| 10 | **Email** | 📧 | ⏳ Non / ✍️ Rédigé / ✅ Envoyé / ❌ Échec | Gris/Jaune/Vert/Rouge |
| 11 | **Status Global** | 📊 | 🔄 En cours / ✅ Terminé / ⚠️ Partiel / ❌ Échec | - |
| 12 | **Durée** | ⏱️ | Temps total | - |

---

## 🎨 Proposition Visuelle 1 : Tableau Complet

### Layout Desktop

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Vidéo                     │ 🎙️ │ 🤖 │ 📝 │ 🧵 │ 🖼️ │ 🐦 │ 🌐 │ 📧 │ Status  │ Durée │ Actions                     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🎬 Le Trousseau - EP01    │ ✅  │ ✅  │ ✅  │ ✅  │ ✅  │ ✅  │ ✅  │ ✅  │ ✅ OK   │ 12min │ 👁️ Voir │ 🔄 Relancer           │
│ youtube.com/watch?v=abc   │     │     │     │ 3  │ 2  │     │     │     │         │       │                             │
│ 📅 09/01/2025 14:30       │     │     │     │     │     │     │     │     │         │       │                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🎬 Interview Artiste      │ ✅  │ ✅  │ ✅  │ ✅  │ ⏳  │ 🧪  │ ⏳  │ ⏳  │ 🔄 Cours│ 8min  │ 👁️ Voir │ ⚠️ Images en cours    │
│ youtube.com/watch?v=def   │     │     │     │ 5  │ 0  │ DRY │     │     │         │       │                             │
│ 📅 09/01/2025 15:45       │     │     │     │     │     │     │     │     │         │       │                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 🎬 Nouveau Concert        │ ✅  │ ✅  │ ❌  │ ❌  │ ❌  │ ❌  │ ❌  │ ❌  │ ❌ Échec│ 2min  │ 👁️ Voir │ 🔄 Relancer tout      │
│ youtube.com/watch?v=ghi   │     │     │ ERR │     │     │     │     │     │         │       │                             │
│ 📅 09/01/2025 16:00       │     │     │     │     │     │     │     │     │         │       │                             │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

Légende:
✅ Terminé  │  ⏳ En attente  │  ❌ Échec  │  🧪 Simulé (DRY RUN)  │  🔄 En cours
```

---

## 🎨 Proposition Visuelle 2 : Cards avec Timeline

### Layout Plus Moderne

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🎬 Le Trousseau - Episode 01                          ✅ Terminé │ ⏱️ 12min 30s │
│ 📅 Publié le 09/01/2025 à 14:30                      youtube.com/watch?v=abc123  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ Timeline de Traitement:                                                          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                                  │
│ 1. 🎙️ Transcription      ✅ 14:31 → 14:35 (4min)                               │
│    └─ 1,245 mots · 12 minutes de contenu                                        │
│                                                                                  │
│ 2. 🤖 Analyse LLM         ✅ 14:35 → 14:38 (3min)                               │
│    └─ Sujets: musique, création, atelier                                        │
│                                                                                  │
│ 3. 📝 Génération          ✅ 14:38 → 14:40 (2min)                               │
│    ├─ Tweet principal: ✅                                                        │
│    ├─ Thread (5 tweets): ✅                                                      │
│    └─ Images (3): ✅                                                             │
│                                                                                  │
│ 4. 🚀 Publication                                                                │
│    ├─ 🐦 Twitter: ✅ Publié (14:42)                                             │
│    │   └─ twitter.com/Le_Trousseau_/status/123456789                            │
│    ├─ 🌐 Site Web: ✅ Publié (14:43)                                            │
│    │   └─ asso-letrousseau.com/videos/episode-01                                │
│    └─ 📧 Email: ✅ Envoyé à 245 abonnés (14:45)                                 │
│                                                                                  │
│ [ 👁️ Voir les détails ]  [ 🔄 Relancer ]  [ 📊 Voir les stats ]              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🎬 Interview avec Un Artiste                      🔄 En cours │ ⏱️ 8min 12s     │
│ 📅 Publié le 09/01/2025 à 15:45                      youtube.com/watch?v=def456  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ Progression: ████████████████░░░░░░░░  65%                                      │
│                                                                                  │
│ 1. 🎙️ Transcription      ✅ Terminée                                            │
│ 2. 🤖 Analyse LLM         ✅ Terminée                                            │
│ 3. 📝 Tweet Généré        ✅ Généré                                              │
│ 4. 🧵 Thread Généré       ✅ 5 tweets générés                                    │
│ 5. 🖼️ Images              🔄 Génération en cours... (1/3 terminée)              │
│ 6. 🐦 Twitter             🧪 Mode DRY RUN (simulation uniquement)                │
│ 7. 🌐 Site Web            ⏳ En attente des images                               │
│ 8. 📧 Email               ⏳ En attente de la publication                        │
│                                                                                  │
│ [ 👁️ Voir ce qui est généré ]  [ ⏸️ Mettre en pause ]                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Structure de Données (Backend)

### Table `automation_logs` - Extensions Proposées

```sql
ALTER TABLE automation_logs ADD COLUMN steps_details JSON;

-- Exemple de contenu JSON:
{
  "detection": {
    "status": "completed",
    "timestamp": "2025-01-09T14:30:00Z"
  },
  "transcription": {
    "status": "completed",
    "timestamp": "2025-01-09T14:35:00Z",
    "duration_ms": 240000,
    "word_count": 1245,
    "audio_duration_seconds": 720
  },
  "llm_analysis": {
    "status": "completed",
    "timestamp": "2025-01-09T14:38:00Z",
    "duration_ms": 180000,
    "topics": ["musique", "création", "atelier"],
    "sentiment": "positive"
  },
  "content_generation": {
    "tweet": {
      "status": "completed",
      "timestamp": "2025-01-09T14:39:00Z",
      "content": "🎬 Nouveau épisode..."
    },
    "thread": {
      "status": "completed",
      "timestamp": "2025-01-09T14:40:00Z",
      "tweet_count": 5
    },
    "images": {
      "status": "completed",
      "timestamp": "2025-01-09T14:40:30Z",
      "count": 3,
      "urls": ["https://...", "https://...", "https://..."]
    }
  },
  "publications": {
    "twitter": {
      "status": "published",
      "timestamp": "2025-01-09T14:42:00Z",
      "tweet_id": "123456789",
      "url": "https://twitter.com/Le_Trousseau_/status/123456789"
    },
    "website": {
      "status": "published",
      "timestamp": "2025-01-09T14:43:00Z",
      "url": "https://asso-letrousseau.com/videos/episode-01"
    },
    "email": {
      "status": "sent",
      "timestamp": "2025-01-09T14:45:00Z",
      "recipients_count": 245,
      "campaign_id": "camp_123"
    }
  }
}
```

---

## 🎨 Proposition Visuelle 3 : Vue Condensée avec Icônes

### Pour Afficher Plus de Vidéos

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Vidéo                              │ Pipeline                      │ Status     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🎬 Le Trousseau - EP01             │ ✅✅✅✅✅✅✅✅                │ ✅ Terminé  │
│ 📅 09/01 14:30 │ ⏱️ 12min          │ 🎙️🤖📝🧵🖼️🐦🌐📧           │            │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🎬 Interview Artiste               │ ✅✅✅✅🔄⏳⏳⏳                │ 🔄 Cours   │
│ 📅 09/01 15:45 │ ⏱️ 8min           │ 🎙️🤖📝🧵🖼️🧪⏳⏳           │ 65%        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 🎬 Nouveau Concert                 │ ✅✅❌❌❌❌❌❌                │ ❌ Échec    │
│ 📅 09/01 16:00 │ ⏱️ 2min           │ 🎙️🤖❌⏳⏳⏳⏳⏳           │            │
└─────────────────────────────────────────────────────────────────────────────────┘

Légende: 🎙️Transcription 🤖LLM 📝Tweet 🧵Thread 🖼️Images 🐦Twitter 🌐Site 📧Email
```

---

## 💡 Recommandation Finale

### Approche Hybride (Meilleure UX)

**Vue Liste (Par défaut)**
- Tableau condensé avec icônes
- Affiche 10-20 vidéos
- Vue d'ensemble rapide

**Vue Détail (Au clic)**
- Card avec timeline complète
- Tous les détails de chaque étape
- Boutons d'action

**Filtres**
- Status : Tous / En cours / Terminé / Échec
- Date : Dernières 24h / 7 jours / 30 jours
- Plateforme : Toutes / Twitter / Site / Email

---

## 🚀 Implémentation Proposée

### Étape 1 : Backend - Enrichir les Logs

Modifier l'orchestrateur pour logger chaque étape :

```javascript
// Dans automation/orchestrator.js
async function processVideo(video) {
  const jobId = generateJobId();
  const stepsDetails = {};
  
  // 1. Transcription
  stepsDetails.transcription = await logStep('transcription', async () => {
    return await transcriptionService.transcribe(video);
  });
  
  // 2. LLM
  stepsDetails.llm_analysis = await logStep('llm', async () => {
    return await llmService.analyze(transcript);
  });
  
  // 3. Contenu
  stepsDetails.content_generation = {
    tweet: await logStep('tweet', () => contentService.generateTweet()),
    thread: await logStep('thread', () => contentService.generateThread()),
    images: await logStep('images', () => imageService.generate())
  };
  
  // 4. Publications
  stepsDetails.publications = {
    twitter: await logStep('twitter', () => twitterService.post()),
    website: await logStep('website', () => websiteService.publish()),
    email: await logStep('email', () => emailService.send())
  };
  
  // Sauvegarder
  await db.query(
    'UPDATE automation_logs SET steps_details = ? WHERE job_id = ?',
    [JSON.stringify(stepsDetails), jobId]
  );
}
```

### Étape 2 : API - Endpoint Détaillé

```javascript
// GET /api/monitoring/jobs/:jobId/details
router.get('/jobs/:jobId/details', async (req, res) => {
  const job = await db.query(
    'SELECT * FROM automation_logs WHERE job_id = ?',
    [req.params.jobId]
  );
  
  res.json({
    success: true,
    data: {
      ...job[0],
      steps: JSON.parse(job[0].steps_details)
    }
  });
});
```

### Étape 3 : Frontend - Nouveau Composant

```javascript
// Composant DetailedJobCard
function DetailedJobCard({ job }) {
  const steps = job.steps_details;
  
  return (
    <div className="job-card-detailed">
      <JobHeader job={job} />
      <Timeline>
        <Step icon="🎙️" name="Transcription" data={steps.transcription} />
        <Step icon="🤖" name="Analyse LLM" data={steps.llm_analysis} />
        <Step icon="📝" name="Tweet" data={steps.content_generation.tweet} />
        <Step icon="🧵" name="Thread" data={steps.content_generation.thread} />
        <Step icon="🖼️" name="Images" data={steps.content_generation.images} />
        <Step icon="🐦" name="Twitter" data={steps.publications.twitter} />
        <Step icon="🌐" name="Site" data={steps.publications.website} />
        <Step icon="📧" name="Email" data={steps.publications.email} />
      </Timeline>
      <Actions job={job} />
    </div>
  );
}
```

---

## 🎯 Priorités

1. **Phase 1 (Essentiel)** ✅
   - Colonnes : Transcription, LLM, Tweet/Thread, Twitter, Status
   - Vue tableau condensée
   - Icônes + couleurs

2. **Phase 2 (Améliorations)**
   - Images, Site Web, Email
   - Vue détail au clic
   - Timeline

3. **Phase 3 (Avancé)**
   - Filtres et recherche
   - Export CSV
   - Graphiques

---

**Quelle approche préférez-vous ?**

A) Vue condensée avec icônes (rapide à implémenter)
B) Cards avec timeline (plus visuel mais plus complexe)
C) Hybride (liste + détail au clic) - **RECOMMANDÉ**
