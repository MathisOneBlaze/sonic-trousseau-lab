/**
 * Videos controller - Handle video CRUD operations
 */

import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database.js';

/**
 * Create a new video
 */
export async function createVideo(req, res) {
  try {
    const {
      youtubeId,
      title,
      description,
      content,
      thumbnailUrl,
      publishedAt,
      youtubeUrl,
      embedUrl,
      tags,
      category,
      keywords,
      duration,
      statistics
    } = req.body;

    // Validate required fields
    if (!youtubeId || !title || !youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: youtubeId, title, youtubeUrl'
      });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const id = uuidv4();

    const query = `
      INSERT INTO videos (
        id, youtube_id, title, slug, description, content,
        thumbnail_url, published_at, youtube_url, embed_url,
        category, tags, keywords, duration,
        view_count, like_count, comment_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(query, [
      id,
      youtubeId,
      title,
      slug,
      description || null,
      content || null,
      thumbnailUrl || null,
      publishedAt || new Date(),
      youtubeUrl,
      embedUrl || `https://www.youtube.com/embed/${youtubeId}`,
      category || 'Vidéos',
      JSON.stringify(tags || []),
      JSON.stringify(keywords || []),
      duration || null,
      statistics?.viewCount || 0,
      statistics?.likeCount || 0,
      statistics?.commentCount || 0
    ]);

    console.log(`✅ Video created: ${id} - ${title}`);

    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: {
        id,
        slug,
        youtubeId,
        title
      }
    });
  } catch (error) {
    console.error('❌ Error creating video:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Video already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create video',
      error: error.message
    });
  }
}

/**
 * Get all videos
 */
export async function getVideos(req, res) {
  try {
    const { limit = 10, offset = 0, category } = req.query;

    let query = 'SELECT * FROM videos';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY published_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [videos] = await pool.execute(query, params);

    // Parse JSON fields
    const parsedVideos = videos.map(video => ({
      ...video,
      tags: JSON.parse(video.tags || '[]'),
      keywords: JSON.parse(video.keywords || '[]')
    }));

    res.json({
      success: true,
      data: parsedVideos,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: videos.length
      }
    });
  } catch (error) {
    console.error('❌ Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos',
      error: error.message
    });
  }
}

/**
 * Get video by ID
 */
export async function getVideoById(req, res) {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM videos WHERE id = ?';
    const [videos] = await pool.execute(query, [id]);

    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const video = videos[0];
    video.tags = JSON.parse(video.tags || '[]');
    video.keywords = JSON.parse(video.keywords || '[]');

    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('❌ Error fetching video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
      error: error.message
    });
  }
}

/**
 * Get video by YouTube ID
 */
export async function getVideoByYouTubeId(req, res) {
  try {
    const { youtubeId } = req.params;

    const query = 'SELECT * FROM videos WHERE youtube_id = ?';
    const [videos] = await pool.execute(query, [youtubeId]);

    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const video = videos[0];
    video.tags = JSON.parse(video.tags || '[]');
    video.keywords = JSON.parse(video.keywords || '[]');

    res.json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('❌ Error fetching video by YouTube ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
      error: error.message
    });
  }
}

/**
 * Update video
 */
export async function updateVideo(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic update query
    const allowedFields = [
      'title', 'slug', 'description', 'content', 'thumbnail_url',
      'category', 'tags', 'keywords', 'view_count', 'like_count', 'comment_count'
    ];

    const setClause = [];
    const params = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = ?`);
        
        // Handle JSON fields
        if (key === 'tags' || key === 'keywords') {
          params.push(JSON.stringify(value));
        } else {
          params.push(value);
        }
      }
    }

    if (setClause.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    params.push(id);

    const query = `UPDATE videos SET ${setClause.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    console.log(`✅ Video updated: ${id}`);

    res.json({
      success: true,
      message: 'Video updated successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Error updating video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update video',
      error: error.message
    });
  }
}

/**
 * Delete video
 */
export async function deleteVideo(req, res) {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM videos WHERE id = ?';
    const [result] = await pool.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    console.log(`✅ Video deleted: ${id}`);

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete video',
      error: error.message
    });
  }
}
