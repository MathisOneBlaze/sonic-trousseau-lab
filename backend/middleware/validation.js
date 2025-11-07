/**
 * Validation Middleware
 * Input validation for form submissions
 */

import { body, validationResult } from 'express-validator';

/**
 * Validation rules for contact form
 */
export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 255 }).withMessage('Le nom doit contenir entre 2 et 255 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le téléphone ne peut pas dépasser 50 caractères'),
  
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Le sujet ne peut pas dépasser 500 caractères'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10, max: 5000 }).withMessage('Le message doit contenir entre 10 et 5000 caractères'),
  
  body('newsletter')
    .optional()
    .isBoolean().withMessage('Newsletter doit être un booléen'),
  
  body('consent')
    .notEmpty().withMessage('Le consentement RGPD est requis')
    .isBoolean().withMessage('Le consentement doit être un booléen')
    .equals('true').withMessage('Vous devez accepter le traitement de vos données')
];

/**
 * Validation rules for booking form
 */
export const validateBookingForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 255 }).withMessage('Le nom doit contenir entre 2 et 255 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le téléphone ne peut pas dépasser 50 caractères'),
  
  body('formula')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('La formule ne peut pas dépasser 255 caractères'),
  
  body('participants')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Le nombre de participants ne peut pas dépasser 100 caractères'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Le lieu ne peut pas dépasser 255 caractères'),
  
  body('dates')
    .optional()
    .trim(),
  
  body('equipment')
    .optional()
    .isArray().withMessage('Equipment doit être un tableau'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Le message ne peut pas dépasser 5000 caractères'),
  
  body('consent')
    .notEmpty().withMessage('Le consentement RGPD est requis')
    .isBoolean().withMessage('Le consentement doit être un booléen')
    .equals('true').withMessage('Vous devez accepter le traitement de vos données')
];

/**
 * Validation rules for newsletter form
 */
export const validateNewsletterForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 255 }).withMessage('Le nom doit contenir entre 2 et 255 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('consent')
    .notEmpty().withMessage('Le consentement RGPD est requis')
    .isBoolean().withMessage('Le consentement doit être un booléen')
    .equals('true').withMessage('Vous devez accepter le traitement de vos données')
];

/**
 * Validation rules for quiz form
 */
export const validateQuizForm = [
  body('userInfo')
    .notEmpty().withMessage('Les informations utilisateur sont requises')
    .isObject().withMessage('userInfo doit être un objet'),
  
  body('userInfo.name')
    .trim()
    .notEmpty().withMessage('Le nom est requis'),
  
  body('userInfo.email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide'),
  
  body('answers')
    .notEmpty().withMessage('Les réponses sont requises')
    .isArray().withMessage('answers doit être un tableau'),
  
  body('results')
    .notEmpty().withMessage('Les résultats sont requis')
    .isObject().withMessage('results doit être un objet'),
  
  body('consent')
    .notEmpty().withMessage('Le consentement RGPD est requis')
    .isBoolean().withMessage('Le consentement doit être un booléen')
    .equals('true').withMessage('Vous devez accepter le traitement de vos données')
];

/**
 * Middleware to check validation results
 */
export function checkValidation(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation échouée',
      details: errors.array()
    });
  }
  
  next();
}
