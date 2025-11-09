/**
 * Video clipping service using FFmpeg
 * Extracts short clips from YouTube videos for social media
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import Logger from '../utils/logger.js';
import { AutomationError } from '../utils/errors.js';

const execAsync = promisify(exec);
const logger = new Logger('VideoClipping');

class VideoClippingService {
  constructor() {
    this.tempDir = process.env.TEMP_DIR || '/tmp/automation';
    this.outputDir = process.env.CLIPS_OUTPUT_DIR || '/var/www/clips';
    
    // Video format presets
    this.formats = {
      vertical: {
        name: '9:16 (Stories)',
        resolution: '1080x1920',
        aspectRatio: '9:16'
      },
      square: {
        name: '1:1 (Instagram Feed)',
        resolution: '1080x1080',
        aspectRatio: '1:1'
      },
      landscape: {
        name: '16:9 (YouTube/Twitter)',
        resolution: '1920x1080',
        aspectRatio: '16:9'
      }
    };

    logger.info('Video clipping service initialized');
  }

  /**
   * Download YouTube video
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<string>} Path to downloaded video
   */
  async downloadVideo(videoId) {
    try {
      logger.info('Downloading YouTube video', { videoId });

      await fs.mkdir(this.tempDir, { recursive: true });
      const videoPath = path.join(this.tempDir, `${videoId}.mp4`);

      // Download with yt-dlp (best quality up to 1080p)
      const command = `yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4 -o "${videoPath}" "https://www.youtube.com/watch?v=${videoId}"`;
      
      await execAsync(command);

      logger.success('Video downloaded', { path: videoPath });
      return videoPath;
    } catch (error) {
      logger.error('Video download failed', error);
      throw new AutomationError('Video download failed', { 
        videoId,
        error: error.message 
      });
    }
  }

  /**
   * Create clips from video based on key moments
   * @param {string} videoPath - Path to source video
   * @param {Array} keyMoments - Array of key moments with timestamps
   * @param {object} videoData - Video metadata
   * @returns {Promise<Array>} Array of created clips
   */
  async createClips(videoPath, keyMoments, videoData) {
    try {
      logger.info('Creating clips from video', { 
        videoPath,
        momentsCount: keyMoments.length 
      });

      await fs.mkdir(this.outputDir, { recursive: true });

      const clips = [];

      for (let i = 0; i < keyMoments.length; i++) {
        const moment = keyMoments[i];
        
        try {
          const clipData = await this._createSingleClip(
            videoPath,
            moment,
            i,
            videoData.id
          );
          
          clips.push(clipData);
          logger.success(`Clip ${i + 1}/${keyMoments.length} created`);
        } catch (error) {
          logger.warning(`Failed to create clip ${i + 1}`, error);
        }
      }

      logger.success('All clips created', { count: clips.length });
      return clips;
    } catch (error) {
      logger.error('Clip creation failed', error);
      throw new AutomationError('Clip creation failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Create a single clip in multiple formats
   * @private
   */
  async _createSingleClip(videoPath, moment, index, videoId) {
    const clipId = `${videoId}_clip_${index + 1}`;
    const startTime = this._parseTimestamp(moment.timestamp);
    const duration = moment.duration || 30;

    const clipData = {
      id: clipId,
      moment: moment.description,
      duration,
      formats: {},
      quality: moment.quality || 0.7
    };

    // Create clip in each format
    for (const [formatName, formatConfig] of Object.entries(this.formats)) {
      try {
        const outputPath = await this._extractClip(
          videoPath,
          startTime,
          duration,
          formatConfig,
          clipId,
          formatName
        );

        clipData.formats[formatName] = {
          path: outputPath,
          resolution: formatConfig.resolution,
          aspectRatio: formatConfig.aspectRatio,
          size: await this._getFileSize(outputPath)
        };
      } catch (error) {
        logger.warning(`Failed to create ${formatName} format`, error);
      }
    }

    return clipData;
  }

  /**
   * Extract clip with FFmpeg
   * @private
   */
  async _extractClip(videoPath, startTime, duration, formatConfig, clipId, formatName) {
    const outputPath = path.join(this.outputDir, `${clipId}_${formatName}.mp4`);

    // FFmpeg command with smart cropping
    const command = `ffmpeg -i "${videoPath}" -ss ${startTime} -t ${duration} \
      -vf "scale=${formatConfig.resolution}:force_original_aspect_ratio=increase,crop=${formatConfig.resolution},setsar=1" \
      -c:v libx264 -preset fast -crf 23 \
      -c:a aac -b:a 128k \
      -movflags +faststart \
      -y "${outputPath}"`;

    await execAsync(command);

    logger.debug('Clip extracted', { 
      format: formatName,
      path: outputPath 
    });

    return outputPath;
  }

  /**
   * Extract screenshots from video
   * @param {string} videoPath - Path to video
   * @param {Array} timestamps - Array of timestamps (in seconds or "MM:SS" format)
   * @param {string} videoId - Video ID
   * @returns {Promise<Array>} Array of screenshot paths
   */
  async extractScreenshots(videoPath, timestamps, videoId) {
    try {
      logger.info('Extracting screenshots', { count: timestamps.length });

      await fs.mkdir(this.outputDir, { recursive: true });

      const screenshots = [];

      for (let i = 0; i < timestamps.length; i++) {
        const timestamp = typeof timestamps[i] === 'string' 
          ? this._parseTimestamp(timestamps[i])
          : timestamps[i];

        const outputPath = path.join(
          this.outputDir,
          `${videoId}_screenshot_${i + 1}.jpg`
        );

        // Extract single frame at high quality
        const command = `ffmpeg -ss ${timestamp} -i "${videoPath}" \
          -vframes 1 -q:v 2 \
          -y "${outputPath}"`;

        await execAsync(command);

        screenshots.push({
          index: i + 1,
          timestamp,
          path: outputPath,
          size: await this._getFileSize(outputPath)
        });

        logger.debug(`Screenshot ${i + 1}/${timestamps.length} extracted`);
      }

      logger.success('Screenshots extracted', { count: screenshots.length });
      return screenshots;
    } catch (error) {
      logger.error('Screenshot extraction failed', error);
      throw new AutomationError('Screenshot extraction failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Extract thumbnail (best frame) from video
   * @param {string} videoPath - Path to video
   * @param {string} videoId - Video ID
   * @returns {Promise<string>} Path to thumbnail
   */
  async extractThumbnail(videoPath, videoId) {
    try {
      logger.info('Extracting thumbnail');

      const outputPath = path.join(this.outputDir, `${videoId}_thumbnail.jpg`);

      // Extract frame from 10% into video (usually good composition)
      const command = `ffmpeg -i "${videoPath}" \
        -vf "select=gt(scene\\,0.4),thumbnail" -frames:v 1 \
        -vsync vfr -q:v 2 \
        -y "${outputPath}"`;

      await execAsync(command);

      logger.success('Thumbnail extracted', { path: outputPath });
      return outputPath;
    } catch (error) {
      logger.error('Thumbnail extraction failed', error);
      throw new AutomationError('Thumbnail extraction failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Optimize clip for specific platform
   * @param {string} clipPath - Path to clip
   * @param {string} platform - Platform name
   * @returns {Promise<string>} Path to optimized clip
   */
  async optimizeForPlatform(clipPath, platform) {
    const platformSpecs = {
      tiktok: {
        maxSize: 287600000, // 287.6 MB
        maxDuration: 60,
        format: 'vertical',
        videoBitrate: '5000k',
        audioBitrate: '128k'
      },
      instagram_reels: {
        maxSize: 100000000, // 100 MB
        maxDuration: 90,
        format: 'vertical',
        videoBitrate: '4000k',
        audioBitrate: '128k'
      },
      snapchat: {
        maxDuration: 60,
        format: 'vertical',
        videoBitrate: '3000k',
        audioBitrate: '128k'
      },
      twitter: {
        maxSize: 512000000, // 512 MB
        maxDuration: 140,
        format: 'landscape',
        videoBitrate: '5000k',
        audioBitrate: '128k'
      }
    };

    const specs = platformSpecs[platform];
    if (!specs) {
      logger.warning(`No optimization specs for platform: ${platform}`);
      return clipPath;
    }

    try {
      logger.info('Optimizing clip for platform', { platform });

      const outputPath = clipPath.replace('.mp4', `_${platform}.mp4`);

      const command = `ffmpeg -i "${clipPath}" \
        -t ${specs.maxDuration} \
        -c:v libx264 -preset fast \
        -b:v ${specs.videoBitrate} \
        -c:a aac -b:a ${specs.audioBitrate} \
        -movflags +faststart \
        -y "${outputPath}"`;

      await execAsync(command);

      const fileSize = await this._getFileSize(outputPath);
      
      if (fileSize > specs.maxSize) {
        logger.warning('Clip exceeds max size, recompressing', {
          platform,
          size: fileSize,
          maxSize: specs.maxSize
        });
        
        // Reduce bitrate further
        return await this._recompressClip(outputPath, specs.maxSize);
      }

      logger.success('Clip optimized for platform', { platform, path: outputPath });
      return outputPath;
    } catch (error) {
      logger.error('Platform optimization failed', error);
      return clipPath; // Return original if optimization fails
    }
  }

  /**
   * Recompress clip to meet size constraint
   * @private
   */
  async _recompressClip(clipPath, maxSize) {
    // Calculate required bitrate
    const duration = await this._getVideoDuration(clipPath);
    const targetBitrate = Math.floor((maxSize * 8) / duration / 1000) - 128; // Account for audio

    const outputPath = clipPath.replace('.mp4', '_compressed.mp4');

    const command = `ffmpeg -i "${clipPath}" \
      -c:v libx264 -preset slow \
      -b:v ${targetBitrate}k \
      -c:a aac -b:a 96k \
      -movflags +faststart \
      -y "${outputPath}"`;

    await execAsync(command);

    logger.success('Clip recompressed', { 
      originalSize: await this._getFileSize(clipPath),
      newSize: await this._getFileSize(outputPath)
    });

    return outputPath;
  }

  /**
   * Parse timestamp (MM:SS) to seconds
   * @private
   */
  _parseTimestamp(timestamp) {
    if (typeof timestamp === 'number') return timestamp;
    
    const parts = timestamp.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  }

  /**
   * Get file size in bytes
   * @private
   */
  async _getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get video duration in seconds
   * @private
   */
  async _getVideoDuration(videoPath) {
    try {
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
      );
      return parseFloat(stdout.trim());
    } catch (error) {
      return 0;
    }
  }

  /**
   * Clean up temporary files
   * @param {string} videoId - Video ID
   */
  async cleanup(videoId) {
    try {
      const tempVideo = path.join(this.tempDir, `${videoId}.mp4`);
      const tempAudio = path.join(this.tempDir, `${videoId}_audio.mp3`);

      await Promise.all([
        fs.unlink(tempVideo).catch(() => {}),
        fs.unlink(tempAudio).catch(() => {})
      ]);

      logger.info('Temporary files cleaned up', { videoId });
    } catch (error) {
      logger.warning('Cleanup failed', error);
    }
  }

  /**
   * Check if FFmpeg is installed
   * @returns {Promise<boolean>}
   */
  async checkDependencies() {
    try {
      await execAsync('ffmpeg -version');
      await execAsync('ffprobe -version');
      logger.success('FFmpeg and FFprobe are installed');
      return true;
    } catch (error) {
      logger.error('FFmpeg or FFprobe not installed');
      return false;
    }
  }
}

export default VideoClippingService;
