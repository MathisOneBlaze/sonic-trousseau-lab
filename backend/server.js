/**
 * Le Trousseau - Backend API Server
 * Express server for handling form submissions and database operations
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection, pool } from './config/database.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import submissionRoutes from './routes/submissions.js';
import videosRoutes from './routes/videos.js';
import monitoringRoutes from './routes/monitoring.js';
import AutomationService from './automation/index.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// Middleware Configuration
// ============================================

// Trust proxy (required when behind Nginx reverse proxy)
app.set('trust proxy', 1);

// Security headers - with relaxed CSP for dashboard
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:8080', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Request logging (development only)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// Routes
// ============================================

// API routes
app.use('/api/submissions', submissionRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Serve monitoring dashboard
app.use('/monitoring', express.static('public'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Le Trousseau API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: 'POST /api/submissions/contact',
      booking: 'POST /api/submissions/booking',
      newsletter: 'POST /api/submissions/newsletter',
      quiz: 'POST /api/submissions/quiz',
      videos: 'GET/POST /api/videos',
      automation: 'POST /api/automation/trigger'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: NODE_ENV === 'development' 
      ? err.message 
      : 'Une erreur est survenue sur le serveur'
  });
});

// ============================================
// Automation Service Integration
// ============================================

let automationService = null;

// Automation endpoints
app.post('/api/automation/trigger', async (req, res) => {
  try {
    if (!automationService || !automationService.isRunning) {
      return res.status(503).json({
        success: false,
        error: 'Automation service is not running'
      });
    }

    const { videoId } = req.body;
    
    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'videoId is required'
      });
    }

    const result = await automationService.processVideo(videoId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Automation trigger error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/automation/status/:jobId', async (req, res) => {
  try {
    if (!automationService) {
      return res.status(503).json({
        success: false,
        error: 'Automation service is not available'
      });
    }

    const { jobId } = req.params;
    const status = await automationService.getJobStatus(jobId);

    if (!status) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('❌ Get job status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/automation/check-now', async (req, res) => {
  try {
    if (!automationService || !automationService.isRunning) {
      return res.status(503).json({
        success: false,
        error: 'Automation service is not running'
      });
    }

    // Trigger manual check
    await automationService.checkForNewVideos();

    res.json({
      success: true,
      message: 'Manual check triggered'
    });
  } catch (error) {
    console.error('❌ Manual check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// Server Startup
// ============================================

async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Cannot start server: Database connection failed');
      process.exit(1);
    }
    
    // Start automation service if enabled
    const automationEnabled = process.env.AUTOMATION_ENABLED !== 'false';
    if (automationEnabled) {
      try {
        console.log('🤖 Starting automation service...');
        automationService = new AutomationService(pool);
        await automationService.start({
          cronSchedule: process.env.AUTOMATION_CRON_SCHEDULE || '*/15 * * * *'
        });
        console.log('✅ Automation service started');
      } catch (error) {
        console.error('⚠️  Failed to start automation service:', error.message);
        console.log('⚠️  Server will continue without automation');
      }
    } else {
      console.log('ℹ️  Automation service is disabled');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('✅ Le Trousseau API Server');
      console.log('==========================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📊 Database: Connected`);
      console.log(`🔒 CORS: ${corsOptions.origin.join(', ')}`);
      console.log(`🤖 Automation: ${automationEnabled ? 'Enabled' : 'Disabled'}`);
      console.log('');
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');
  if (automationService) {
    automationService.stop();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT received, shutting down gracefully...');
  if (automationService) {
    automationService.stop();
  }
  process.exit(0);
});

// Start the server
startServer();
