import type { FirebaseConfig } from '../firebase';
import type { GeminiConfig } from '../ai/gemini';

type EnvRecord = Record<string, string | undefined>;

declare global {
  var __APP_ENV__: EnvRecord | undefined;
  interface ImportMeta {
    readonly env: Record<string, string>;
  }
}

const ENV_KEYS = {
  FIREBASE: {
    API_KEY: 'FIREBASE_API_KEY',
    AUTH_DOMAIN: 'FIREBASE_AUTH_DOMAIN',
    PROJECT_ID: 'FIREBASE_PROJECT_ID',
    STORAGE_BUCKET: 'FIREBASE_STORAGE_BUCKET',
    MESSAGING_SENDER_ID: 'FIREBASE_MESSAGING_SENDER_ID',
    APP_ID: 'FIREBASE_APP_ID'
  },
  GEMINI: {
    API_KEY: 'GEMINI_API_KEY',
    MODEL: 'GEMINI_MODEL'
  },
  API: {
    BASE_URL: 'API_BASE_URL'
  }
} as const;

function getEnvValue(key: string, prefix = ''): string | undefined {
  // For Vite environment variables
  const viteKey = `VITE_${key}`;
  
  try {
    // First try Vite's import.meta.env
    if (import.meta?.env) {
      const value = import.meta.env[viteKey];
      if (value) return value;
    }
  } catch {
    // Ignore import.meta errors in non-Vite environments
  }

  // Then try process.env
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[viteKey];
    if (value) return value;
  }

  // Finally try global app env
  if (globalThis.__APP_ENV__) {
    const value = globalThis.__APP_ENV__[viteKey];
    if (value) return value;
  }
  
  return undefined;
}

export function buildFirebaseConfigFromEnv(): FirebaseConfig {
  const config = {
    apiKey: getEnvValue('FIREBASE_API_KEY') || '',
    authDomain: getEnvValue('FIREBASE_AUTH_DOMAIN') || '',
    projectId: getEnvValue('FIREBASE_PROJECT_ID') || '',
    storageBucket: getEnvValue('FIREBASE_STORAGE_BUCKET') || '',
    messagingSenderId: getEnvValue('FIREBASE_MESSAGING_SENDER_ID') || '',
    appId: getEnvValue('FIREBASE_APP_ID') || ''
  };

  if (import.meta?.env?.DEV) {
    console.debug('Firebase Config:', {
      ...config,
      apiKey: config.apiKey ? '****' : '',
      appId: config.appId ? '****' : ''
    });
  }

  return config;
}

export function buildGeminiConfigFromEnv(): GeminiConfig {
  return {
    apiKey: getEnvValue(ENV_KEYS.GEMINI.API_KEY) || '',
    model: getEnvValue(ENV_KEYS.GEMINI.MODEL) || 'gemini-pro'
  };
}

export function readApiBaseUrlFromEnv(): string {
  return getEnvValue(ENV_KEYS.API.BASE_URL) || 'http://localhost:4000';
}