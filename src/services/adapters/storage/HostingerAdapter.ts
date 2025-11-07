// Hostinger MySQL Adapter - STUB for future implementation
// This will be implemented when migrating to Hostinger

import { Submission, SubmissionResult, ExportOptions } from '@/types/submission';
import { StorageAdapter } from './StorageAdapter';

/**
 * Hostinger MySQL Adapter
 * 
 * IMPLEMENTATION INSTRUCTIONS:
 * 1. Install mysql2 or similar MySQL client
 * 2. Configure connection using env vars:
 *    - DB_HOST
 *    - DB_NAME
 *    - DB_USER
 *    - DB_PASS
 * 3. Implement saveSubmission: INSERT INTO submissions
 * 4. Implement exportAll: SELECT * FROM submissions WHERE ...
 * 5. Add connection pooling and error handling
 * 
 * Example connection:
 * const pool = mysql.createPool({
 *   host: process.env.DB_HOST,
 *   database: process.env.DB_NAME,
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASS,
 * });
 */

class HostingerAdapter implements StorageAdapter {
  async saveSubmission(submission: Submission): Promise<SubmissionResult> {
    throw new Error('HostingerAdapter not implemented - activate via env vars after migration');
  }

  async exportAll(options?: ExportOptions): Promise<Submission[]> {
    throw new Error('HostingerAdapter not implemented - activate via env vars after migration');
  }

  validateSchema(submission: Submission): boolean {
    // Same validation as StorageMock
    if (!submission.id || !submission.timestamp || typeof submission.consent !== 'boolean') {
      return false;
    }

    switch (submission.source) {
      case 'contact':
        return !!(submission.name && submission.email && submission.message);
      case 'newsletter':
        return !!(submission.name && submission.email);
      case 'quiz':
        return !!(submission.userInfo && submission.answers && submission.results);
      case 'booking':
        return !!(submission.name && submission.email && submission.phone);
      default:
        return false;
    }
  }

  getProvider(): string {
    return 'hostinger_mysql';
  }
}

export default HostingerAdapter;
