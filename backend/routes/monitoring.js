/**
 * Monitoring Dashboard Routes
 * Provides real-time monitoring of automation jobs
 */

import express from 'express';
import db from '../config/database.js';

const router = express.Router();

/**
 * GET /api/monitoring/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboard stats' 
    });
  }
});

/**
 * GET /api/monitoring/jobs
 * Get recent automation jobs with pagination
 */
router.get('/jobs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status; // 'pending', 'completed', 'failed'

    let query = `
      SELECT 
        job_id,
        automation_type,
        video_id,
        video_title,
        status,
        started_at,
        completed_at,
        duration_ms,
        platforms_enabled,
        results,
        steps_details,
        progress_percentage
      FROM automation_logs
    `;

    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY started_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [jobs] = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM automation_logs';
    if (status) {
      countQuery += ' WHERE status = ?';
    }
    
    const [countResult] = await db.query(
      countQuery, 
      status ? [status] : []
    );

    res.json({
      success: true,
      data: {
        jobs: jobs.map(job => ({
          ...job,
          results: typeof job.results === 'string' 
            ? JSON.parse(job.results) 
            : job.results,
          platforms_enabled: typeof job.platforms_enabled === 'string'
            ? JSON.parse(job.platforms_enabled)
            : job.platforms_enabled,
          steps_details: typeof job.steps_details === 'string'
            ? JSON.parse(job.steps_details)
            : job.steps_details
        })),
        total: countResult[0].total,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch jobs' 
    });
  }
});

/**
 * GET /api/monitoring/job/:jobId
 * Get detailed information about a specific job
 */
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    const [jobs] = await db.query(
      'SELECT * FROM automation_logs WHERE job_id = ?',
      [jobId]
    );

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const job = jobs[0];

    // Get platform publications for this job
    const [publications] = await db.query(
      'SELECT * FROM platform_publications WHERE job_id = ?',
      [jobId]
    );

    res.json({
      success: true,
      data: {
        ...job,
        results: typeof job.results === 'string' 
          ? JSON.parse(job.results) 
          : job.results,
        platforms_enabled: typeof job.platforms_enabled === 'string'
          ? JSON.parse(job.platforms_enabled)
          : job.platforms_enabled,
        publications: publications.map(pub => ({
          ...pub,
          metadata: typeof pub.metadata === 'string'
            ? JSON.parse(pub.metadata)
            : pub.metadata
        }))
      }
    });
  } catch (error) {
    console.error('Job detail error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch job details' 
    });
  }
});

/**
 * GET /api/monitoring/videos
 * Get recent published videos
 */
router.get('/videos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [videos] = await db.query(
      `SELECT * FROM videos 
       ORDER BY published_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json({
      success: true,
      data: videos.map(video => ({
        ...video,
        tags: typeof video.tags === 'string'
          ? JSON.parse(video.tags)
          : video.tags
      }))
    });
  } catch (error) {
    console.error('Videos fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch videos' 
    });
  }
});

/**
 * GET /api/monitoring/stats/platform/:platform
 * Get statistics for a specific platform
 */
router.get('/stats/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;

    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        AVG(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as success_rate
       FROM platform_publications
       WHERE platform = ?`,
      [platform]
    );

    const [recent] = await db.query(
      `SELECT * FROM platform_publications
       WHERE platform = ?
       ORDER BY published_at DESC
       LIMIT 10`,
      [platform]
    );

    res.json({
      success: true,
      data: {
        platform,
        stats: stats[0],
        recent: recent.map(pub => ({
          ...pub,
          metadata: typeof pub.metadata === 'string'
            ? JSON.parse(pub.metadata)
            : pub.metadata
        }))
      }
    });
  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch platform stats' 
    });
  }
});

/**
 * Helper: Get dashboard statistics
 */
