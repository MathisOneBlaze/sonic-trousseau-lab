// Basic adapter tests

import { describe, it, expect } from 'vitest';
import StorageMock from '../src/services/adapters/storage/StorageMock';
import MailMock from '../src/services/adapters/mailer/MailMock';
import type { ContactSubmission } from '../src/types/submission';

describe('StorageMock', () => {
  it('should save and retrieve submissions', async () => {
    const storage = new StorageMock();
    const submission: ContactSubmission = {
      id: 'test-1',
      timestamp: new Date().toISOString(),
      source: 'contact',
      consent: true,
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      newsletter: false
    };

    const result = await storage.saveSubmission(submission);
    expect(result.success).toBe(true);
    expect(result.mock).toBe(true);

    const exported = await storage.exportAll();
    expect(exported).toHaveLength(1);
    expect(exported[0].id).toBe('test-1');
  });

  it('should validate schema', () => {
    const storage = new StorageMock();
    expect(storage.validateSchema({
      id: 'test',
      timestamp: new Date().toISOString(),
      source: 'contact',
      consent: true,
      name: 'Test',
      email: 'test@example.com',
      message: 'Message'
    } as ContactSubmission)).toBe(true);

    expect(storage.validateSchema({
      id: 'test',
      timestamp: new Date().toISOString(),
      source: 'contact',
      consent: false
    } as any)).toBe(false);
  });
});

describe('MailMock', () => {
  it('should simulate email sending', async () => {
    const mailer = new MailMock();
    const submission: ContactSubmission = {
      id: 'test-1',
      timestamp: new Date().toISOString(),
      source: 'contact',
      consent: true,
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test',
      newsletter: false
    };

    const result = await mailer.sendNotification(submission, 'admin@example.com');
    expect(result.success).toBe(true);
    expect(result.mock).toBe(true);
  });
});
