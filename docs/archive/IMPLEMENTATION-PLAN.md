[DEPRECATED] Ce document est archivé. Référez-vous à SETUP-ADMIN-DASHBOARD.md et ADMIN-DASHBOARD-COMPLETE.md pour l'état actuel.

# 🚀 Plan d'Implémentation - Vue Hybride Détaillée

## 📋 Résumé

Implémentation d'une vue hybride pour le dashboard de monitoring avec :
- **Liste condensée** avec icônes de statut pour chaque étape
- **Vue détaillée** qui s'ouvre au clic avec timeline complète
- **Tracking en temps réel** de chaque étape du workflow

---

## ✅ Fichiers Créés

### 1. SQL - Structure de Données
**Fichier** : `sql/add-detailed-tracking.sql`

**Modifications** :
```sql
ALTER TABLE automation_logs ADD COLUMN steps_details JSON;
ALTER TABLE automation_logs ADD COLUMN progress_percentage INT;
```

### 2. Backend - Step Tracker
**Fichier** : `backend/automation/utils/stepTracker.js`

**Fonctionnalités** :
- `startStep(stepName)` - Début d'une étape
- `completeStep(stepName, result)` - Fin réussie
- `failStep(stepName, error)` - Échec
- `skipStep(stepName, reason)` - Saut (dry-run)
- Calcul automatique du pourcentage de progression

---

## 🔧 Modifications à Appliquer

### Étape 1 : Appliquer le SQL sur le VPS

```bash
ssh root@168.231.85.181
mysql -u root -p'LeTrousseau2025Root!' letrousseau_automation < /tmp/add-detailed-tracking.sql
```

### Étape 2 : Modifier jobProcessor.js

**Ajouts** :
```javascript
import StepTracker from '../utils/stepTracker.js';

// Dans processVideoAutomation()
const tracker = new StepTracker(jobId, this.db);

// Avant transcription
await tracker.startStep('transcription');
const transcript = await transcriptionService.transcribe(videoData);
await tracker.completeStep('transcription', {
  word_count: transcript.words.length,
  duration_seconds: transcript.duration
});

// Avant LLM
await tracker.startStep('llm_analysis');
const analysis = await llmService.analyze(transcript);
await tracker.completeStep('llm_analysis', {
  topics: analysis.topics,
  sentiment: analysis.sentiment
});

// ... etc pour chaque étape
```

### Étape 3 : Ajouter Route API Détails

**Fichier** : `backend/routes/monitoring.js`

```javascript
router.get('/jobs/:jobId/details', async (req, res) => {
  try {
    const [job] = await db.query(
      `SELECT 
        job_id,
        video_id,
        video_title,
        status,
        started_at,
        completed_at,
        duration_ms,
        progress_percentage,
        steps_details,
        platforms_enabled,
        results,
        error_message
       FROM automation_logs 
       WHERE job_id = ?`,
      [req.params.jobId]
    );

    if (!job[0]) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const jobData = {
      ...job[0],
      steps: job[0].steps_details ? JSON.parse(job[0].steps_details) : {},
      platforms: job[0].platforms_enabled ? JSON.parse(job[0].platforms_enabled) : [],
      results: job[0].results ? JSON.parse(job[0].results) : {}
    };

    res.json({ success: true, data: jobData });
  } catch (error) {
    console.error('Job details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job details'
    });
  }
});
```

### Étape 4 : Modifier le Dashboard HTML

**Nouveau CSS pour les icônes de statut** :

```css
.step-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  margin: 0 2px;
}

.step-completed { background: #d4edda; color: #155724; }
.step-in-progress { background: #fff3cd; color: #856404; animation: blink 1.5s infinite; }
.step-failed { background: #f8d7da; color: #721c24; }
.step-skipped { background: #e2e3e5; color: #383d41; }
.step-pending { background: #f8f9fa; color: #6c757d; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.job-row {
  cursor: pointer;
  transition: background 0.2s;
}

.job-row:hover {
  background: #f0f8ff !important;
}

.job-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.job-detail-modal.active {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-dot {
  position: absolute;
  left: -28px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.timeline-dot.completed { background: #28a745; color: white; }
.timeline-dot.in-progress { background: #ffc107; color: white; }
.timeline-dot.failed { background: #dc3545; color: white; }
.timeline-dot.skipped { background: #6c757d; color: white; }
```

