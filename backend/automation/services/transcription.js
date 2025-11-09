/**
 * Transcription service for YouTube videos
 * Supports multiple providers: Whisper API, YouTube Transcripts, AssemblyAI
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';
import Logger from '../utils/logger.js';
import { AutomationError } from '../utils/errors.js';

const logger = new Logger('Transcription');

class TranscriptionService {
  constructor() {
    this.provider = process.env.TRANSCRIPTION_PROVIDER || 'whisper'; // 'whisper', 'youtube', 'assemblyai'
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.tempDir = process.env.TEMP_DIR || '/tmp/automation';
    
    logger.info(`Transcription service initialized (provider: ${this.provider})`);
  }

  /**
   * Transcribe a YouTube video
   * @param {object} videoData - YouTube video metadata
   * @returns {Promise<object>} Transcription result
   */
  async transcribeVideo(videoData) {
    try {
      logger.info('Starting transcription', { videoId: videoData.id, provider: this.provider });

      let transcription;
      let language = 'fr'; // Default French

      switch (this.provider) {
        case 'whisper':
          transcription = await this._transcribeWithWhisper(videoData);
          break;
        case 'youtube':
          transcription = await this._fetchYouTubeTranscript(videoData.id);
          break;
        case 'assemblyai':
          transcription = await this._transcribeWithAssemblyAI(videoData);
          break;
        default:
          throw new Error(`Unsupported transcription provider: ${this.provider}`);
      }

      // Analyze transcription for key moments
      const keyMoments = await this._identifyKeyMoments(transcription, videoData);

      logger.success('Transcription completed', { 
        videoId: videoData.id,
        length: transcription.text.length,
        keyMomentsCount: keyMoments.length
      });

      return {
        text: transcription.text,
        segments: transcription.segments || [],
        language: transcription.language || language,
        duration: transcription.duration,
        keyMoments,
        provider: this.provider,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Transcription failed', error);
      throw new AutomationError('Transcription failed', { 
        videoId: videoData.id,
        provider: this.provider,
        error: error.message 
      });
    }
  }

  /**
   * Transcribe with OpenAI Whisper API
   * @private
   */
  async _transcribeWithWhisper(videoData) {
    try {
      logger.info('Transcribing with Whisper API');

      // Step 1: Download audio from YouTube
      const audioPath = await this._downloadAudio(videoData.id);

      // Step 2: Transcribe with Whisper
      logger.info('Sending to Whisper API');
      
      const audioFile = await fs.readFile(audioPath);
      const response = await this.openai.audio.transcriptions.create({
        file: await fs.openAsBlob(audioPath),
        model: 'whisper-1',
        response_format: 'verbose_json',
        language: 'fr' // French by default
      });

      // Clean up audio file
      await fs.unlink(audioPath).catch(() => {});

      return {
        text: response.text,
        segments: response.segments || [],
        language: response.language,
        duration: response.duration
      };
    } catch (error) {
      throw new AutomationError('Whisper transcription failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Fetch transcript from YouTube (if available)
   * @private
   */
  async _fetchYouTubeTranscript(videoId) {
    try {
      logger.info('Fetching YouTube transcript');

      // Use youtube-transcript library or API
      // This is a placeholder - you'd need to implement actual YouTube Transcript API
      const { YoutubeTranscript } = await import('youtube-transcript');
      
      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: 'fr'
      });

      const text = transcript.map(item => item.text).join(' ');
      const segments = transcript.map(item => ({
        start: item.offset / 1000,
        end: (item.offset + item.duration) / 1000,
        text: item.text
      }));

      return {
        text,
        segments,
        language: 'fr',
        duration: segments[segments.length - 1]?.end || 0
      };
    } catch (error) {
      throw new AutomationError('YouTube transcript fetch failed', { 
        videoId,
        error: error.message 
      });
    }
  }

  /**
   * Transcribe with AssemblyAI
   * @private
   */
  async _transcribeWithAssemblyAI(videoData) {
    try {
      logger.info('Transcribing with AssemblyAI');

      // Download audio
      const audioPath = await this._downloadAudio(videoData.id);

      // Upload to AssemblyAI and transcribe
      // This is a placeholder - implement actual AssemblyAI integration
      
      const AssemblyAI = await import('assemblyai');
      const client = new AssemblyAI.AssemblyAI({
        apiKey: process.env.ASSEMBLYAI_API_KEY
      });

      const transcript = await client.transcripts.create({
        audio_url: audioPath, // Or upload file
        language_code: 'fr'
      });

      // Clean up
      await fs.unlink(audioPath).catch(() => {});

      return {
        text: transcript.text,
        segments: transcript.words || [],
        language: transcript.language_code,
        duration: transcript.audio_duration
      };
    } catch (error) {
      throw new AutomationError('AssemblyAI transcription failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Download audio from YouTube video
   * @private
   */
  async _downloadAudio(videoId) {
    try {
      logger.info('Downloading audio from YouTube', { videoId });

      // Ensure temp directory exists
      await fs.mkdir(this.tempDir, { recursive: true });

      const audioPath = path.join(this.tempDir, `${videoId}_audio.mp3`);

      // Use yt-dlp to download audio only
      const command = `yt-dlp -x --audio-format mp3 -o "${audioPath}" "https://www.youtube.com/watch?v=${videoId}"`;
      
      execSync(command, { stdio: 'pipe' });

      logger.success('Audio downloaded', { path: audioPath });
      return audioPath;
    } catch (error) {
      throw new AutomationError('Audio download failed', { 
        videoId,
        error: error.message 
      });
    }
  }

  /**
   * Identify key moments in transcription using LLM
   * @private
   */
  async _identifyKeyMoments(transcription, videoData) {
    try {
      logger.info('Identifying key moments with LLM');

      const prompt = `Analyse cette transcription de vidéo YouTube et identifie 3-5 moments clés à clipper.

Titre vidéo : ${videoData.title}
Durée : ${Math.floor(videoData.duration / 60)} minutes

Transcription :
${transcription.text.substring(0, 8000)}...

Pour chaque moment clé, fournis :
1. Timestamp approximatif (format MM:SS)
2. Durée idéale du clip (10-60 secondes)
3. Description courte
4. Pourquoi c'est intéressant

Format de réponse JSON :
{
  "keyMoments": [
    {
      "timestamp": "MM:SS",
      "duration": 30,
      "description": "Description",
      "reason": "Pourquoi clipper ce moment",
      "quality": 0.9
    }
  ]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Tu es un expert en édition vidéo et création de contenu viral.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      return result.keyMoments || [];
    } catch (error) {
      logger.warning('Failed to identify key moments', error);
      return [];
    }
  }

  /**
   * Generate summary from transcription
   * @param {string} transcription - Full transcription text
   * @param {object} videoData - Video metadata
   * @returns {Promise<object>} Summary and key points
   */
  async generateSummary(transcription, videoData) {
    try {
      logger.info('Generating summary with LLM');

      const prompt = `Génère un résumé structuré de cette vidéo YouTube.

Titre : ${videoData.title}
Durée : ${Math.floor(videoData.duration / 60)} minutes

Transcription :
${transcription.substring(0, 10000)}...

Fournis :
1. Un résumé court (2-3 phrases)
2. Un résumé détaillé (2-3 paragraphes)
3. Les 5-7 points clés principaux
4. Les mots-clés principaux (5-10)
5. Le ton général (éducatif, divertissant, informatif, etc.)

Format JSON.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Tu es un expert en analyse de contenu et résumé.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error('Summary generation failed', error);
      throw new AutomationError('Summary generation failed', { 
        error: error.message 
      });
    }
  }

  /**
   * Check if yt-dlp is installed
   * @returns {boolean}
   */
  async checkDependencies() {
    try {
      execSync('yt-dlp --version', { stdio: 'pipe' });
      logger.success('yt-dlp is installed');
      return true;
    } catch (error) {
      logger.error('yt-dlp is not installed');
      return false;
    }
  }
}

export default TranscriptionService;
