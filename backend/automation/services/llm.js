/**
 * LLM service for content generation
 * Supports OpenAI (GPT-4) and Anthropic (Claude)
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Logger from '../utils/logger.js';
import { LLMError } from '../utils/errors.js';
import { getPromptForPlatform } from '../config/prompts.js';

const logger = new Logger('LLM');

class LLMService {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'openai'; // 'openai' or 'anthropic'
    
    if (this.provider === 'openai') {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    } else if (this.provider === 'anthropic') {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
      this.model = process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229';
    }

    logger.info(`LLM service initialized with provider: ${this.provider}`);
  }

  /**
   * Generate content for a specific platform
   * @param {string} platform - Platform name (TWITTER, INSTAGRAM, etc.)
   * @param {object} videoData - Video metadata
   * @param {object} options - Additional options
   * @returns {Promise<object>} Generated content
   */
  async generateContent(platform, videoData, options = {}) {
    try {
      logger.info(`Generating content for ${platform}`, { videoTitle: videoData.title });

      const { system, user } = getPromptForPlatform(platform, videoData);

      let response;
      if (this.provider === 'openai') {
        response = await this._generateWithOpenAI(system, user, options);
      } else if (this.provider === 'anthropic') {
        response = await this._generateWithAnthropic(system, user, options);
      }

      // Parse JSON response
      const content = this._parseResponse(response);
      
      logger.success(`Content generated for ${platform}`, { 
        contentLength: JSON.stringify(content).length 
      });

      return {
        platform,
        content,
        model: this.model,
        provider: this.provider,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Failed to generate content for ${platform}`, error);
      throw new LLMError(`Failed to generate content for ${platform}`, { 
        platform, 
        error: error.message 
      });
    }
  }

  /**
   * Generate content for all platforms
   * @param {object} videoData - Video metadata
   * @returns {Promise<object>} Content for all platforms
   */
  async generateAllContent(videoData) {
    try {
      logger.info('Generating content for all platforms', { videoTitle: videoData.title });

      const platforms = ['TWITTER', 'INSTAGRAM', 'INSTAGRAM_STORY', 'WEBSITE_ARTICLE', 'NEWSLETTER'];
      const results = {};

      // Generate content for each platform sequentially to avoid rate limits
      for (const platform of platforms) {
        try {
          results[platform] = await this.generateContent(platform, videoData);
          
          // Small delay between requests to avoid rate limits
          await this._delay(1000);
        } catch (error) {
          logger.warning(`Failed to generate content for ${platform}`, error);
          results[platform] = {
            error: error.message,
            platform
          };
        }
      }

      logger.success('Content generation completed for all platforms');
      return results;
    } catch (error) {
      logger.error('Failed to generate content for all platforms', error);
      throw new LLMError('Failed to generate content for all platforms', { error: error.message });
    }
  }

  /**
   * Generate content with OpenAI
   * @private
   */
  async _generateWithOpenAI(systemPrompt, userPrompt, options = {}) {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        response_format: { type: 'json_object' }
      });

      return completion.choices[0].message.content;
    } catch (error) {
      throw new LLMError('OpenAI API error', { error: error.message });
    }
  }

  /**
   * Generate content with Anthropic Claude
   * @private
   */
  async _generateWithAnthropic(systemPrompt, userPrompt, options = {}) {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      });

      return message.content[0].text;
    } catch (error) {
      throw new LLMError('Anthropic API error', { error: error.message });
    }
  }

  /**
   * Parse LLM response
   * @private
   */
  _parseResponse(response) {
    try {
      // Try to parse as JSON
      return JSON.parse(response);
    } catch (error) {
      // If not valid JSON, try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // If still fails, return raw response
      logger.warning('Failed to parse JSON response, returning raw text');
      return { text: response };
    }
  }

  /**
   * Delay utility
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test connection to LLM provider
   * @returns {Promise<boolean>} Success status
   */
  async testConnection() {
    try {
      logger.info('Testing LLM connection...');

      const testPrompt = 'Réponds simplement "OK" en JSON: {"status": "ok"}';
      
      let response;
      if (this.provider === 'openai') {
        response = await this._generateWithOpenAI('Tu es un assistant', testPrompt);
      } else {
        response = await this._generateWithAnthropic('Tu es un assistant', testPrompt);
      }

      const parsed = this._parseResponse(response);
      const success = parsed.status === 'ok';

      if (success) {
        logger.success('LLM connection successful');
      } else {
        logger.warning('LLM connection test returned unexpected response');
      }

      return success;
    } catch (error) {
      logger.error('LLM connection test failed', error);
      return false;
    }
  }
}

export default LLMService;