**Nouveau JavaScript pour affichage détaillé** :

```javascript
// Fonction pour afficher les icônes de statut inline
function renderStepIcons(steps) {
  const stepOrder = [
    'transcription',
    'llm_analysis',
    'tweet',
    'thread',
    'images',
    'twitter',
    'website',
    'email'
  ];

  const icons = {
    'transcription': '🎙️',
    'llm_analysis': '🤖',
    'tweet': '📝',
    'thread': '🧵',
    'images': '🖼️',
    'twitter': '🐦',
    'website': '🌐',
    'email': '📧'
  };

  return stepOrder.map(stepName => {
    const step = steps?.[stepName] || {};
    const status = step.status || 'pending';
    const icon = icons[stepName];

    let cssClass = 'step-pending';
    let display = icon;

    switch (status) {
      case 'completed':
        cssClass = 'step-completed';
        display = '✅';
        break;
      case 'in_progress':
        cssClass = 'step-in-progress';
        display = '🔄';
        break;
      case 'failed':
        cssClass = 'step-failed';
        display = '❌';
        break;
      case 'skipped':
        cssClass = 'step-skipped';
        display = '🧪';
        break;
    }

    return `<span class="step-icon ${cssClass}" title="${stepName}: ${status}">${display}</span>`;
  }).join('');
}

// Fonction pour ouvrir le modal de détails
async function showJobDetails(jobId) {
  try {
    const response = await fetch(`${API_BASE}/monitoring/jobs/${jobId}/details`);
    const data = await response.json();

    if (!data.success) {
      showError('Impossible de charger les détails');
      return;
    }

    renderJobDetailModal(data.data);
  } catch (error) {
    showError('Erreur: ' + error.message);
  }
}

// Fonction pour rendre le modal de détails
function renderJobDetailModal(job) {
  const modal = document.getElementById('job-detail-modal');
  const content = document.getElementById('modal-detail-content');

  const steps = job.steps || {};
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 24px;">
      <div>
        <h2 style="margin: 0 0 8px 0;">🎬 ${job.video_title}</h2>
        <p style="color: #6c757d; margin: 0;">
          Job ID: ${job.job_id} • ${formatDate(job.started_at)}
        </p>
      </div>
      <div style="text-align: right;">
        <div class="status status-${job.status}">${job.status}</div>
        <div style="margin-top: 8px; color: #6c757d;">
          ⏱️ ${formatDuration(job.duration_ms)}
        </div>
      </div>
    </div>

    <div class="timeline">
      ${renderTimeline(steps)}
    </div>

    <div style="margin-top: 32px; text-align: right;">
      <button class="btn" onclick="closeJobDetail()">Fermer</button>
    </div>
  `;

  modal.classList.add('active');
}

