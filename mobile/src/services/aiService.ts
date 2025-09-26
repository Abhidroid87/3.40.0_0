import { geminiClient } from '../config/environment';
import type { GeminiResponse } from '@shared/ai/gemini';

export async function generateAiSuggestion(prompt: string, context?: string): Promise<GeminiResponse> {
  return geminiClient.generate(prompt, { context });
}

export async function summarizeText(content: string): Promise<GeminiResponse> {
  return geminiClient.summarize(content);
}
