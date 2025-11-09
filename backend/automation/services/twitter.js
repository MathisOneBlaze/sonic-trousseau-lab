/**
 * Twitter service for publishing tweets
 * Uses Twitter API v2
 */

import { TwitterApi } from 'twitter-api-v2';
import Logger from '../utils/logger.js';
import { PublicationError, RateLimitError } from '../utils/errors.js';

const logger = new Logger('Twitter');

class TwitterService {
  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    this.enabled = process.env.TWITTER_ENABLED === 'true';
    this.dryRun = process.env.AUTOMATION_DRY_RUN === 'true';
    logger.info(`Twitter service initialized (enabled: ${this.enabled}, dry-run: ${this.dryRun})`);
  }

  /**
   * Post a tweet
   * @param {object} content - Generated content from LLM
   * @param {object} media - Optional media attachments
   * @returns {Promise<object>} Tweet response
   */
  async postTweet(content, media = null) {
    if (!this.enabled) {
      logger.warning('Twitter posting is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Posting tweet', { text: content.text?.substring(0, 50) });

      // DRY RUN MODE - Simulation only
      if (this.dryRun) {
        logger.info('🧪 DRY RUN - Tweet would be posted:', {
          text: content.text,
          hasMedia: !!media,
          length: content.text?.length
        });
        return {
          dryRun: true,
          simulated: true,
          data: {
            id: `dry_run_${Date.now()}`,
            text: content.text
          }
        };
      }

      let mediaIds = [];
      
      // Upload media if provided
      if (media) {
        mediaIds = await this._uploadMedia(media);
      }

      // Post tweet
      const tweet = await this.client.v2.tweet({
        text: content.text,
        ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } })
      });

      logger.success('Tweet posted successfully', { 
        tweetId: tweet.data.id,
        text: tweet.data.text.substring(0, 50)
      });

      return {
        success: true,
        tweetId: tweet.data.id,
        url: `https://twitter.com/user/status/${tweet.data.id}`,
        postedAt: new Date().toISOString()
      };
    } catch (error) {
      if (error.code === 429) {
        logger.error('Twitter rate limit exceeded', error);
        throw new RateLimitError('twitter', error.rateLimit?.reset);
      }

      logger.error('Failed to post tweet', error);
      throw new PublicationError('twitter', 'Failed to post tweet', { error: error.message });
    }
  }

  /**
   * Upload media to Twitter
   * @private
   */
  async _uploadMedia(media) {
    try {
      logger.info('Uploading media to Twitter', { count: media.length });

      const mediaIds = [];

      for (const item of media) {
        let mediaId;
        
        if (item.url) {
          // Download and upload from URL
          const response = await fetch(item.url);
          const buffer = await response.arrayBuffer();
          mediaId = await this.client.v1.uploadMedia(Buffer.from(buffer), { 
            mimeType: item.mimeType 
          });
        } else if (item.buffer) {
          // Upload from buffer
          mediaId = await this.client.v1.uploadMedia(item.buffer, { 
            mimeType: item.mimeType 
          });
        }

        if (mediaId) {
          mediaIds.push(mediaId);
        }
      }

      logger.success(`Uploaded ${mediaIds.length} media files`);
      return mediaIds;
    } catch (error) {
      logger.error('Failed to upload media', error);
      throw new PublicationError('twitter', 'Failed to upload media', { error: error.message });
    }
  }

  /**
   * Post a thread (multiple tweets)
   * @param {Array} tweets - Array of tweet contents
   * @returns {Promise<object>} Thread response
   */
  async postThread(tweets) {
    if (!this.enabled) {
      logger.warning('Twitter posting is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Posting thread', { count: tweets.length });

      let previousTweetId = null;
      const threadIds = [];

      for (const tweet of tweets) {
        const tweetData = {
          text: tweet.text,
          ...(previousTweetId && { reply: { in_reply_to_tweet_id: previousTweetId } })
        };

        const response = await this.client.v2.tweet(tweetData);
        previousTweetId = response.data.id;
        threadIds.push(response.data.id);

        // Small delay between tweets
        await this._delay(1000);
      }

      logger.success('Thread posted successfully', { tweetCount: threadIds.length });

      return {
        success: true,
        threadIds,
        url: `https://twitter.com/user/status/${threadIds[0]}`,
        postedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to post thread', error);
      throw new PublicationError('twitter', 'Failed to post thread', { error: error.message });
    }
  }

  /**
   * Test Twitter connection
   * @returns {Promise<boolean>} Success status
   */
  async testConnection() {
    try {
      logger.info('Testing Twitter connection...');

      const user = await this.client.v2.me();
      
      logger.success('Twitter connection successful', { 
        username: user.data.username,
        name: user.data.name
      });

      return true;
    } catch (error) {
      logger.error('Twitter connection test failed', error);
      return false;
    }
  }

  /**
   * Delay utility
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default TwitterService;
