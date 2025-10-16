import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export interface ContentGenerationRequest {
  prompt: string;
  language: string;
  domain: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentType: 'text' | 'video' | 'image' | 'interactive';
  includeImages?: boolean;
  includeVideo?: boolean;
  includeQuiz?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class GeminiService {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generate content using Gemini AI
   */
  async generateContent(request: ContentGenerationRequest): Promise<GeminiResponse> {
    try {
      const { prompt, language, domain, difficulty, contentType, includeImages, includeVideo, includeQuiz } = request;
      
      const systemPrompt = `You are an AI content creator for SkillBhasha, a multilingual skill training platform. 
      Generate high-quality, localized training content in ${language} for the ${domain} domain.
      
      Content Requirements:
      - Language: ${language}
      - Domain: ${domain}
      - Difficulty: ${difficulty}
      - Content Type: ${contentType}
      - Include Images: ${includeImages ? 'Yes' : 'No'}
      - Include Video: ${includeVideo ? 'Yes' : 'No'}
      - Include Quiz: ${includeQuiz ? 'Yes' : 'No'}
      
      Guidelines:
      - Use clear, practical language appropriate for ${difficulty} level
      - Include safety considerations for ${domain} work
      - Provide step-by-step instructions
      - Make content culturally appropriate for the target language
      - Include real-world examples and scenarios
      - Ensure content is actionable and practical
      
      Generate comprehensive training content based on: ${prompt}`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        success: true
      };
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Chat with Gemini AI for learning assistance
   */
  async chat(messages: ChatMessage[]): Promise<GeminiResponse> {
    try {
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        success: true
      };
    } catch (error) {
      console.error('Error chatting with Gemini:', error);
      return {
        text: 'I apologize, but I encountered an error while processing your request. Please try again.',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Translate text using Gemini AI
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<GeminiResponse> {
    try {
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
      Maintain the original meaning, tone, and context. 
      If the text is technical or domain-specific, ensure the translation is accurate and appropriate for the target language.
      
      Text to translate: ${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();

      return {
        text: translatedText,
        success: true
      };
    } catch (error) {
      console.error('Error translating text with Gemini:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  /**
   * Generate quiz questions using Gemini AI
   */
  async generateQuiz(content: string, difficulty: 'beginner' | 'intermediate' | 'advanced', language: string): Promise<GeminiResponse> {
    try {
      const prompt = `Generate ${difficulty} level quiz questions based on the following content. 
      Questions should be in ${language} and test understanding of key concepts.
      
      Content: ${content}
      
      Generate 5-10 questions with multiple choice answers and explanations.
      Format as JSON with the following structure:
      {
        "questions": [
          {
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correct": "A",
            "explanation": "Explanation of the correct answer"
          }
        ]
      }`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const quizText = response.text();

      return {
        text: quizText,
        success: true
      };
    } catch (error) {
      console.error('Error generating quiz with Gemini:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Quiz generation failed'
      };
    }
  }

  /**
   * Summarize content using Gemini AI
   */
  async summarizeContent(content: string, language: string, maxLength: number = 200): Promise<GeminiResponse> {
    try {
      const prompt = `Summarize the following content in ${language}. 
      Keep the summary under ${maxLength} words and focus on the key points and main concepts.
      
      Content: ${content}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      return {
        text: summary,
        success: true
      };
    } catch (error) {
      console.error('Error summarizing content with Gemini:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Summarization failed'
      };
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
