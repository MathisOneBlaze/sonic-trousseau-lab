/**
 * Step Tracker - Utility for tracking automation workflow steps
 * Records detailed information about each step in the automation process
 */

import Logger from './logger.js';

const logger = new Logger('StepTracker');

class StepTracker {
  constructor(jobId, db) {
    this.jobId = jobId;
    this.db = db;
    this.steps = {};
    this.totalSteps = 8; // transcription, llm, tweet, thread, images, twitter, website, email
  }

  /**
   * Record the start of a step
   */
  async startStep(stepName, metadata = {}) {
    const timestamp = new Date().toISOString();
    
    this.steps[stepName] = {
      status: 'in_progress',
      started_at: timestamp,
      ...metadata
    };

    await this._saveSteps();
    logger.info(`Step started: ${stepName}`, { jobId: this.jobId });
  }

  /**
   * Record the successful completion of a step
   */
  async completeStep(stepName, result = {}) {
    if (!this.steps[stepName]) {
      this.steps[stepName] = {};
    }

    const completedAt = new Date().toISOString();
    const startedAt = this.steps[stepName].started_at;
    
    const duration = startedAt 
      ? new Date(completedAt) - new Date(startedAt)
      : null;

    this.steps[stepName] = {
      ...this.steps[stepName],
      status: 'completed',
      completed_at: completedAt,
      duration_ms: duration,
      ...result
    };

    await this._saveSteps();
    logger.success(`Step completed: ${stepName}`, { 
      jobId: this.jobId,
      duration: duration ? `${(duration / 1000).toFixed(2)}s` : 'N/A'
    });
  }

  /**
   * Record a step failure
   */
  async failStep(stepName, error) {
    if (!this.steps[stepName]) {
      this.steps[stepName] = {};
    }

    this.steps[stepName] = {
      ...this.steps[stepName],
      status: 'failed',
      failed_at: new Date().toISOString(),
      error: error.message || String(error)
    };

    await this._saveSteps();
    logger.error(`Step failed: ${stepName}`, error);
  }

  /**
   * Skip a step (e.g., dry-run mode)
   */
  async skipStep(stepName, reason = 'skipped') {
    this.steps[stepName] = {
      status: 'skipped',
      timestamp: new Date().toISOString(),
      reason
    };

    await this._saveSteps();
    logger.info(`Step skipped: ${stepName}`, { jobId: this.jobId, reason });
  }

  /**
   * Save steps to database
   * @private
   */
  async _saveSteps() {
    try {
      const progress = this._calculateProgress();
      
      await this.db.query(
        `UPDATE automation_logs 
         SET steps_details = ?, progress_percentage = ?
         WHERE job_id = ?`,
        [JSON.stringify(this.steps), progress, this.jobId]
      );
    } catch (error) {
      logger.error('Failed to save steps', error);
    }
  }

  /**
   * Calculate progress percentage based on completed steps
   * @private
   */
  _calculateProgress() {
    const completedCount = Object.values(this.steps).filter(
      step => step.status === 'completed'
    ).length;

    return Math.round((completedCount / this.totalSteps) * 100);
  }

  /**
   * Get all steps
   */
  getSteps() {
    return this.steps;
  }

  /**
   * Get progress percentage
   */
  getProgress() {
    return this._calculateProgress();
  }
}

export default StepTracker;
