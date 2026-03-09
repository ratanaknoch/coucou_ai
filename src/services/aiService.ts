import type { Message, Settings } from '../types';
import { streamGeminiResponse } from './geminiService';
import { streamDeepseekResponse } from './deepseekService';
import { streamOllamaResponse } from './ollamaService';
import { streamLMStudioResponse } from './lmstudioService';

export async function* streamAIResponse(
  messages: Message[],
  settings: Settings
): AsyncGenerator<string> {
  switch (settings.provider) {
    case 'cloud-gemini':
      if (!settings.geminiApiKey) throw new Error('Gemini API key is required.');
      yield* streamGeminiResponse(messages, settings.geminiApiKey);
      break;
    case 'cloud-deepseek':
      if (!settings.deepseekApiKey) throw new Error('Deepseek API key is required.');
      yield* streamDeepseekResponse(messages, settings.deepseekApiKey);
      break;
    case 'ollama':
      if (!settings.localEndpoint) throw new Error('Local endpoint is required for Ollama.');
      if (!settings.localModelName) throw new Error('Model name is required for Ollama.');
      yield* streamOllamaResponse(messages, settings.localEndpoint, settings.localModelName);
      break;
    case 'lmstudio':
      if (!settings.localEndpoint) throw new Error('Local endpoint is required for LM Studio.');
      if (!settings.localModelName) throw new Error('Model name is required for LM Studio.');
      yield* streamLMStudioResponse(messages, settings.localEndpoint, settings.localModelName);
      break;
    default:
      throw new Error('Unknown provider');
  }
}
