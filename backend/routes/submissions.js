/**
 * Submission Routes
 * API endpoints for form submissions
 */

import express from 'express';
import {
  submitContactForm,
  submitBookingForm,
  submitNewsletterForm,
  submitQuizForm,
  getHealthStatus
} from '../controllers/submissionController.js';
import {
  validateContactForm,
  validateBookingForm,
  validateNewsletterForm,
  validateQuizForm,
  checkValidation
} from '../middleware/validation.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/health
 */
router.get('/health', getHealthStatus);

/**
 * Contact form submission
 * POST /api/submissions/contact
 */
router.post(
  '/contact',
  formLimiter,
  validateContactForm,
  checkValidation,
  submitContactForm
);

/**
 * Booking form submission
 * POST /api/submissions/booking
 */
router.post(
  '/booking',
  formLimiter,
  validateBookingForm,
  checkValidation,
  submitBookingForm
);

/**
 * Newsletter form submission
 * POST /api/submissions/newsletter
 */
router.post(
  '/newsletter',
  formLimiter,
  validateNewsletterForm,
  checkValidation,
  submitNewsletterForm
);

/**
 * Quiz form submission
 * POST /api/submissions/quiz
 */
router.post(
  '/quiz',
  formLimiter,
  validateQuizForm,
  checkValidation,
  submitQuizForm
);

export default router;
