/**
 * YouTube service for detecting new videos
 * Supports both webhook and polling methods
 */

import { google } from 'googleapis';
import Logger from '../utils/logger.js';
import { YouTubeError } from '../utils/errors.js';

const logger = new Logger('YouTube');

class YouTubeService {
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
    this.channelId = process.env.YOUTUBE_CHANNEL_ID;
    this.lastCheckedVideoId = null;
  }

  /**
   * Get channel's latest videos
   * @param {number} maxResults - Maximum number of videos to fetch
   * @returns {Promise<Array>} Array of video objects
   */
  async getNewVideos() {
    try {
      logger.info('Checking for new videos');

      // Security: Only fetch videos after start date
      const startDate = process.env.AUTOMATION_START_DATE 
        ? new Date(process.env.AUTOMATION_START_DATE).toISOString()
        : null;

      const maxResults = parseInt(process.env.YOUTUBE_MAX_RESULTS) || 5;

      const searchParams = {
        part: 'id,snippet',
        channelId: this.channelId,
        order: 'date',
        type: 'video',
        maxResults
      };

      // Add date filter if configured
      if (startDate) {
        searchParams.publishedAfter = startDate;
        logger.info(`Filtering videos published after: ${startDate}`);
      }

      const response = await this.youtube.search.list(searchParams);

      const videos = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle
      }));

      logger.success(`Fetched ${videos.length} videos`);
      return videos;
    } catch (error) {
      logger.error('Failed to fetch videos from YouTube', error);
      throw new YouTubeError('Failed to fetch videos', { error: error.message });
    }
  }

  /**
   * Get detailed video information
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<object>} Detailed video data
   */
  async getVideoDetails(videoId) {
    try {
      logger.info(`Fetching details for video: ${videoId}`);

      const response = await this.youtube.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoId
      });

      if (!response.data.items || response.data.items.length === 0) {
        throw new YouTubeError('Video not found', { videoId });
      }

      const video = response.data.items[0];
      const videoData = {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
        tags: video.snippet.tags || [],
        categoryId: video.snippet.categoryId,
        duration: video.contentDetails.duration,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        embedUrl: `https://www.youtube.com/embed/${video.id}`,
        statistics: {
          viewCount: parseInt(video.statistics.viewCount || 0),
          likeCount: parseInt(video.statistics.likeCount || 0),
          commentCount: parseInt(video.statistics.commentCount || 0)
        }
      };

      logger.success('Video details fetched successfully', { title: videoData.title });
      return videoData;
    } catch (error) {
      logger.error('Failed to fetch video details', error);
      throw new YouTubeError('Failed to fetch video details', { videoId, error: error.message });
    }
  }

  /**
   * Check for new videos since last check
   * @returns {Promise<Array>} Array of new videos
   */
  async checkForNewVideos() {
    try {
      logger.info('Checking for new videos...');

      const videos = await this.getLatestVideos(1);
      
      if (videos.length === 0) {
        logger.info('No videos found');
        return [];
      }

      const latestVideo = videos[0];

      // First run, store the latest video ID
      if (!this.lastCheckedVideoId) {
        logger.info('First check, storing latest video ID', { id: latestVideo.id });
        this.lastCheckedVideoId = latestVideo.id;
        return [];
      }

      // Check if there's a new video
      if (latestVideo.id !== this.lastCheckedVideoId) {
        logger.success('New video detected!', { 
          id: latestVideo.id, 
          title: latestVideo.title 
        });

        // Get full details
        const videoDetails = await this.getVideoDetails(latestVideo.id);
        
        // Update last checked ID
        this.lastCheckedVideoId = latestVideo.id;

        return [videoDetails];
      }

      logger.info('No new videos since last check');
      return [];
    } catch (error) {
      logger.error('Failed to check for new videos', error);
      throw new YouTubeError('Failed to check for new videos', { error: error.message });
    }
  }

  /**
   * Verify webhook payload from YouTube PubSubHubbub
   * @param {object} payload - Webhook payload
   * @returns {object|null} Parsed video data or null
   */
  verifyWebhookPayload(payload) {
    try {
      // Parse XML payload from YouTube PubSubHubbub
      // This is a simplified version, you'd need xml2js or similar
      logger.info('Verifying YouTube webhook payload');
      
      // TODO: Implement actual XML parsing
      // For now, return null to fallback to polling
      return null;
    } catch (error) {
      logger.error('Failed to verify webhook payload', error);
      return null;
    }
  }

  /**
   * Subscribe to YouTube channel updates via PubSubHubbub
   * @param {string} callbackUrl - Your server's webhook endpoint URL
   * @returns {Promise<boolean>} Success status
   */
  async subscribeToWebhook(callbackUrl) {
    try {
      logger.info('Subscribing to YouTube webhook', { callbackUrl });

      const hubUrl = 'https://pubsubhubbub.appspot.com/subscribe';
      const topicUrl = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${this.channelId}`;

      const params = new URLSearchParams({
        'hub.callback': callbackUrl,
        'hub.topic': topicUrl,
        'hub.verify': 'async',
        'hub.mode': 'subscribe',
        'hub.lease_seconds': '864000' // 10 days
      });

      const response = await fetch(hubUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      if (response.ok) {
        logger.success('Successfully subscribed to YouTube webhook');
        return true;
      } else {
        throw new Error(`Webhook subscription failed: ${response.statusText}`);
      }
    } catch (error) {
      logger.error('Failed to subscribe to YouTube webhook', error);
      throw new YouTubeError('Failed to subscribe to webhook', { error: error.message });
    }
  }
}

export default YouTubeService;