async function getDashboardStats() {
  // Total jobs
  const [totalJobs] = await db.query(
    'SELECT COUNT(*) as total FROM automation_logs'
  );

  // Jobs by status
  const [jobsByStatus] = await db.query(
    `SELECT 
      status,
      COUNT(*) as count
     FROM automation_logs
     GROUP BY status`
  );

  // Success rate (last 30 days)
  const [successRate] = await db.query(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
     FROM automation_logs
     WHERE started_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`
  );

  // Average duration
  const [avgDuration] = await db.query(
    `SELECT AVG(duration_ms) as avg_duration
     FROM automation_logs
     WHERE status = 'completed' AND duration_ms IS NOT NULL`
  );

  // Platform statistics
  const [platformStats] = await db.query(
    `SELECT 
      platform,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
     FROM platform_publications
     GROUP BY platform`
  );

  // Recent activity (last 7 days)
  const [recentActivity] = await db.query(
    `SELECT 
      DATE(started_at) as date,
      COUNT(*) as jobs,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
     FROM automation_logs
     WHERE started_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     GROUP BY DATE(started_at)
     ORDER BY date DESC`
  );

  // Total videos
  const [totalVideos] = await db.query(
    'SELECT COUNT(*) as total FROM videos'
  );

  return {
    totalJobs: totalJobs[0].total,
    jobsByStatus: jobsByStatus.reduce((acc, row) => {
      acc[row.status] = row.count;
      return acc;
    }, {}),
    successRate: successRate[0].total > 0
      ? (successRate[0].completed / successRate[0].total * 100).toFixed(2)
      : 0,
    avgDuration: avgDuration[0].avg_duration 
      ? Math.round(avgDuration[0].avg_duration)
      : 0,
    platformStats,
    recentActivity,
    totalVideos: totalVideos[0].total,
    lastUpdate: new Date().toISOString()
  };
}

/**
 * GET /api/monitoring/automation/status
 * Get current automation status
 */
router.get('/automation/status', (req, res) => {
  try {
    const status = {
      enabled: process.env.AUTOMATION_ENABLED === 'true',
      dryRun: process.env.AUTOMATION_DRY_RUN === 'true',
      schedule: process.env.AUTOMATION_CRON_SCHEDULE || '*/15 * * * *',
      startDate: process.env.AUTOMATION_START_DATE || 'N/A',
      maxResults: process.env.YOUTUBE_MAX_RESULTS || 5
    };
    
    res.json({ success: true, data: status });
  } catch (error) {
    console.error('Automation status error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch automation status' 
    });
  }
});

/**
 * POST /api/monitoring/automation/toggle
 * Toggle automation on/off
 */
router.post('/automation/toggle', async (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'enabled must be a boolean'
      });
    }
    
    // Update .env file
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update AUTOMATION_ENABLED
    const regex = /AUTOMATION_ENABLED=.*/;
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `AUTOMATION_ENABLED=${enabled}`);
    } else {
      envContent += `\nAUTOMATION_ENABLED=${enabled}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    // Update process.env
    process.env.AUTOMATION_ENABLED = enabled.toString();
    
    // Get updated status
    const status = {
      enabled: process.env.AUTOMATION_ENABLED === 'true',
      dryRun: process.env.AUTOMATION_DRY_RUN === 'true',
      schedule: process.env.AUTOMATION_CRON_SCHEDULE || '*/15 * * * *',
      startDate: process.env.AUTOMATION_START_DATE || 'N/A',
      maxResults: process.env.YOUTUBE_MAX_RESULTS || 5
    };
    
    res.json({ 
      success: true, 
      data: status,
      message: enabled ? 'Automation enabled' : 'Automation disabled'
    });
  } catch (error) {
    console.error('Automation toggle error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle automation: ' + error.message
    });
  }
});

/**
 * GET /api/monitoring/jobs/:jobId/details
 * Get detailed information about a specific job including all steps
 */
router.get('/jobs/:jobId/details', async (req, res) => {
  try {
    const [job] = await db.query(
      `SELECT 
        job_id,
        automation_type,
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

    // Remove raw JSON fields
    delete jobData.steps_details;
    delete jobData.platforms_enabled;

    res.json({ success: true, data: jobData });
  } catch (error) {
    console.error('Job details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job details'
    });
  }
});

export default router;
