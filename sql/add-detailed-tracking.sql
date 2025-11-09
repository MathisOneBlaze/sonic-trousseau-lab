-- Ajout du suivi détaillé des étapes dans automation_logs

ALTER TABLE automation_logs 
ADD COLUMN steps_details JSON AFTER results,
ADD COLUMN progress_percentage INT DEFAULT 0 AFTER steps_details;

-- Commentaire sur la structure attendue de steps_details
-- {
--   "transcription": {"status": "completed", "timestamp": "...", "duration_ms": 240000, ...},
--   "llm_analysis": {"status": "completed", "timestamp": "...", ...},
--   "content_generation": {
--     "tweet": {"status": "completed", ...},
--     "thread": {"status": "completed", "tweet_count": 5, ...},
--     "images": {"status": "completed", "count": 3, ...}
--   },
--   "publications": {
--     "twitter": {"status": "published", "url": "...", ...},
--     "website": {"status": "published", ...},
--     "email": {"status": "sent", "recipients_count": 245, ...}
--   }
-- }

-- Ajouter un index sur le progress_percentage pour filtres
CREATE INDEX idx_progress ON automation_logs(progress_percentage);
