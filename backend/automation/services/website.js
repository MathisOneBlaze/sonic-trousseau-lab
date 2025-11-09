/**
 * Website service for publishing videos to your site
 * Posts to your own API to add videos to the database
 */

import Logger from '../utils/logger.js';
import { PublicationError } from '../utils/errors.js';

const logger = new Logger('Website');

class WebsiteService {
  constructor() {
    this.apiUrl = process.env.API_URL || 'http://localhost:3001/api';
    this.apiKey = process.env.API_SECRET_KEY;
    this.enabled = process.env.WEBSITE_ENABLED !== 'false'; // Enabled by default
    
    logger.info(`Website service initialized (enabled: ${this.enabled})`);
  }

  /**
   * Publish video to website
   * @param {object} videoData - YouTube video data
   * @param {object} content - Generated article content from LLM
   * @returns {Promise<object>} Publication response
   */
  async publishVideo(videoData, content) {
    if (!this.enabled) {
      logger.warning('Website publishing is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Publishing video to website', { 
        title: videoData.title,
        videoId: videoData.id 
      });

      const payload = {
        youtubeId: videoData.id,
        title: content.title || videoData.title,
        description: content.metaDescription || videoData.description.substring(0, 160),
        content: content.body || content.introduction,
        thumbnailUrl: videoData.thumbnailUrl,
        publishedAt: videoData.publishedAt,
        youtubeUrl: videoData.url,
        embedUrl: videoData.embedUrl,
        tags: videoData.tags || [],
        category: content.category || 'Vidéos',
        keywords: content.keywords || [],
        duration: videoData.duration,
        statistics: videoData.statistics
      };

      const response = await fetch(`${this.apiUrl}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to publish video');
      }

      logger.success('Video published to website', { 
        videoId: data.id,
        slug: data.slug 
      });

      return {
        success: true,
        videoId: data.id,
        slug: data.slug,
        url: `${process.env.SITE_URL || 'https://asso-letrousseau.com'}/videos/${data.slug}`,
        publishedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to publish video to website', error);
      throw new PublicationError('website', 'Failed to publish video', { 
        error: error.message 
      });
    }
  }

  /**
   * Update existing video
   * @param {string} videoId - Video ID in database
   * @param {object} updates - Fields to update
   * @returns {Promise<object>} Update response
   */
  async updateVideo(videoId, updates) {
    try {
      logger.info('Updating video on website', { videoId });

      const response = await fetch(`${this.apiUrl}/videos/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update video');
      }

      logger.success('Video updated successfully', { videoId });

      return {
        success: true,
        videoId: data.id,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to update video', error);
      throw new PublicationError('website', 'Failed to update video', { 
        videoId,
        error: error.message 
      });
    }
  }

  /**
   * Check if video already exists
   * @param {string} youtubeId - YouTube video ID
   * @returns {Promise<object|null>} Existing video or null
   */
  async checkVideoExists(youtubeId) {
    try {
      logger.debug('Checking if video exists', { youtubeId });

      const response = await fetch(`${this.apiUrl}/videos/youtube/${youtubeId}`, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });

      if (response.status === 404) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.warning('Failed to check if video exists', error);
      return null;
    }
  }

  /**
   * Test website API connection
   * @returns {Promise<boolean>} Success status
   */
  async testConnection() {
    try {
      logger.info('Testing website API connection...');

      const response = await fetch(`${this.apiUrl}/health`);
      const data = await response.json();

      if (data.status === 'ok') {
        logger.success('Website API connection successful');
        return true;
      }

      throw new Error('API health check failed');
    } catch (error) {
      logger.error('Website API connection test failed', error);
      return false;
    }
  }
}

export default WebsiteService;
