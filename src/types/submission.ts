// Submission schema - compatible with MySQL and future backends

export interface BaseSubmission {
  id: string;
  timestamp: string;
  consent: boolean;
  source: 'contact' | 'newsletter' | 'quiz' | 'booking';
}

export interface ContactSubmission extends BaseSubmission {
  source: 'contact';
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  newsletter: boolean;
}

export interface NewsletterSubmission extends BaseSubmission {
  source: 'newsletter';
  name: string;
  email: string;
}

export interface QuizSubmission extends BaseSubmission {
  source: 'quiz';
  userInfo: {
    name: string;
    pseudonym: string;
    email: string;
    phone: string;
    age: string;
    location: string;
  };
  answers: Array<{
    questionId: number;
    answer: string | number;
    value?: number;
  }>;
  results: {
    score: number;
    archetype: string;
    stats: Record<string, number>;
    recommendedOffer: string;
  };
}

export interface BookingSubmission extends BaseSubmission {
  source: 'booking';
  name: string;
  email: string;
  phone?: string;
  formula?: string;
  participants?: string;
  location?: string;
  dates?: string;
  equipment?: string[];
  message?: string;
}

export type Submission = 
  | ContactSubmission 
  | NewsletterSubmission 
  | QuizSubmission 
  | BookingSubmission;

export interface SubmissionResult {
  success: boolean;
  id?: string;
  error?: string;
  mock?: boolean;
}

export interface ExportOptions {
  format: 'json' | 'csv';
  startDate?: string;
  endDate?: string;
  source?: string;
}
