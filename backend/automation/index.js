/**
 * Automation Service - Main Entry Point
 * Orchestrates YouTube video detection and multi-platform publication
 */

import cron from 'node-cron';
import Logger from './utils/logger.js';
import YouTubeService from './services/youtube.js';
import JobProcessor from './queue/jobProcessor.js';

const logger = new Logger('AutomationMain');

class AutomationService {
  constructor(database) {
    this.db = database;
    this.youtubeService = new YouTubeService();
    this.jobProcessor = new JobProcessor(database);
    this.isRunning = false;
    this.cronJob = null;

    logger.info('Automation service created');
  }

  /**
   * Start the automation service
   * @param {object} options - Configuration options
   */
  async start(options = {}) {
    try {
      logger.info('🚀 Starting automation service...');

      // Test connections
      await this._testConnections();

      // Setup cron job for polling (default: every 15 minutes)
      const cronSchedule = options.cronSchedule || '*/15 * * * *';
      this.setupPolling(cronSchedule);

      this.isRunning = true;
      logger.success('✨ Automation service started successfully');
      logger.info(`📅 Polling schedule: ${cronSchedule}`);
    } catch (error) {
      logger.error('Failed to start automation service', error);
      throw error;
    }
  }

  /**
   * Stop the automation service
   */
  stop() {
    logger.info('Stopping automation service...');
    
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }

    this.isRunning = false;
    logger.success('Automation service stopped');
  }

  /**
   * Setup polling for new YouTube videos
   * @param {string} cronSchedule - Cron schedule expression
   */
  setupPolling(cronSchedule) {
    logger.info('Setting up YouTube polling', { schedule: cronSchedule });

    this.cronJob = cron.schedule(cronSchedule, async () => {
      await this.checkForNewVideos();
    });

    this.cronJob.start();
    logger.success('Polling configured successfully');
  }

  /**
   * Manually check for new videos
   */
  async checkForNewVideos() {
    if (!this.isRunning) {
      logger.warning('Service is not running');
      return;
    }

    try {
      logger.info('🔍 Checking for new YouTube videos...');

      const newVideos = await this.youtubeService.checkForNewVideos();

      if (newVideos.length === 0) {
        logger.info('No new videos found');
        return;
      }

      logger.success(`Found ${newVideos.length} new video(s)`, {
        titles: newVideos.map(v => v.title)
      });

      // Process each new video
      for (const video of newVideos) {
        try {
          logger.info(`Processing video: ${video.title}`);
          const result = await this.jobProcessor.processVideoAutomation(video);
          
          logger.success('Video processed successfully', {
            jobId: result.jobId,
            status: result.status
          });
        } catch (error) {
          logger.error(`Failed to process video: ${video.title}`, error);
        }
      }
    } catch (error) {
      logger.error('Failed to check for new videos', error);
    }
  }

  /**
   * Process a specific video by ID (manual trigger)
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<object>} Processing result
   */
  async processVideo(videoId) {
    try {
      logger.info('Manually processing video', { videoId });

      // Get video details
      const videoData = await this.youtubeService.getVideoDetails(videoId);

      // Process automation
      const result = await this.jobProcessor.processVideoAutomation(videoData);

      return result;
    } catch (error) {
      logger.error('Failed to process video manually', error);
      throw error;
    }
  }

  /**
   * Get job status
   * @param {string} jobId - Job ID
   * @returns {Promise<object>} Job status
   */
  async getJobStatus(jobId) {
    return await this.jobProcessor.getJobStatus(jobId);
  }

  /**
   * Test all service connections
   * @private
   */
  async _testConnections() {
    logger.info('Testing service connections...');

    const tests = [
      { name: 'LLM', test: () => this.jobProcessor.llmService.testConnection() },
      { name: 'Twitter', test: () => this.jobProcessor.twitterService.testConnection() },
      { name: 'Instagram', test: () => this.jobProcessor.instagramService.testConnection() },
      { name: 'Website', test: () => this.jobProcessor.websiteService.testConnection() }
    ];

    const results = {};

    for (const { name, test } of tests) {
      try {
        results[name] = await test();
        if (results[name]) {
          logger.success(`✓ ${name} connection OK`);
        } else {
          logger.warning(`✗ ${name} connection failed`);
        }
      } catch (error) {
        logger.warning(`✗ ${name} connection error: ${error.message}`);
        results[name] = false;
      }
    }

    const allPassed = Object.values(results).every(r => r === true);
    
    if (!allPassed) {
      logger.warning('Some service connections failed, but continuing...');
    } else {
      logger.success('All service connections successful');
    }

    return results;
  }

  /**
   * Get service status
   * @returns {object} Status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      hasPolling: this.cronJob !== null,
      cronSchedule: this.cronJob ? 'active' : 'inactive'
    };
  }
}

export default AutomationService;
