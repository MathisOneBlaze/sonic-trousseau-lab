/**
 * Le Trousseau - Backend API Server
 * Express server for handling form submissions and database operations
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import submissionRoutes from './routes/submissions.js';

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

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:8080', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
      quiz: 'POST /api/submissions/quiz'
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
    
    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('✅ Le Trousseau API Server');
      console.log('==========================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`📊 Database: Connected`);
      console.log(`🔒 CORS: ${corsOptions.origin.join(', ')}`);
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
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
