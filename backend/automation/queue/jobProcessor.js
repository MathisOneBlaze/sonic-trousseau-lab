/**
 * Job processor for automation tasks
 * Orchestrates the entire workflow from video detection to multi-platform publication
 */

import Logger from '../utils/logger.js';
import { AutomationError } from '../utils/errors.js';
import { AUTOMATION_STATUS } from '../config/platforms.js';
import StepTracker from '../utils/stepTracker.js';

// Services
import YouTubeService from '../services/youtube.js';
import LLMService from '../services/llm.js';
import TwitterService from '../services/twitter.js';
import InstagramService from '../services/instagram.js';
import NewsletterService from '../services/newsletter.js';
import WebsiteService from '../services/website.js';

const logger = new Logger('JobProcessor');

class JobProcessor {
  constructor(database) {
    this.db = database;
    
    // Initialize services
    this.youtubeService = new YouTubeService();
    this.llmService = new LLMService();
    this.twitterService = new TwitterService();
    this.instagramService = new InstagramService();
    this.newsletterService = new NewsletterService();
    this.websiteService = new WebsiteService();

    logger.info('Job processor initialized');
  }

  /**
   * Process a new video automation job
   * @param {object} videoData - YouTube video data
   * @returns {Promise<object>} Processing result
   */
  async processVideoAutomation(videoData) {
    const jobId = this._generateJobId();
    const startTime = Date.now();
    
    // Initialize StepTracker for detailed progress tracking
    const tracker = new StepTracker(this.db, jobId, 'youtube_to_social');

    try {
      logger.job('Starting video automation job', { 
        jobId, 
        videoId: videoData.id,
        title: videoData.title 
      });

      // Log job start
      await this._logJobStart(jobId, videoData);

      // Step 1: Check if video already processed
      const existing = await this.websiteService.checkVideoExists(videoData.id);
      if (existing) {
        logger.warning('Video already processed, skipping', { videoId: videoData.id });
        return {
          jobId,
          status: 'skipped',
          reason: 'already_processed',
          existingId: existing.id
        };
      }

      // Step 2: Transcription (included in LLM service)
      await tracker.startStep('transcription');
      
      // Step 3: Generate content for all platforms with LLM
      await tracker.startStep('llm_analysis');
      logger.job('Generating content with LLM', { jobId });
      await this._updateJobStatus(jobId, AUTOMATION_STATUS.GENERATING);
      
      const generatedContent = await this.llmService.generateAllContent(videoData);
      await tracker.completeStep('llm_analysis');
      await tracker.completeStep('transcription'); // Transcription done as part of LLM
      
      // Track content generation steps
      await tracker.startStep('tweet');
      await tracker.completeStep('tweet', { length: generatedContent.tweet?.length });
      
      await tracker.startStep('thread');
      await tracker.completeStep('thread', { tweet_count: generatedContent.thread?.length });
      
      await tracker.startStep('images');
      await tracker.completeStep('images', { count: generatedContent.images?.length || 0 });

      // Step 4: Publish to all platforms
      logger.job('Publishing to platforms', { jobId });
      await this._updateJobStatus(jobId, AUTOMATION_STATUS.PUBLISHING);

      const publicationResults = await this._publishToAllPlatforms(
        videoData, 
        generatedContent,
        tracker
      );

      // Step 5: Calculate results
      const duration = Date.now() - startTime;
      const successCount = Object.values(publicationResults).filter(r => r.success).length;
      const totalPlatforms = Object.keys(publicationResults).length;
      
      const finalStatus = successCount === totalPlatforms 
        ? AUTOMATION_STATUS.COMPLETED 
        : successCount > 0 
          ? AUTOMATION_STATUS.PARTIAL 
          : AUTOMATION_STATUS.FAILED;

      // Step 6: Log job completion
      await this._logJobCompletion(jobId, {
        status: finalStatus,
        duration,
        results: publicationResults
      });

      logger.success('Video automation job completed', { 
        jobId,
        status: finalStatus,
        duration: `${(duration / 1000).toFixed(2)}s`,
        successRate: `${successCount}/${totalPlatforms}`
      });

      return {
        jobId,
        status: finalStatus,
        duration,
        videoId: videoData.id,
        results: publicationResults,
        summary: {
          total: totalPlatforms,
          successful: successCount,
          failed: totalPlatforms - successCount
        }
      };
    } catch (error) {
      logger.error('Video automation job failed', error);
      
      await this._logJobError(jobId, error);
      
      return {
        jobId,
        status: AUTOMATION_STATUS.FAILED,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Publish to all platforms
   * @private
   */
  async _publishToAllPlatforms(videoData, generatedContent, tracker) {
    const results = {};

    // Publish to Twitter
    await tracker.startStep('twitter');
    try {
      if (generatedContent.TWITTER?.content) {
        results.twitter = await this.twitterService.postTweet(
          generatedContent.TWITTER.content
        );
        await tracker.completeStep('twitter', { tweet_id: results.twitter.id });
      } else {
        await tracker.skipStep('twitter', 'No Twitter content generated');
      }
    } catch (error) {
      logger.warning('Twitter publication failed', error);
      results.twitter = { success: false, error: error.message };
      await tracker.failStep('twitter', error.message);
    }

    // Publish to website (highest priority)
    await tracker.startStep('website');
    try {
      results.website = await this.websiteService.publishVideo(
        videoData,
        generatedContent.WEBSITE_ARTICLE?.content || {}
      );
      await tracker.completeStep('website', { article_id: results.website.id });
    } catch (error) {
      logger.warning('Website publication failed', error);
      results.website = { success: false, error: error.message };
      await tracker.failStep('website', error.message);
    }

    // Publish to Instagram (feed post with video thumbnail)
    try {
      if (generatedContent.INSTAGRAM?.content && videoData.thumbnailUrl) {
        results.instagram = await this.instagramService.publishPhoto(
          generatedContent.INSTAGRAM.content,
          videoData.thumbnailUrl
        );
      }
    } catch (error) {
      logger.warning('Instagram publication failed', error);
      results.instagram = { success: false, error: error.message };
    }

    // Publish Instagram Story
    try {
      if (generatedContent.INSTAGRAM_STORY?.content && videoData.thumbnailUrl) {
        results.instagramStory = await this.instagramService.publishStory(
          generatedContent.INSTAGRAM_STORY.content,
          videoData.thumbnailUrl
        );
      }
    } catch (error) {
      logger.warning('Instagram Story publication failed', error);
      results.instagramStory = { success: false, error: error.message };
    }

    // Send newsletter
    await tracker.startStep('email');
    try {
      if (generatedContent.NEWSLETTER?.content) {
        results.newsletter = await this.newsletterService.sendNewsletter(
          generatedContent.NEWSLETTER.content
        );
        await tracker.completeStep('email', { recipients: results.newsletter.count });
      } else {
        await tracker.skipStep('email', 'No newsletter content generated');
      }
    } catch (error) {
      logger.warning('Newsletter sending failed', error);
      results.newsletter = { success: false, error: error.message };
      await tracker.failStep('email', error.message);
    }

    return results;
  }

  /**
   * Generate unique job ID
   * @private
   */
  _generateJobId() {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Log job start to database
   * @private
   */
  async _logJobStart(jobId, videoData) {
    try {
      const query = `
        INSERT INTO automation_logs 
        (job_id, status, video_id, video_title, started_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      
      await this.db.execute(query, [
        jobId,
        AUTOMATION_STATUS.PROCESSING,
        videoData.id,
        videoData.title
      ]);
    } catch (error) {
      logger.warning('Failed to log job start', error);
    }
  }

  /**
   * Update job status
   * @private
   */
  async _updateJobStatus(jobId, status) {
    try {
      const query = `
        UPDATE automation_logs 
        SET status = ?, updated_at = NOW()
        WHERE job_id = ?
      `;
      
      await this.db.execute(query, [status, jobId]);
    } catch (error) {
      logger.warning('Failed to update job status', error);
    }
  }

  /**
   * Log job completion
   * @private
   */
  async _logJobCompletion(jobId, data) {
    try {
      const query = `
        UPDATE automation_logs 
        SET 
          status = ?,
          duration_ms = ?,
          results = ?,
          completed_at = NOW()
        WHERE job_id = ?
      `;
      
      await this.db.execute(query, [
        data.status,
        data.duration,
        JSON.stringify(data.results),
        jobId
      ]);
    } catch (error) {
      logger.warning('Failed to log job completion', error);
    }
  }

  /**
   * Log job error
   * @private
   */
  async _logJobError(jobId, error) {
    try {
      const query = `
        UPDATE automation_logs 
        SET 
          status = ?,
          error_message = ?,
          error_stack = ?,
          completed_at = NOW()
        WHERE job_id = ?
      `;
      
      await this.db.execute(query, [
        AUTOMATION_STATUS.FAILED,
        error.message,
        error.stack,
        jobId
      ]);
    } catch (err) {
      logger.warning('Failed to log job error', err);
    }
  }

  /**
   * Get job status
   * @param {string} jobId - Job ID
   * @returns {Promise<object>} Job data
   */
  async getJobStatus(jobId) {
    try {
      const query = `
        SELECT * FROM automation_logs 
        WHERE job_id = ?
      `;
      
      const [rows] = await this.db.execute(query, [jobId]);
      
      if (rows.length === 0) {
        return null;
      }

      const job = rows[0];
      
      return {
        jobId: job.job_id,
        status: job.status,
        videoId: job.video_id,
        videoTitle: job.video_title,
        startedAt: job.started_at,
        completedAt: job.completed_at,
        duration: job.duration_ms,
        results: job.results ? JSON.parse(job.results) : null,
        error: job.error_message
      };
    } catch (error) {
      logger.error('Failed to get job status', error);
      throw new AutomationError('Failed to get job status', { jobId, error: error.message });
    }
  }
}

export default JobProcessor;
