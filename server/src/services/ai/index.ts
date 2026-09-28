import { IAIService } from './aiService.interface.js';
import { LocalEngineService } from './localEngineService.js';
import { GeminiService } from './geminiService.js';
import { ENV } from '../../config/env.js';

let activeAIService: IAIService;

switch (ENV.AI_PROVIDER.toLowerCase()) {
  case 'gemini':
    activeAIService = new GeminiService();
    console.log('[AI Service] Initialized with Gemini Provider (with local fallback)');
    break;
  case 'local':
  default:
    activeAIService = new LocalEngineService();
    console.log('[AI Service] Initialized with Local Intelligent Engine');
    break;
}

export const aiService = activeAIService;
export * from './aiService.interface.js';
