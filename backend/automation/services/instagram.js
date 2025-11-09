/**
 * Instagram service for publishing posts and stories
 * Uses Instagram Graph API (requires Facebook Business account)
 */

import Logger from '../utils/logger.js';
import { PublicationError, RateLimitError } from '../utils/errors.js';

const logger = new Logger('Instagram');

class InstagramService {
  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    this.businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    this.apiVersion = 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
    this.enabled = process.env.INSTAGRAM_ENABLED === 'true';
    
    logger.info(`Instagram service initialized (enabled: ${this.enabled})`);
  }

  /**
   * Publish a photo post to Instagram feed
   * @param {object} content - Generated content from LLM
   * @param {string} imageUrl - Public URL of the image
   * @returns {Promise<object>} Post response
   */
  async publishPhoto(content, imageUrl) {
    if (!this.enabled) {
      logger.warning('Instagram posting is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Publishing photo to Instagram', { 
        caption: content.caption?.substring(0, 50) 
      });

      // Step 1: Create container
      const containerId = await this._createMediaContainer({
        image_url: imageUrl,
        caption: this._formatCaption(content)
      });

      // Step 2: Publish container
      const postId = await this._publishContainer(containerId);

      logger.success('Photo published successfully', { postId });

      return {
        success: true,
        postId,
        url: await this._getPostUrl(postId),
        postedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to publish photo', error);
      throw new PublicationError('instagram', 'Failed to publish photo', { 
        error: error.message 
      });
    }
  }

  /**
   * Publish a story to Instagram
   * @param {object} content - Generated content from LLM
   * @param {string} imageUrl - Public URL of the image
   * @returns {Promise<object>} Story response
   */
  async publishStory(content, imageUrl) {
    if (!this.enabled) {
      logger.warning('Instagram posting is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Publishing story to Instagram');

      const containerId = await this._createMediaContainer({
        image_url: imageUrl,
        media_type: 'STORIES'
      });

      const storyId = await this._publishContainer(containerId);

      logger.success('Story published successfully', { storyId });

      return {
        success: true,
        storyId,
        postedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to publish story', error);
      throw new PublicationError('instagram', 'Failed to publish story', { 
        error: error.message 
      });
    }
  }

  /**
   * Publish a carousel post (multiple images)
   * @param {object} content - Generated content from LLM
   * @param {Array} imageUrls - Array of public image URLs
   * @returns {Promise<object>} Post response
   */
  async publishCarousel(content, imageUrls) {
    if (!this.enabled) {
      logger.warning('Instagram posting is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Publishing carousel to Instagram', { imageCount: imageUrls.length });

      // Create containers for each image
      const childrenIds = [];
      for (const imageUrl of imageUrls) {
        const containerId = await this._createMediaContainer({
          image_url: imageUrl,
          is_carousel_item: true
        });
        childrenIds.push(containerId);
      }

      // Create carousel container
      const carouselId = await this._createMediaContainer({
        media_type: 'CAROUSEL',
        children: childrenIds,
        caption: this._formatCaption(content)
      });

      // Publish carousel
      const postId = await this._publishContainer(carouselId);

      logger.success('Carousel published successfully', { postId });

      return {
        success: true,
        postId,
        url: await this._getPostUrl(postId),
        postedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to publish carousel', error);
      throw new PublicationError('instagram', 'Failed to publish carousel', { 
        error: error.message 
      });
    }
  }

  /**
   * Create a media container
   * @private
   */
  async _createMediaContainer(params) {
    try {
      const url = `${this.baseUrl}/${this.businessAccountId}/media`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          access_token: this.accessToken
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      logger.debug('Media container created', { containerId: data.id });
      return data.id;
    } catch (error) {
      throw new PublicationError('instagram', 'Failed to create media container', { 
        error: error.message 
      });
    }
  }

  /**
   * Publish a media container
   * @private
   */
  async _publishContainer(containerId) {
    try {
      const url = `${this.baseUrl}/${this.businessAccountId}/media_publish`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: this.accessToken
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.id;
    } catch (error) {
      throw new PublicationError('instagram', 'Failed to publish container', { 
        error: error.message 
      });
    }
  }

  /**
   * Format caption with hashtags
   * @private
   */
  _formatCaption(content) {
    let caption = content.caption || '';
    
    if (content.hashtags && content.hashtags.length > 0) {
      caption += '\n\n' + content.hashtags.map(tag => 
        tag.startsWith('#') ? tag : `#${tag}`
      ).join(' ');
    }

    return caption;
  }

  /**
   * Get post URL
   * @private
   */
  async _getPostUrl(postId) {
    try {
      const url = `${this.baseUrl}/${postId}?fields=permalink&access_token=${this.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.permalink || null;
    } catch (error) {
      logger.warning('Failed to get post URL', error);
      return null;
    }
  }

  /**
   * Test Instagram connection
   * @returns {Promise<boolean>} Success status
   */
  async testConnection() {
    try {
      logger.info('Testing Instagram connection...');

      const url = `${this.baseUrl}/${this.businessAccountId}?fields=username,name&access_token=${this.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      logger.success('Instagram connection successful', { 
        username: data.username,
        name: data.name
      });

      return true;
    } catch (error) {
      logger.error('Instagram connection test failed', error);
      return false;
    }
  }
}

export default InstagramService;
