/**
 * Videos routes
 */

import express from 'express';
import {
  createVideo,
  getVideos,
  getVideoById,
  getVideoByYouTubeId,
  updateVideo,
  deleteVideo
} from '../controllers/videosController.js';

const router = express.Router();

// Create video
router.post('/', createVideo);

// Get all videos
router.get('/', getVideos);

// Get video by ID
router.get('/:id', getVideoById);

// Get video by YouTube ID
router.get('/youtube/:youtubeId', getVideoByYouTubeId);

// Update video
router.patch('/:id', updateVideo);

// Delete video
router.delete('/:id', deleteVideo);

export default router;
