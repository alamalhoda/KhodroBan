import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAIProviderConfig, getUserSelectedProvider } from '../config';

describe('AI Service Config', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    // Reset environment variables before each test
    vi.stubEnv('VITE_AI_PROVIDER', '');
    vi.stubEnv('VITE_AI_API_KEY', '');
    vi.stubEnv('VITE_OPENAI_API_URL', '');
    vi.stubEnv('VITE_OPENROUTER_API_URL', '');
    vi.stubEnv('VITE_AI_MODEL_EXPERT', '');
    vi.stubEnv('VITE_AI_MODEL_FAST', '');
    vi.stubEnv('VITE_AI_MODEL_MAPS', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('getAIProviderConfig', () => {
    it('should return null when API key is not provided', () => {
      const config = getAIProviderConfig();
      expect(config).toBeNull();
    });

    it('should return config with default provider (gemini) when VITE_AI_PROVIDER is not set', () => {
      vi.stubEnv('VITE_AI_API_KEY', 'test-api-key');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.provider).toBe('gemini');
      expect(config?.apiKey).toBe('test-api-key');
      expect(config?.defaultModels).toEqual({
        expert: 'gemini-3-pro-preview',
        fast: 'gemini-flash-lite-latest',
        maps: 'gemini-2.5-flash',
      });
    });

    it('should return config for gemini provider', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'gemini');
      vi.stubEnv('VITE_AI_API_KEY', 'gemini-api-key');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.provider).toBe('gemini');
      expect(config?.apiKey).toBe('gemini-api-key');
    });

    it('should return config for openai provider with default values', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'openai');
      vi.stubEnv('VITE_AI_API_KEY', 'openai-api-key');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.provider).toBe('openai');
      expect(config?.apiKey).toBe('openai-api-key');
      expect(config?.baseURL).toBe('https://api.openai.com/v1');
      expect(config?.defaultModels).toEqual({
        expert: 'gpt-4-turbo-preview',
        fast: 'gpt-3.5-turbo',
        maps: 'gpt-4-turbo-preview',
      });
    });

    it('should return config for openai provider with custom base URL', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'openai');
      vi.stubEnv('VITE_AI_API_KEY', 'openai-api-key');
      vi.stubEnv('VITE_OPENAI_API_URL', 'https://custom-api.example.com/v1');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.provider).toBe('openai');
      expect(config?.baseURL).toBe('https://custom-api.example.com/v1');
    });

    it('should return config for openai provider with custom models', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'openai');
      vi.stubEnv('VITE_AI_API_KEY', 'openai-api-key');
      vi.stubEnv('VITE_AI_MODEL_EXPERT', 'gpt-4');
      vi.stubEnv('VITE_AI_MODEL_FAST', 'gpt-3.5-turbo-fast');
      vi.stubEnv('VITE_AI_MODEL_MAPS', 'gpt-4-maps');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.defaultModels).toEqual({
        expert: 'gpt-4',
        fast: 'gpt-3.5-turbo-fast',
        maps: 'gpt-4-maps',
      });
    });

    it('should return config for openrouter provider with default values', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'openrouter');
      vi.stubEnv('VITE_AI_API_KEY', 'openrouter-api-key');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.provider).toBe('openrouter');
      expect(config?.apiKey).toBe('openrouter-api-key');
      expect(config?.baseURL).toBe('https://openrouter.ai/api/v1');
      expect(config?.defaultModels).toEqual({
        expert: 'anthropic/claude-3.5-sonnet',
        fast: 'anthropic/claude-3-haiku',
        maps: 'anthropic/claude-3-haiku',
      });
    });

    it('should return config for openrouter provider with custom base URL', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'openrouter');
      vi.stubEnv('VITE_AI_API_KEY', 'openrouter-api-key');
      vi.stubEnv('VITE_OPENROUTER_API_URL', 'https://proxy.example.com/v1');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.provider).toBe('openrouter');
      expect(config?.baseURL).toBe('https://proxy.example.com/v1');
    });

    it('should return config for openrouter provider with custom models', () => {
      vi.stubEnv('VITE_AI_PROVIDER', 'openrouter');
      vi.stubEnv('VITE_AI_API_KEY', 'openrouter-api-key');
      vi.stubEnv('VITE_AI_MODEL_EXPERT', 'openai/gpt-4-turbo');
      vi.stubEnv('VITE_AI_MODEL_FAST', 'google/gemini-pro');
      vi.stubEnv('VITE_AI_MODEL_MAPS', 'anthropic/claude-3-opus');

      const config = getAIProviderConfig();

      expect(config).not.toBeNull();
      expect(config?.defaultModels).toEqual({
        expert: 'openai/gpt-4-turbo',
        fast: 'google/gemini-pro',
        maps: 'anthropic/claude-3-opus',
      });
    });
  });

  describe('getUserSelectedProvider', () => {
    it('should return null (not implemented yet)', () => {
      const provider = getUserSelectedProvider();
      expect(provider).toBeNull();
    });
  });
});

