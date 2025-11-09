/**
 * Dashboard Detailed View - Multi-Automation Support
 * Handles YouTube to Social and future automation types
 */

const API_BASE = window.location.origin + '/api';
let currentAutomationType = 'youtube_to_social';

// Automation type configurations
const AUTOMATION_CONFIGS = {
    youtube_to_social: {
        name: 'YouTube → Social',
        icon: '🎬',
        steps: [
            { key: 'transcription', icon: '🎙️', label: 'Transcription' },
            { key: 'llm_analysis', icon: '🤖', label: 'Analyse IA' },
            { key: 'tweet', icon: '📝', label: 'Tweet' },
            { key: 'thread', icon: '🧵', label: 'Thread' },
            { key: 'images', icon: '🖼️', label: 'Images' },
            { key: 'twitter', icon: '🐦', label: 'Twitter' },
            { key: 'website', icon: '🌐', label: 'Site Web' },
            { key: 'email', icon: '📧', label: 'Email' }
        ]
    }
    // Future: instagram_reels, tiktok_videos, etc.
};

// Render step icons inline
function renderStepIcons(steps, automationType) {
    const config = AUTOMATION_CONFIGS[automationType] || AUTOMATION_CONFIGS.youtube_to_social;
    
    return config.steps.map(stepConfig => {
        const step = steps?.[stepConfig.key] || {};
        const status = step.status || 'pending';
        
        let cssClass = 'step-pending';
        let display = stepConfig.icon;
        
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
        
        return `<span class="step-icon ${cssClass}" title="${stepConfig.label}: ${status}">${display}</span>`;
    }).join('');
}

// Show job details modal
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

// Render job detail modal
function renderJobDetailModal(job) {
    const modal = document.getElementById('job-detail-modal');
    const content = document.getElementById('modal-detail-content');
    
    const automationType = job.automation_type || 'youtube_to_social';
    const config = AUTOMATION_CONFIGS[automationType];
    const steps = job.steps || {};
    
    content.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">
                <h2>${config.icon} ${job.video_title || 'Sans titre'}</h2>
                <p class="modal-subtitle">
                    Job ID: ${job.job_id} • ${formatDate(job.started_at)}
                </p>
            </div>
            <div style="text-align: right;">
                <div class="status-badge status-${job.status}">${job.status}</div>
                <div style="margin-top: 8px; color: #718096;">
                    ⏱️ ${formatDuration(job.duration_ms)}
                </div>
            </div>
        </div>

        <div class="progress-container" style="margin: 20px 0;">
            <div class="progress-bar" style="width: 100%; height: 12px;">
                <div class="progress-fill" style="width: ${job.progress_percentage || 0}%"></div>
            </div>
            <p style="text-align: center; margin-top: 8px; color: #718096; font-size: 14px;">
                Progression: ${job.progress_percentage || 0}%
            </p>
        </div>

        <div class="timeline">
            ${renderTimeline(steps, config)}
        </div>

        <div style="margin-top: 32px; text-align: right;">
            <button class="refresh-btn" onclick="closeJobDetail()">Fermer</button>
        </div>
    `;
    
    modal.classList.add('active');
}

// Render timeline
function renderTimeline(steps, config) {
    return config.steps.map(stepConfig => {
        const step = steps[stepConfig.key] || { status: 'pending' };
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
            details += `<div><a href="${step.url}" target="_blank" style="color: #667eea;">Voir →</a></div>`;
        }
        if (step.error) {
            details += `<div style="color: #e74c3c; margin-top: 4px;">❌ ${step.error}</div>`;
        }
        if (step.reason && step.status === 'skipped') {
            details += `<div style="color: #95a5a6;">Raison: ${step.reason}</div>`;
        }
        
        return `
            <div class="timeline-item">
                <div class="timeline-dot ${statusClass}">${stepConfig.icon}</div>
                <div class="timeline-content">
                    <h3>${stepConfig.label}</h3>
                    <div class="timeline-details">
                        ${details || `Status: ${translateStatus(step.status || 'pending')}`}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Close modal
function closeJobDetail() {
    document.getElementById('job-detail-modal').classList.remove('active');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format duration
function formatDuration(ms) {
    if (!ms) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
        return `${minutes}min ${remainingSeconds}s`;
    }
    return `${seconds}s`;
}

// Translate status
function translateStatus(status) {
    const translations = {
        'pending': 'En attente',
        'in_progress': 'En cours',
        'completed': 'Terminé',
        'failed': 'Échec',
        'skipped': 'Sauté'
    };
    return translations[status] || status;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-container');
    if (errorDiv) {
        errorDiv.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 8px; margin: 12px 0;">${message}</div>`;
        setTimeout(() => errorDiv.innerHTML = '', 5000);
    }
}

// Load jobs for current automation type
async function loadJobs() {
    try {
        const response = await fetch(`${API_BASE}/monitoring/jobs?limit=20`);
        const data = await response.json();
        
        if (!data.success) {
            showError('Erreur lors du chargement des jobs');
            return;
        }
        
        renderJobsTable(data.data.jobs);
    } catch (error) {
        showError('Erreur: ' + error.message);
    }
}

// Render jobs table
function renderJobsTable(jobs) {
    const tbody = document.getElementById('jobs-tbody');
    
    if (!jobs || jobs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 32px; color: #718096;">Aucun job trouvé</td></tr>';
        return;
    }
    
    tbody.innerHTML = jobs.map(job => {
        const automationType = job.automation_type || 'youtube_to_social';
        const config = AUTOMATION_CONFIGS[automationType];
        const steps = job.steps_details ? JSON.parse(job.steps_details) : {};
        
        return `
            <tr onclick="showJobDetails('${job.job_id}')">
                <td>
                    <div style="font-weight: 600; color: #2d3748; margin-bottom: 4px;">
                        ${config.icon} ${job.video_title || 'Sans titre'}
                    </div>
                    <div style="font-size: 12px; color: #718096;">
                        ${formatDate(job.started_at)}
                    </div>
                </td>
                <td>
                    <div class="step-icons">
                        ${renderStepIcons(steps, automationType)}
                    </div>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${job.progress_percentage || 0}%"></div>
                    </div>
                    <div style="font-size: 11px; color: #718096; margin-top: 4px;">
                        ${job.progress_percentage || 0}%
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${job.status}">${job.status}</span>
                </td>
                <td style="color: #718096; font-size: 14px;">
                    ${formatDuration(job.duration_ms)}
                </td>
            </tr>
        `;
    }).join('');
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    
    // Refresh every 30 seconds
    setInterval(loadJobs, 30000);
    
    // Close modal on background click
    document.getElementById('job-detail-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'job-detail-modal') {
            closeJobDetail();
        }
    });
});
