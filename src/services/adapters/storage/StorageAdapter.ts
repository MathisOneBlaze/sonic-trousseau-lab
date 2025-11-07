// Storage Adapter Interface - abstraction layer for data persistence

import { Submission, SubmissionResult, ExportOptions } from '@/types/submission';

export interface StorageAdapter {
  /**
   * Save a submission to storage
   * @param submission - The submission data to save
   * @returns Promise with result containing id and status
   */
  saveSubmission(submission: Submission): Promise<SubmissionResult>;

  /**
   * Retrieve all submissions (admin only)
   * @param options - Optional filters and format
   * @returns Promise with array of submissions
   */
  exportAll(options?: ExportOptions): Promise<Submission[]>;

  /**
   * Validate submission schema
   * @param submission - The submission to validate
   * @returns true if valid, false otherwise
   */
  validateSchema(submission: Submission): boolean;

  /**
   * Get storage provider name
   */
  getProvider(): string;
}
