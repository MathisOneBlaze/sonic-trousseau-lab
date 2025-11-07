// Mock Storage Adapter - volatile in-memory storage for development

import { Submission, SubmissionResult, ExportOptions } from '@/types/submission';
import { StorageAdapter } from './StorageAdapter';

class StorageMock implements StorageAdapter {
  private submissions: Submission[] = [];

  async saveSubmission(submission: Submission): Promise<SubmissionResult> {
    // Validate schema
    if (!this.validateSchema(submission)) {
      return {
        success: false,
        error: 'Invalid submission schema',
        mock: true
      };
    }

    // Store in memory (volatile - lost on page refresh)
    this.submissions.push(submission);

    console.log('[StorageMock] Submission saved (volatile):', submission.id);

    return {
      success: true,
      id: submission.id,
      mock: true
    };
  }

  async exportAll(options?: ExportOptions): Promise<Submission[]> {
    let filtered = [...this.submissions];

    // Apply filters if provided
    if (options?.startDate) {
      filtered = filtered.filter(s => s.timestamp >= options.startDate!);
    }
    if (options?.endDate) {
      filtered = filtered.filter(s => s.timestamp <= options.endDate!);
    }
    if (options?.source) {
      filtered = filtered.filter(s => s.source === options.source);
    }

    console.log(`[StorageMock] Exporting ${filtered.length} submissions`);
    return filtered;
  }

  validateSchema(submission: Submission): boolean {
    // Basic validation
    if (!submission.id || !submission.timestamp || typeof submission.consent !== 'boolean') {
      return false;
    }

    // Validate required fields per source type
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
    return 'mock';
  }

  // Debug method - not in interface
  getSubmissionCount(): number {
    return this.submissions.length;
  }
}

export default StorageMock;
