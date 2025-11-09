/**
 * Configuration for social media platforms
 * Defines limits, formats, and requirements for each platform
 */

export const PLATFORMS = {
  TWITTER: {
    name: 'Twitter',
    enabled: true,
    limits: {
      textLength: 280,
      imageCount: 4,
      videoSize: 512 * 1024 * 1024, // 512MB
      videoDuration: 140 // seconds
    },
    formats: {
      images: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      videos: ['mp4', 'mov']
    },
    apiVersion: 'v2'
  },

  INSTAGRAM: {
    name: 'Instagram',
    enabled: true,
    limits: {
      captionLength: 2200,
      hashtagCount: 30,
      imageSize: 8 * 1024 * 1024, // 8MB
      videoSize: 100 * 1024 * 1024, // 100MB
      videoDuration: 60, // seconds for feed posts
      storyDuration: 15 // seconds for stories
    },
    formats: {
      images: ['jpg', 'jpeg', 'png'],
      videos: ['mp4', 'mov']
    },
    aspectRatios: {
      feed: { min: 0.8, max: 1.91 },
      story: { min: 0.5625, max: 0.5625 } // 9:16
    }
  },

  TIKTOK: {
    name: 'TikTok',
    enabled: false, // À activer plus tard
    limits: {
      captionLength: 150,
      hashtagCount: 10,
      videoSize: 287.6 * 1024 * 1024, // 287.6MB for iOS
      videoDuration: 60
    },
    formats: {
      videos: ['mp4', 'mov', 'webm']
    },
    aspectRatios: {
      preferred: 0.5625 // 9:16
    }
  },

  SNAPCHAT: {
    name: 'Snapchat',
    enabled: false, // À activer plus tard
    limits: {
      videoDuration: 60,
      imageCount: 10
    }
  },

  WEBSITE: {
    name: 'Website',
    enabled: true,
    api: {
      endpoint: '/api/videos',
      method: 'POST'
    }
  },

  NEWSLETTER: {
    name: 'Newsletter',
    enabled: true,
    service: 'brevo', // ou 'mailchimp', 'sendgrid'
    limits: {
      subjectLength: 150,
      preheaderLength: 100
    }
  }
};

export const CONTENT_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  TEXT: 'text',
  STORY: 'story',
  ARTICLE: 'article'
};

export const AUTOMATION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  GENERATING: 'generating',
  PUBLISHING: 'publishing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PARTIAL: 'partial' // Certaines plateformes ont réussi, d'autres non
};
