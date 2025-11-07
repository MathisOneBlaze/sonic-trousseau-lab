// Mock Mailer Adapter - simulates email sending for development

import { Submission, SubmissionResult } from '@/types/submission';
import { MailerAdapter } from './MailerAdapter';

class MailMock implements MailerAdapter {
  async sendNotification(submission: Submission, recipientEmail: string): Promise<SubmissionResult> {
    // Simulate email sending
    console.log('[MailMock] Simulating email send to:', recipientEmail);
    console.log('[MailMock] Subject:', this.generateSubject(submission));
    console.log('[MailMock] Body preview:', this.generateBody(submission).substring(0, 200));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      id: submission.id,
      mock: true
    };
  }

  getProvider(): string {
    return 'mock';
  }

  private generateSubject(submission: Submission): string {
    switch (submission.source) {
      case 'contact':
        return `[Le Trousseau] Nouveau message de contact - ${submission.name}`;
      case 'newsletter':
        return `[Le Trousseau] Nouvelle inscription newsletter - ${submission.name}`;
      case 'quiz':
        return `[Le Trousseau] Quiz terminé - ${submission.userInfo.name} (${submission.results.archetype})`;
      case 'booking':
        return `[Le Trousseau] Demande de réservation - ${submission.name}`;
      default:
        return '[Le Trousseau] Nouvelle soumission';
    }
  }

  private generateBody(submission: Submission): string {
    const base = `
Nouvelle soumission reçue le ${new Date(submission.timestamp).toLocaleString('fr-FR')}

Type: ${submission.source}
ID: ${submission.id}
Consentement RGPD: ${submission.consent ? 'Oui' : 'Non'}

---
`;

    switch (submission.source) {
      case 'contact':
        return base + `
Nom: ${submission.name}
Email: ${submission.email}
Téléphone: ${submission.phone || 'Non fourni'}
Objet: ${submission.subject || 'Non fourni'}
Message:
${submission.message}

Newsletter: ${submission.newsletter ? 'Oui' : 'Non'}
`;

      case 'newsletter':
        return base + `
Nom: ${submission.name}
Email: ${submission.email}
`;

      case 'quiz':
        return base + `
Nom: ${submission.userInfo.name}
Pseudonyme: ${submission.userInfo.pseudonym}
Email: ${submission.userInfo.email}
Téléphone: ${submission.userInfo.phone}
Âge: ${submission.userInfo.age}
Localisation: ${submission.userInfo.location}

Score: ${submission.results.score}/100
Archétype: ${submission.results.archetype}
Offre recommandée: ${submission.results.recommendedOffer}

Statistiques:
${Object.entries(submission.results.stats).map(([key, val]) => `  ${key}: ${val}`).join('\n')}

Réponses: ${submission.answers.length} questions répondues
`;

      case 'booking':
        return base + `
Nom: ${submission.name}
Email: ${submission.email}
Téléphone: ${submission.phone}
Formule: ${submission.formula || 'Non fourni'}
Participants: ${submission.participants || 'Non fourni'}
Localisation: ${submission.location || 'Non fourni'}
Équipements: ${submission.equipment?.join(', ') || 'Aucun'}
Message: ${submission.message || 'Non fourni'}
`;

      default:
        return base + JSON.stringify(submission, null, 2);
    }
  }
}

export default MailMock;
