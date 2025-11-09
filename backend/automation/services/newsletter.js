/**
 * Newsletter service for sending emails
 * Supports Brevo (formerly Sendinblue), Mailchimp, and SendGrid
 */

import Logger from '../utils/logger.js';
import { PublicationError } from '../utils/errors.js';

const logger = new Logger('Newsletter');

class NewsletterService {
  constructor() {
    this.provider = process.env.NEWSLETTER_PROVIDER || 'brevo'; // 'brevo', 'mailchimp', 'sendgrid'
    this.enabled = process.env.NEWSLETTER_ENABLED === 'true';
    
    // Brevo configuration
    this.brevoApiKey = process.env.BREVO_API_KEY;
    this.brevoListId = process.env.BREVO_LIST_ID;
    
    // Mailchimp configuration
    this.mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
    this.mailchimpListId = process.env.MAILCHIMP_LIST_ID;
    
    // SendGrid configuration
    this.sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    logger.info(`Newsletter service initialized (provider: ${this.provider}, enabled: ${this.enabled})`);
  }

  /**
   * Send newsletter email
   * @param {object} content - Generated email content from LLM
   * @param {object} options - Additional options
   * @returns {Promise<object>} Send response
   */
  async sendNewsletter(content, options = {}) {
    if (!this.enabled) {
      logger.warning('Newsletter sending is disabled');
      return { skipped: true, reason: 'disabled' };
    }

    try {
      logger.info('Sending newsletter', { subject: content.subject });

      let result;
      
      switch (this.provider) {
        case 'brevo':
          result = await this._sendWithBrevo(content, options);
          break;
        case 'mailchimp':
          result = await this._sendWithMailchimp(content, options);
          break;
        case 'sendgrid':
          result = await this._sendWithSendGrid(content, options);
          break;
        default:
          throw new Error(`Unsupported newsletter provider: ${this.provider}`);
      }

      logger.success('Newsletter sent successfully', { 
        messageId: result.messageId,
        recipientCount: result.recipientCount 
      });

      return {
        success: true,
        ...result,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to send newsletter', error);
      throw new PublicationError('newsletter', 'Failed to send newsletter', { 
        error: error.message 
      });
    }
  }

  /**
   * Send with Brevo (Sendinblue)
   * @private
   */
  async _sendWithBrevo(content, options) {
    try {
      const url = 'https://api.brevo.com/v3/smtp/email';
      
      const emailData = {
        sender: {
          name: options.senderName || 'Le Trousseau',
          email: options.senderEmail || process.env.NEWSLETTER_FROM_EMAIL
        },
        to: options.testEmail ? [{ email: options.testEmail }] : [],
        subject: content.subject,
        htmlContent: this._wrapEmailHtml(content.body, content.preheader),
        ...(content.preheader && { headers: { 'X-Mailin-Preheader': content.preheader } })
      };

      // If not test mode, send to list
      if (!options.testEmail && this.brevoListId) {
        emailData.messageVersions = [{
          to: [{ listIds: [parseInt(this.brevoListId)] }]
        }];
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Brevo API error');
      }

      return {
        messageId: data.messageId,
        provider: 'brevo',
        recipientCount: options.testEmail ? 1 : 'list'
      };
    } catch (error) {
      throw new PublicationError('newsletter', 'Brevo send failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Send with Mailchimp
   * @private
   */
  async _sendWithMailchimp(content, options) {
    try {
      // Extract datacenter from API key (e.g., us19)
      const datacenter = this.mailchimpApiKey.split('-')[1];
      const url = `https://${datacenter}.api.mailchimp.com/3.0/campaigns`;

      // Create campaign
      const campaignResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.mailchimpApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'regular',
          recipients: {
            list_id: this.mailchimpListId
          },
          settings: {
            subject_line: content.subject,
            preview_text: content.preheader,
            from_name: options.senderName || 'Le Trousseau',
            reply_to: options.replyTo || process.env.NEWSLETTER_FROM_EMAIL
          }
        })
      });

      const campaign = await campaignResponse.json();
      
      if (!campaignResponse.ok) {
        throw new Error(campaign.detail || 'Failed to create campaign');
      }

      // Set content
      await fetch(`${url}/${campaign.id}/content`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.mailchimpApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          html: this._wrapEmailHtml(content.body, content.preheader)
        })
      });

      // Send campaign (or schedule)
      if (!options.testMode) {
        await fetch(`${url}/${campaign.id}/actions/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.mailchimpApiKey}`
          }
        });
      }

      return {
        campaignId: campaign.id,
        provider: 'mailchimp',
        recipientCount: 'list',
        testMode: options.testMode || false
      };
    } catch (error) {
      throw new PublicationError('newsletter', 'Mailchimp send failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Send with SendGrid
   * @private
   */
  async _sendWithSendGrid(content, options) {
    try {
      const url = 'https://api.sendgrid.com/v3/mail/send';

      const emailData = {
        personalizations: [{
          to: options.testEmail 
            ? [{ email: options.testEmail }] 
            : [{ email: process.env.NEWSLETTER_FROM_EMAIL }], // Will use list in production
          subject: content.subject
        }],
        from: {
          email: options.senderEmail || process.env.NEWSLETTER_FROM_EMAIL,
          name: options.senderName || 'Le Trousseau'
        },
        content: [{
          type: 'text/html',
          value: this._wrapEmailHtml(content.body, content.preheader)
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'SendGrid API error');
      }

      return {
        messageId: response.headers.get('X-Message-Id'),
        provider: 'sendgrid',
        recipientCount: options.testEmail ? 1 : 'list'
      };
    } catch (error) {
      throw new PublicationError('newsletter', 'SendGrid send failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Wrap email HTML with basic template
   * @private
   */
  _wrapEmailHtml(body, preheader = '') {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Le Trousseau - Newsletter</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .preheader { display: none; max-height: 0; overflow: hidden; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  ${preheader ? `<span class="preheader">${preheader}</span>` : ''}
  <div class="container">
    ${body}
    <div class="footer">
      <p>Vous recevez cet email car vous êtes inscrit à la newsletter du Trousseau.</p>
      <p><a href="{{unsubscribe}}">Se désinscrire</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Test newsletter connection
   * @returns {Promise<boolean>} Success status
   */
  async testConnection() {
    try {
      logger.info('Testing newsletter connection...');

      // Simple test based on provider
      const testContent = {
        subject: 'Test de connexion',
        body: '<p>Test</p>',
        preheader: 'Test'
      };

      const result = await this.sendNewsletter(testContent, {
        testEmail: process.env.TEST_EMAIL || 'test@example.com'
      });

      logger.success('Newsletter connection successful');
      return true;
    } catch (error) {
      logger.error('Newsletter connection test failed', error);
      return false;
    }
  }
}

export default NewsletterService;
