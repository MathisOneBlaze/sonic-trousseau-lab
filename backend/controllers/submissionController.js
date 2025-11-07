/**
 * Submission Controller
 * Handles form submission logic
 */

import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate UUID v4
 */
function generateUUID() {
  return uuidv4();
}

/**
 * Submit contact form
 */
export async function submitContactForm(req, res) {
  try {
    const { name, email, phone, subject, message, newsletter, consent } = req.body;
    
    const id = generateUUID();
    const timestamp = new Date();
    
    const sql = `
      INSERT INTO submissions 
      (id, timestamp, source, consent, name, email, phone, subject, message, newsletter) 
      VALUES (?, ?, 'contact', ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      id,
      timestamp,
      consent,
      name,
      email,
      phone || null,
      subject || null,
      message,
      newsletter || false
    ]);
    
    console.log(`✅ Contact form submitted: ${id}`);
    
    res.status(201).json({
      success: true,
      id,
      message: 'Formulaire envoyé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du formulaire'
    });
  }
}

/**
 * Submit booking form
 */
export async function submitBookingForm(req, res) {
  try {
    const { 
      name, email, phone, formula, participants, 
      location, dates, equipment, message, consent 
    } = req.body;
    
    const id = generateUUID();
    const timestamp = new Date();
    
    const sql = `
      INSERT INTO submissions 
      (id, timestamp, source, consent, name, email, phone, formula, 
       participants, location, equipment, message) 
      VALUES (?, ?, 'booking', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      id,
      timestamp,
      consent,
      name,
      email,
      phone || null,
      formula || null,
      participants || null,
      location || null,
      equipment ? JSON.stringify(equipment) : null,
      message || null
    ]);
    
    console.log(`✅ Booking form submitted: ${id}`);
    
    res.status(201).json({
      success: true,
      id,
      message: 'Demande de réservation envoyée avec succès'
    });
    
  } catch (error) {
    console.error('❌ Error submitting booking form:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de la demande'
    });
  }
}

/**
 * Submit newsletter form
 */
export async function submitNewsletterForm(req, res) {
  try {
    const { name, email, consent } = req.body;
    
    const id = generateUUID();
    const timestamp = new Date();
    
    const sql = `
      INSERT INTO submissions 
      (id, timestamp, source, consent, name, email) 
      VALUES (?, ?, 'newsletter', ?, ?, ?)
    `;
    
    await query(sql, [
      id,
      timestamp,
      consent,
      name,
      email
    ]);
    
    console.log(`✅ Newsletter subscription: ${id}`);
    
    res.status(201).json({
      success: true,
      id,
      message: 'Inscription à la newsletter réussie'
    });
    
  } catch (error) {
    console.error('❌ Error submitting newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'inscription'
    });
  }
}

/**
 * Submit quiz form
 */
export async function submitQuizForm(req, res) {
  try {
    const { userInfo, answers, results, consent } = req.body;
    
    const id = generateUUID();
    const timestamp = new Date();
    
    const sql = `
      INSERT INTO submissions 
      (id, timestamp, source, consent, email, name, phone, quiz_user_info, quiz_answers, quiz_results) 
      VALUES (?, ?, 'quiz', ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      id,
      timestamp,
      consent,
      userInfo.email,
      userInfo.name || userInfo.pseudonym,
      userInfo.phone || null,
      JSON.stringify(userInfo),
      JSON.stringify(answers),
      JSON.stringify(results)
    ]);
    
    console.log(`✅ Quiz submitted: ${id}`);
    
    res.status(201).json({
      success: true,
      id,
      message: 'Quiz envoyé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du quiz'
    });
  }
}

/**
 * Get API health status
 */
export async function getHealthStatus(req, res) {
  try {
    // Test database connection
    await query('SELECT 1');
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
}
