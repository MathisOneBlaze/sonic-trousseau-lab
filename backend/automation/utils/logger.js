/**
 * Logger utility for automation service
 * Provides structured logging with emojis for better readability
 */

class Logger {
  constructor(serviceName = 'Automation') {
    this.serviceName = serviceName;
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      service: this.serviceName,
      level,
      message,
      ...(data && { data })
    };
    return logData;
  }

  info(message, data = null) {
    const log = this._formatMessage('INFO', message, data);
    console.log(`ℹ️  [${log.timestamp}] [${this.serviceName}] ${message}`, data || '');
  }

  success(message, data = null) {
    const log = this._formatMessage('SUCCESS', message, data);
    console.log(`✅ [${log.timestamp}] [${this.serviceName}] ${message}`, data || '');
  }

  warning(message, data = null) {
    const log = this._formatMessage('WARNING', message, data);
    console.warn(`⚠️  [${log.timestamp}] [${this.serviceName}] ${message}`, data || '');
  }

  error(message, error = null) {
    const log = this._formatMessage('ERROR', message, {
      error: error?.message,
      stack: error?.stack
    });
    console.error(`❌ [${log.timestamp}] [${this.serviceName}] ${message}`, error || '');
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const log = this._formatMessage('DEBUG', message, data);
      console.log(`🐛 [${log.timestamp}] [${this.serviceName}] ${message}`, data || '');
    }
  }

  job(message, jobData = null) {
    const log = this._formatMessage('JOB', message, jobData);
    console.log(`🔄 [${log.timestamp}] [${this.serviceName}] ${message}`, jobData || '');
  }
}

export default Logger;
