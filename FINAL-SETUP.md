# 🎯 Configuration finale - Instructions manuelles

## Vous devez exécuter ces 2 étapes sur le VPS

### Étape 1 : Se connecter au VPS

```bash
ssh root@168.231.85.181
```

### Étape 2 : Se connecter à MySQL root

```bash
mysql -u root -p
# Entrez votre mot de passe root MySQL
```

### Étape 3 : Copier-coller ce SQL dans MySQL

```sql
-- Créer la base dédiée à l'automatisation
CREATE DATABASE IF NOT EXISTS letrousseau_automation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Donner les permissions à letrousseau_app
GRANT ALL PRIVILEGES ON letrousseau_automation.* TO 'letrousseau_app'@'localhost';
FLUSH PRIVILEGES;

-- Créer les tables
USE letrousseau_automation;

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  youtube_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  published_at DATETIME NOT NULL,
  thumbnail_url VARCHAR(500),
  duration INT,
  view_count INT DEFAULT 0,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_youtube_id (youtube_id),
  INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS automation_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(50) UNIQUE NOT NULL,
  video_id VARCHAR(20),
  video_title VARCHAR(255),
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  duration_ms INT,
  platforms_enabled JSON,
  results JSON,
  error_message TEXT,
  INDEX idx_job_id (job_id),
  INDEX idx_video_id (video_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS platform_publications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(50) NOT NULL,
  platform ENUM('twitter', 'instagram', 'newsletter', 'website') NOT NULL,
  publication_id VARCHAR(100),
  status ENUM('pending', 'published', 'failed') DEFAULT 'pending',
  published_at TIMESTAMP NULL,
  metadata JSON,
  error_message TEXT,
  INDEX idx_job_id (job_id),
  INDEX idx_platform (platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Vérifier que tout est créé
SHOW TABLES;

EXIT;
```

### Étape 4 : Mettre à jour la config backend et redémarrer

```bash
cd /var/www/letrousseau/backend
sed -i 's/DB_NAME=.*/DB_NAME=letrousseau_automation/' .env
pm2 restart letrousseau-api --update-env
pm2 logs letrousseau-api --lines 10
```

### Étape 5 : Vérifier

```bash
# Attendre 10 secondes
sleep 10

# Tester l'API
curl http://localhost:3001/api/health

# Ouvrir dans le browser
# http://168.231.85.181:3001/monitoring/monitoring.html
```

---

## ✅ C'est terminé !

L'automatisation tournera 24/7 et vérifiera YouTube toutes les 15 minutes.

Mode DRY_RUN=true → simule seulement (pas de publication réelle)
Pour activer : changez AUTOMATION_DRY_RUN=false dans /var/www/letrousseau/backend/.env
