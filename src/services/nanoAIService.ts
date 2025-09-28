// Type definitions for nanoAIService
// This is a placeholder implementation for the hackathon

export type AIModelStatus = 'available' | 'unavailable' | 'downloading';

export interface LanguageModelSession {
  id: string;
  model: string;
  created: number;
  lastUsed: number;
}