// API service for interacting with the backend AI endpoints

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Generate AI content
  async generateContent(request: ContentGenerationRequest): Promise<ApiResponse<any>> {
    return this.request('/ai?action=generate-content', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Chat with AI
  async chat(messages: ChatMessage[]): Promise<ApiResponse<{ message: ChatMessage }>> {
    return this.request('/ai?action=chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  }

  // Translate text
  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<ApiResponse<{ translatedText: string }>> {
    return this.request('/ai?action=translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
    });
  }

  // Generate quiz
  async generateQuiz(
    content: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    language: string = 'en'
  ): Promise<ApiResponse<{ quiz: string }>> {
    return this.request('/ai?action=generate-quiz', {
      method: 'POST',
      body: JSON.stringify({ content, difficulty, language }),
    });
  }

  // Summarize content
  async summarize(
    content: string,
    language: string = 'en',
    maxLength: number = 200
  ): Promise<ApiResponse<{ summary: string }>> {
    return this.request('/ai?action=summarize', {
      method: 'POST',
      body: JSON.stringify({ content, language, maxLength }),
    });
  }

  // Test API connection
  async ping(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/ping');
  }
}

export const apiService = new ApiService();