// Fonction pour rendre la timeline
function renderTimeline(steps) {
  const stepConfigs = [
    { key: 'transcription', icon: '🎙️', label: 'Transcription' },
    { key: 'llm_analysis', icon: '🤖', label: 'Analyse IA' },
    { key: 'tweet', icon: '📝', label: 'Tweet Généré' },
    { key: 'thread', icon: '🧵', label: 'Thread Généré' },
    { key: 'images', icon: '🖼️', label: 'Images Générées' },
    { key: 'twitter', icon: '🐦', label: 'Publication Twitter' },
    { key: 'website', icon: '🌐', label: 'Publication Site' },
    { key: 'email', icon: '📧', label: 'Envoi Email' }
  ];

  return stepConfigs.map(config => {
    const step = steps[config.key] || { status: 'pending' };
    const statusClass = step.status || 'pending';

    let details = '';
    if (step.duration_ms) {
      details += `<div>Durée: ${(step.duration_ms / 1000).toFixed(2)}s</div>`;
    }
    if (step.word_count) {
      details += `<div>${step.word_count} mots</div>`;
    }
    if (step.tweet_count) {
      details += `<div>${step.tweet_count} tweets</div>`;
    }
    if (step.count) {
      details += `<div>${step.count} images</div>`;
    }
    if (step.url) {
      details += `<div><a href="${step.url}" target="_blank">Voir →</a></div>`;
    }
    if (step.error) {
      details += `<div style="color: #dc3545;">Erreur: ${step.error}</div>`;
    }

    return `
      <div class="timeline-item">
        <div class="timeline-dot ${statusClass}">${config.icon}</div>
        <div>
          <strong>${config.label}</strong>
          <div style="color: #6c757d; font-size: 0.9em; margin-top: 4px;">
            ${details || `Status: ${step.status || 'en attente'}`}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function closeJobDetail() {
  document.getElementById('job-detail-modal').classList.remove('active');
}
```

---

## 🎯 Ordre d'Implémentation

### Phase 1 : Backend (30 min)
1. ✅ Créer `stepTracker.js`
2. ⏳ Modifier `jobProcessor.js` pour utiliser le tracker
3. ⏳ Ajouter route `/jobs/:jobId/details`
4. ⏳ Appliquer SQL sur le VPS

### Phase 2 : Frontend (45 min)
1. ⏳ Ajouter CSS pour icônes et modal
2. ⏳ Ajouter fonctions JavaScript
3. ⏳ Modifier affichage de la liste des jobs
4. ⏳ Ajouter modal HTML

### Phase 3 : Déploiement (15 min)
1. ⏳ Tester en local
2. ⏳ Déployer sur VPS
3. ⏳ Vérifier le fonctionnement

---

## 🧪 Test

### Scénario de Test

1. Publier une vidéo YouTube test
2. Observer l'automation en temps réel
3. Cliquer sur un job dans la liste
4. Vérifier que le modal s'ouvre avec timeline
5. Vérifier les icônes de statut
6. Vérifier la barre de progression

---

## 📊 Résultat Attendu

### Vue Liste
```
Vidéo                 │ 🎙️🤖📝🧵🖼️🐦🌐📧 │ Status  │ Durée
Le Trousseau EP01     │ ✅✅✅✅✅✅✅✅      │ ✅ OK   │ 12min
Interview Artiste     │ ✅✅✅✅🔄⏳⏳⏳      │ 🔄 65%  │ 8min
```

### Vue Détail (Modal)
```
┌──────────────────────────────────────────────┐
│ 🎬 Le Trousseau - Episode 01       ✅ Terminé│
│ Job ID: abc123 • 09/01/2025 14:30   ⏱️ 12min│
├──────────────────────────────────────────────┤
│ Timeline:                                     │
│                                               │
│ ● 🎙️ Transcription          ✅              │
│   Durée: 4.2s • 1,245 mots                   │
│                                               │
│ ● 🤖 Analyse IA              ✅              │
│   Durée: 3.1s                                │
│                                               │
│ ● 📝 Tweet Généré            ✅              │
│                                               │
│ ● 🧵 Thread Généré           ✅              │
│   5 tweets                                   │
│                                               │
│ ● 🖼️ Images Générées         ✅              │
│   3 images                                   │
│                                               │
│ ● 🐦 Publication Twitter     ✅              │
│   Voir → twitter.com/...                     │
│                                               │
│ ● 🌐 Publication Site        ✅              │
│   Voir → asso-letrousseau.com/...           │
│                                               │
│ ● 📧 Envoi Email             ✅              │
│   245 destinataires                          │
│                                               │
│                            [ Fermer ]         │
└──────────────────────────────────────────────┘
```

---

## 💾 Fichiers à Déployer

1. `sql/add-detailed-tracking.sql`
2. `backend/automation/utils/stepTracker.js`
3. `backend/automation/queue/jobProcessor.js` (modifié)
4. `backend/routes/monitoring.js` (nouvelle route)
5. `backend/public/monitoring.html` (modifié)

---

**Voulez-vous que je commence l'implémentation maintenant ?** 🚀

Je peux :
- A) Implémenter phase par phase avec déploiement progressif
- B) Tout préparer puis déployer d'un coup
- C) Commencer par une version simplifiée puis enrichir
