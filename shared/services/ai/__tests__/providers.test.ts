import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAIProvider } from '../providers/openai';
import { GeminiProvider } from '../providers/gemini';
import type { AIProviderConfig, AIRequestParams } from '../types';

// Mock OpenAI - فقط mock می‌کنیم که constructor کار کند
vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat: any;
      constructor(config: any) {
        this.chat = {
          completions: {
            create: vi.fn(),
          },
        };
      }
    },
  };
});

// Mock GoogleGenAI
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models: any;
      constructor(config: any) {
        this.models = {
          generateContent: vi.fn(),
        };
      }
    },
    GenerateContentResponse: class {},
  };
});

describe('AI Providers', () => {
  describe('OpenAIProvider', () => {
    let provider: OpenAIProvider;
    let mockConfig: AIProviderConfig;

    beforeEach(() => {
      vi.clearAllMocks();
      mockConfig = {
        provider: 'openai',
        apiKey: 'test-api-key',
        baseURL: 'https://api.openai.com/v1',
        defaultModels: {
          expert: 'gpt-4-turbo',
          fast: 'gpt-3.5-turbo',
          maps: 'gpt-4-turbo',
        },
      };
    });

    describe('constructor', () => {
      it('should create provider with valid config', () => {
        provider = new OpenAIProvider(mockConfig);
        expect(provider).toBeInstanceOf(OpenAIProvider);
        expect(provider.isConfigured()).toBe(true);
      });

      it('should not be configured when apiKey is missing', () => {
        const unconfiguredProvider = new OpenAIProvider({
          provider: 'openai',
          apiKey: '',
        });
        expect(unconfiguredProvider.isConfigured()).toBe(false);
      });
    });

    describe('getInfo', () => {
      it('should return OpenAI info for OpenAI provider', () => {
        provider = new OpenAIProvider(mockConfig);
        const info = provider.getInfo();
        expect(info.id).toBe('openai');
        expect(info.name).toBe('OpenAI');
        expect(info.requiresApiKey).toBe(true);
        expect(info.supportsImages).toBe(true);
        expect(info.supportsMaps).toBe(false);
      });

      it('should return OpenRouter info for OpenRouter baseURL', () => {
        const openRouterConfig: AIProviderConfig = {
          provider: 'openrouter',
          apiKey: 'test-api-key',
          baseURL: 'https://openrouter.ai/api/v1',
        };
        const openRouterProvider = new OpenAIProvider(openRouterConfig);
        const info = openRouterProvider.getInfo();
        expect(info.id).toBe('openrouter');
        expect(info.name).toBe('OpenRouter');
      });
    });

    describe('isConfigured', () => {
      it('should return true when configured', () => {
        provider = new OpenAIProvider(mockConfig);
        expect(provider.isConfigured()).toBe(true);
      });

      it('should return false when not configured', () => {
        const unconfiguredProvider = new OpenAIProvider({
          provider: 'openai',
          apiKey: '',
        });
        expect(unconfiguredProvider.isConfigured()).toBe(false);
      });
    });

    describe('analyzeCarIssue', () => {
      it('should return error when client is not configured', async () => {
        const unconfiguredProvider = new OpenAIProvider({
          provider: 'openai',
          apiKey: '',
        });

        const result = await unconfiguredProvider.analyzeCarIssue({
          prompt: 'Test prompt',
          mode: 'expert',
        });

        expect(result.text).toContain('خطا');
        expect(result.text).toContain('API Key');
      });

      it('should call OpenAI API with correct parameters', async () => {
        provider = new OpenAIProvider(mockConfig);
        
        // Mock the response
        const mockResponse = {
          choices: [
            {
              message: {
                content: 'این یک پاسخ تست است',
              },
            },
          ],
          model: 'gpt-4-turbo',
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30,
          },
        };

        // Access the client and mock its method
        const client = (provider as any).client;
        vi.mocked(client.chat.completions.create).mockResolvedValue(mockResponse);

        const result = await provider.analyzeCarIssue({
          prompt: 'مشکل خودروی من چیست؟',
          mode: 'expert',
        });

        expect(client.chat.completions.create).toHaveBeenCalled();
        const callArgs = vi.mocked(client.chat.completions.create).mock.calls[0][0];
        expect(callArgs.model).toBe('gpt-4-turbo');
        expect(callArgs.messages).toBeDefined();
        expect(result.text).toBe('این یک پاسخ تست است');
        expect(result.metadata?.model).toBe('gpt-4-turbo');
      });

      it('should use fast model for fast mode', async () => {
        provider = new OpenAIProvider(mockConfig);
        
        const mockResponse = {
          choices: [{ message: { content: 'پاسخ سریع' } }],
          model: 'gpt-3.5-turbo',
        };

        const client = (provider as any).client;
        vi.mocked(client.chat.completions.create).mockResolvedValue(mockResponse);

        await provider.analyzeCarIssue({
          prompt: 'سوال سریع',
          mode: 'fast',
        });

        const callArgs = vi.mocked(client.chat.completions.create).mock.calls[0][0];
        expect(callArgs.model).toBe('gpt-3.5-turbo');
      });

      it('should include user context in system prompt', async () => {
        provider = new OpenAIProvider(mockConfig);
        
        const mockResponse = {
          choices: [{ message: { content: 'پاسخ' } }],
          model: 'gpt-4-turbo',
        };

        const client = (provider as any).client;
        vi.mocked(client.chat.completions.create).mockResolvedValue(mockResponse);

        await provider.analyzeCarIssue({
          prompt: 'سوال',
          mode: 'expert',
          userContext: {
            vehicles: [
              {
                id: 'v1',
                model: 'پژو ۲۰۶',
                year: 1395,
                plateNumber: '12ج34567',
                currentKm: 150000,
              },
            ],
          },
        });

        const callArgs = vi.mocked(client.chat.completions.create).mock.calls[0][0];
        const systemMessage = callArgs.messages.find((m: any) => m.role === 'system');
        expect(systemMessage).toBeDefined();
        expect(systemMessage.content).toContain('پژو ۲۰۶');
      });

      it('should handle API errors gracefully', async () => {
        provider = new OpenAIProvider(mockConfig);
        
        const client = (provider as any).client;
        vi.mocked(client.chat.completions.create).mockRejectedValue(new Error('API Error'));

        const result = await provider.analyzeCarIssue({
          prompt: 'Test prompt',
          mode: 'expert',
        });

        expect(result.text).toContain('مشکلی در برقراری ارتباط');
        expect(result.groundingChunks).toEqual([]);
      });

      it('should handle empty response', async () => {
        provider = new OpenAIProvider(mockConfig);
        
        const mockResponse = {
          choices: [{ message: {} }],
          model: 'gpt-4-turbo',
        };

        const client = (provider as any).client;
        vi.mocked(client.chat.completions.create).mockResolvedValue(mockResponse);

        const result = await provider.analyzeCarIssue({
          prompt: 'Test prompt',
          mode: 'expert',
        });

        expect(result.text).toBe('پاسخی دریافت نشد.');
      });
    });
  });

  describe('GeminiProvider', () => {
    let provider: GeminiProvider;
    let mockConfig: AIProviderConfig;

    beforeEach(() => {
      vi.clearAllMocks();
      mockConfig = {
        provider: 'gemini',
        apiKey: 'test-api-key',
      };
    });

    describe('constructor', () => {
      it('should create provider with valid config', () => {
        provider = new GeminiProvider(mockConfig);
        expect(provider).toBeInstanceOf(GeminiProvider);
        expect(provider.isConfigured()).toBe(true);
      });

      it('should not be configured when apiKey is missing', () => {
        const unconfiguredProvider = new GeminiProvider({
          provider: 'gemini',
          apiKey: '',
        });
        expect(unconfiguredProvider.isConfigured()).toBe(false);
      });
    });

    describe('getInfo', () => {
      it('should return Gemini info', () => {
        provider = new GeminiProvider(mockConfig);
        const info = provider.getInfo();
        expect(info.id).toBe('gemini');
        expect(info.name).toBe('Google Gemini');
        expect(info.requiresApiKey).toBe(true);
        expect(info.supportsImages).toBe(true);
        expect(info.supportsMaps).toBe(true);
        expect(info.supportsDeepThinking).toBe(true);
      });
    });

    describe('isConfigured', () => {
      it('should return true when configured', () => {
        provider = new GeminiProvider(mockConfig);
        expect(provider.isConfigured()).toBe(true);
      });

      it('should return false when not configured', () => {
        const unconfiguredProvider = new GeminiProvider({
          provider: 'gemini',
          apiKey: '',
        });
        expect(unconfiguredProvider.isConfigured()).toBe(false);
      });
    });

    describe('analyzeCarIssue', () => {
      it('should return error when client is not configured', async () => {
        const unconfiguredProvider = new GeminiProvider({
          provider: 'gemini',
          apiKey: '',
        });

        const result = await unconfiguredProvider.analyzeCarIssue({
          prompt: 'Test prompt',
          mode: 'expert',
        });

        expect(result.text).toContain('خطا');
        expect(result.text).toContain('Gemini API Key');
      });

      it('should use correct model for different modes', async () => {
        provider = new GeminiProvider(mockConfig);
        
        const mockResponse = {
          text: 'پاسخ تست',
        };

        const client = (provider as any).client;
        
        // Mock generateContent method
        vi.mocked(client.models.generateContent).mockResolvedValue(mockResponse);

        // Test expert mode
        await provider.analyzeCarIssue({
          prompt: 'Test',
          mode: 'expert',
        });

        expect(client.models.generateContent).toHaveBeenCalledWith(
          expect.objectContaining({
            model: 'gemini-3-pro-preview',
          })
        );

        // Test fast mode
        vi.clearAllMocks();
        await provider.analyzeCarIssue({
          prompt: 'Test',
          mode: 'fast',
        });

        expect(client.models.generateContent).toHaveBeenCalledWith(
          expect.objectContaining({
            model: 'gemini-flash-lite-latest',
          })
        );

        // Test maps mode
        vi.clearAllMocks();
        await provider.analyzeCarIssue({
          prompt: 'Test',
          mode: 'maps',
        });

        expect(client.models.generateContent).toHaveBeenCalledWith(
          expect.objectContaining({
            model: 'gemini-2.5-flash',
          })
        );
      });

      it('should handle errors gracefully', async () => {
        provider = new GeminiProvider(mockConfig);
        
        const client = (provider as any).client;
        
        // Mock generateContent to throw error
        vi.mocked(client.models.generateContent).mockRejectedValue(new Error('API Error'));

        const result = await provider.analyzeCarIssue({
          prompt: 'Test prompt',
          mode: 'expert',
        });

        expect(result.text).toContain('مشکلی در برقراری ارتباط');
        expect(result.groundingChunks).toEqual([]);
      });
    });
  });
});

