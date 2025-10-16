import { NextApiRequest, NextApiResponse } from 'next';
import { GeminiService } from '../shared/gemini';

const geminiService = new GeminiService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'generate-content':
        const contentRequest = req.body;
        const contentResult = await geminiService.generateContent(
          contentRequest.prompt,
          contentRequest.language,
          contentRequest.domain,
          contentRequest.difficulty,
          contentRequest.contentType,
          contentRequest.includeImages,
          contentRequest.includeVideo,
          contentRequest.includeQuiz
        );
        return res.status(200).json({ success: true, data: contentResult });

      case 'chat':
        const chatRequest = req.body;
        const chatResult = await geminiService.chat(chatRequest.messages);
        return res.status(200).json({ success: true, data: chatResult });

      case 'translate':
        const translateRequest = req.body;
        const translateResult = await geminiService.translateText(
          translateRequest.text,
          translateRequest.sourceLanguage,
          translateRequest.targetLanguage
        );
        return res.status(200).json({ success: true, data: translateResult });

      case 'generate-quiz':
        const quizRequest = req.body;
        const quizResult = await geminiService.generateQuiz(
          quizRequest.content,
          quizRequest.difficulty,
          quizRequest.questionCount
        );
        return res.status(200).json({ success: true, data: quizResult });

      case 'summarize':
        const summarizeRequest = req.body;
        const summarizeResult = await geminiService.summarizeContent(
          summarizeRequest.content,
          summarizeRequest.maxLength
        );
        return res.status(200).json({ success: true, data: summarizeResult });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error(`Error in AI API (${action}):`, error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
