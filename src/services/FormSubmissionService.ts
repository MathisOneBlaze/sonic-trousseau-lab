/**
 * Form Submission Service - API Client
 * Connects to backend API for form submissions
 */

import { Submission, SubmissionResult } from '@/types/submission';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Form Submission Service Class
 */
class FormSubmissionService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = API_BASE_URL;
  }

  /**
   * Submit a form to the backend API
   */
  async submitForm(data: Omit<Submission, 'id' | 'timestamp'>): Promise<SubmissionResult> {
    try {
      const endpoint = this.getEndpoint(data.source);
      
      console.log(`📨 Submitting ${data.source} form to API...`);
      
      const response = await fetch(`${this.apiUrl}/submissions/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ API error:', result);
        return {
          success: false,
          error: result.error || 'Erreur lors de l\'envoi',
        };
      }

      console.log('✅ Form submitted successfully:', result.id);
      return {
        success: true,
        id: result.id,
      };
      
    } catch (error: any) {
      console.error('❌ Network error:', error);
      return {
        success: false,
        error: 'Erreur de connexion au serveur. Veuillez réessayer.',
      };
    }
  }

  /**
   * Get the correct endpoint based on form source
   */
  private getEndpoint(source: string): string {
    switch (source) {
      case 'contact':
        return 'contact';
      case 'booking':
        return 'booking';
      case 'newsletter':
        return 'newsletter';
      case 'quiz':
        return 'quiz';
      default:
        throw new Error(`Unknown form source: ${source}`);
    }
  }

  /**
   * Check API health status
   */
  async checkHealth(): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      const result = await response.json();
      
      return {
        success: response.ok,
        status: result.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      apiUrl: this.apiUrl,
      ready: true,
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
const formSubmissionService = new FormSubmissionService();
export default formSubmissionService;
