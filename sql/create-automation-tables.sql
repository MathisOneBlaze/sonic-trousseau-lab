-- Tables for automation system
-- Videos table and automation logs

-- =====================================================
-- Videos table - Stores YouTube videos published on site
-- =====================================================

CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(36) PRIMARY KEY,
    youtube_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    content LONGTEXT,
    thumbnail_url VARCHAR(1000),
    published_at DATETIME NOT NULL,
    youtube_url VARCHAR(500) NOT NULL,
    embed_url VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'Vidéos',
    tags JSON,
    keywords JSON,
    duration VARCHAR(20),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_youtube_id (youtube_id),
    INDEX idx_slug (slug),
    INDEX idx_published_at (published_at),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Automation logs table - Tracks automation jobs
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'generating', 'publishing', 'completed', 'failed', 'partial') NOT NULL,
    video_id VARCHAR(50),
    video_title VARCHAR(500),
    started_at DATETIME,
    completed_at DATETIME,
    duration_ms INT,
    results JSON,
    error_message TEXT,
    error_stack TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_job_id (job_id),
    INDEX idx_status (status),
    INDEX idx_video_id (video_id),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Platform publications table - Track individual platform posts
-- =====================================================

CREATE TABLE IF NOT EXISTS platform_publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(36) NOT NULL,
    job_id VARCHAR(100) NOT NULL,
    platform ENUM('twitter', 'instagram', 'instagram_story', 'newsletter', 'website') NOT NULL,
    status ENUM('success', 'failed', 'skipped') NOT NULL,
    platform_post_id VARCHAR(200),
    platform_url VARCHAR(1000),
    error_message TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_job_id (job_id),
    INDEX idx_platform (platform),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES automation_logs(job_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Generated content cache - Store LLM generated content
-- =====================================================

CREATE TABLE IF NOT EXISTS generated_content_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(36) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    content JSON NOT NULL,
    model VARCHAR(100),
    provider VARCHAR(50),
    generated_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_video_id (video_id),
    INDEX idx_platform (platform),
    UNIQUE KEY unique_video_platform (video_id, platform),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
