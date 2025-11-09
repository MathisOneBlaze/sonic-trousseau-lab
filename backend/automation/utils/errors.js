/**
 * Custom error classes for automation service
 */

export class AutomationError extends Error {
  constructor(message, code = 'AUTOMATION_ERROR', details = null) {
    super(message);
    this.name = 'AutomationError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class YouTubeError extends AutomationError {
  constructor(message, details = null) {
    super(message, 'YOUTUBE_ERROR', details);
    this.name = 'YouTubeError';
  }
}

export class LLMError extends AutomationError {
  constructor(message, details = null) {
    super(message, 'LLM_ERROR', details);
    this.name = 'LLMError';
  }
}

export class PublicationError extends AutomationError {
  constructor(platform, message, details = null) {
    super(message, `${platform.toUpperCase()}_ERROR`, details);
    this.name = 'PublicationError';
    this.platform = platform;
  }
}

export class RateLimitError extends AutomationError {
  constructor(platform, retryAfter = null) {
    super(
      `Rate limit exceeded for ${platform}`,
      'RATE_LIMIT_ERROR',
      { platform, retryAfter }
    );
    this.name = 'RateLimitError';
    this.platform = platform;
    this.retryAfter = retryAfter;
  }
}
