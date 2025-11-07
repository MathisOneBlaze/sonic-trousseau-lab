// SMTP Mailer Adapter - STUB for future implementation
// This will be implemented when migrating to Hostinger

import { Submission, SubmissionResult } from '@/types/submission';
import { MailerAdapter } from './MailerAdapter';

/**
 * SMTP Mailer Adapter (Hostinger SMTP)
 * 
 * IMPLEMENTATION INSTRUCTIONS:
 * 1. Install nodemailer or similar SMTP client
 * 2. Configure connection using env vars:
 *    - SMTP_HOST (ex: smtp.hostinger.com)
 *    - SMTP_PORT (ex: 587)
 *    - SMTP_USER (your email)
 *    - SMTP_PASS (your password)
 *    - NOTIFICATION_EMAIL (recipient for notifications)
 * 3. Implement sendNotification using nodemailer.sendMail
 * 4. Add error handling and retry logic
 * 
 * Example implementation:
 * import nodemailer from 'nodemailer';
 * 
 * const transporter = nodemailer.createTransport({
 *   host: process.env.SMTP_HOST,
 *   port: parseInt(process.env.SMTP_PORT),
 *   secure: false,
 *   auth: {
 *     user: process.env.SMTP_USER,
 *     pass: process.env.SMTP_PASS,
 *   },
 * });
 * 
 * await transporter.sendMail({
 *   from: process.env.SMTP_USER,
 *   to: recipientEmail,
 *   subject: subject,
 *   text: body,
 *   html: htmlBody,
 * });
 */

class SMTPAdapter implements MailerAdapter {
  async sendNotification(submission: Submission, recipientEmail: string): Promise<SubmissionResult> {
    throw new Error('SMTPAdapter not implemented - activate via env vars after migration');
  }

  getProvider(): string {
    return 'smtp';
  }
}

export default SMTPAdapter;
