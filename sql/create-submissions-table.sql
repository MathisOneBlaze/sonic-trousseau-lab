-- ============================================
-- Le Trousseau - Database Schema for Hostinger MySQL
-- ============================================
-- 
-- This script creates the submissions table for storing
-- all form submissions (contact, newsletter, quiz, booking)
--
-- Execute this on Hostinger MySQL before activating the adapter
-- ============================================

CREATE TABLE IF NOT EXISTS submissions (
  -- Primary fields
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID v4',
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Submission date/time',
  source ENUM('contact', 'newsletter', 'quiz', 'booking') NOT NULL COMMENT 'Form type',
  consent BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'RGPD consent flag',
  
  -- Contact info (common fields)
  name VARCHAR(255) NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NULL,
  
  -- Contact form specific
  subject VARCHAR(500) NULL,
  message TEXT NULL,
  newsletter BOOLEAN NULL DEFAULT FALSE,
  
  -- Newsletter form specific
  -- (uses name + email only)
  
  -- Quiz form specific (stored as JSON)
  quiz_user_info JSON NULL COMMENT 'User info: name, pseudonym, email, phone, age, location',
  quiz_answers JSON NULL COMMENT 'Array of answers with questionId, answer, value',
  quiz_results JSON NULL COMMENT 'Score, archetype, stats, insights, recommendedOffer',
  
  -- Booking form specific
  formula VARCHAR(255) NULL,
  participants VARCHAR(100) NULL,
  location VARCHAR(255) NULL,
  equipment JSON NULL COMMENT 'Array of equipment choices',
  
  -- Metadata
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_timestamp (timestamp),
  INDEX idx_source (source),
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='All form submissions for Le Trousseau website';

-- ============================================
-- Data Retention Policy (Optional)
-- ============================================
-- 
-- Create an event to auto-delete old submissions
-- Adjust INTERVAL based on VITE_DATA_RETENTION_DAYS
-- 
-- Uncomment to activate:
-- 
-- DELIMITER $$
-- CREATE EVENT IF NOT EXISTS purge_old_submissions
-- ON SCHEDULE EVERY 1 DAY
-- DO BEGIN
--   DELETE FROM submissions 
--   WHERE timestamp < DATE_SUB(NOW(), INTERVAL 365 DAY)
--   AND consent = TRUE;
-- END$$
-- DELIMITER ;

-- ============================================
-- Sample Queries
-- ============================================

-- Get all contact form submissions
-- SELECT * FROM submissions WHERE source = 'contact' ORDER BY timestamp DESC;

-- Get quiz results
-- SELECT id, timestamp, quiz_results->>'$.archetype' as archetype, quiz_results->>'$.score' as score
-- FROM submissions WHERE source = 'quiz' ORDER BY timestamp DESC;

-- Export newsletter subscribers
-- SELECT name, email, timestamp FROM submissions WHERE source = 'newsletter' ORDER BY timestamp DESC;

-- Count submissions by source
-- SELECT source, COUNT(*) as count FROM submissions GROUP BY source;

-- ============================================
-- RGPD Compliance
-- ============================================

-- View all data for a specific user (RGPD right to access)
-- SELECT * FROM submissions WHERE email = 'user@example.com';

-- Delete all data for a specific user (RGPD right to erasure)
-- DELETE FROM submissions WHERE email = 'user@example.com';
