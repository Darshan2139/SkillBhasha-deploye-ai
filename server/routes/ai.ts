import { Request, Response } from 'express';
import { geminiService, ContentGenerationRequest, ChatMessage } from '../../shared/gemini';

// Generate AI content
export const generateContent = async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      language = 'en',
      domain = 'general',
      difficulty = 'beginner',
      contentType = 'text',
      includeImages = false,
      includeVideo = false,
      includeQuiz = false
    }: ContentGenerationRequest = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await geminiService.generateContent({
      prompt,
      language,
      domain,
      difficulty,
      contentType,
      includeImages,
      includeVideo,
      includeQuiz
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Content generation failed' });
    }

    res.json({
      success: true,
      content: result.text,
      metadata: {
        language,
        domain,
        difficulty,
        contentType,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in generateContent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Chat with AI
export const chat = async (req: Request, res: Response) => {
  try {
    const { messages }: { messages: ChatMessage[] } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const result = await geminiService.chat(messages);

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Chat failed' });
    }

    res.json({
      success: true,
      message: {
        role: 'assistant',
        content: result.text,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Translate text
export const translate = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage, sourceLanguage = 'auto' } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and target language are required' });
    }

    const result = await geminiService.translateText(text, targetLanguage, sourceLanguage);

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Translation failed' });
    }

    res.json({
      success: true,
      translatedText: result.text,
      metadata: {
        sourceLanguage,
        targetLanguage,
        translatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in translate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate quiz
export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const { content, difficulty = 'beginner', language = 'en' } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await geminiService.generateQuiz(content, difficulty, language);

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Quiz generation failed' });
    }

    res.json({
      success: true,
      quiz: result.text,
      metadata: {
        difficulty,
        language,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Summarize content
export const summarize = async (req: Request, res: Response) => {
  try {
    const { content, language = 'en', maxLength = 200 } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await geminiService.summarizeContent(content, language, maxLength);

    if (!result.success) {
      return res.status(500).json({ error: result.error || 'Summarization failed' });
    }

    res.json({
      success: true,
      summary: result.text,
      metadata: {
        language,
        maxLength,
        summarizedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in summarize:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
