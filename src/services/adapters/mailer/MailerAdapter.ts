// Mailer Adapter Interface - abstraction layer for email notifications

import { Submission, SubmissionResult } from '@/types/submission';

export interface MailerAdapter {
  /**
   * Send notification email with submission data
   * @param submission - The submission to notify about
   * @param recipientEmail - Email address to send to
   * @returns Promise with result status
   */
  sendNotification(submission: Submission, recipientEmail: string): Promise<SubmissionResult>;

  /**
   * Get mailer provider name
   */
  getProvider(): string;
}
