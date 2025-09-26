import type { FirebaseConfig } from '../firebase';
import type { GeminiConfig } from '../ai/gemini';

type EnvRecord = Record<string, string | undefined>;

declare global {
  // eslint-disable-next-line no-var
  var __APP_ENV__?: EnvRecord;
}

const gatherSources = (): EnvRecord[] => {
  const sources: EnvRecord[] = [];

  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    sources.push(process.env as EnvRecord);
  }

  // `import.meta` is only available in ESM environments (Vite / extension build)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaEnv = (import.meta as any)?.env as EnvRecord | undefined;
    if (metaEnv) {
      sources.push(metaEnv);
    }
  } catch (error) {
    // ignore: `import.meta` not supported in this runtime (e.g., React Native)
  }

  if (typeof globalThis !== 'undefined' && globalThis.__APP_ENV__) {
    sources.push(globalThis.__APP_ENV__);
  }

  return sources;
};

const ENV_SOURCES = gatherSources();

export const ENV_KEYS = {
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
  }
} as const;

export function readEnv(key: string, fallback = ''): string {
  for (const source of ENV_SOURCES) {
    const value = source?.[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return fallback;
}

export function buildFirebaseConfigFromEnv(): FirebaseConfig {
  return {
    apiKey: readEnv(ENV_KEYS.FIREBASE.API_KEY),
    authDomain: readEnv(ENV_KEYS.FIREBASE.AUTH_DOMAIN),
    projectId: readEnv(ENV_KEYS.FIREBASE.PROJECT_ID),
    storageBucket: readEnv(ENV_KEYS.FIREBASE.STORAGE_BUCKET),
    messagingSenderId: readEnv(ENV_KEYS.FIREBASE.MESSAGING_SENDER_ID),
    appId: readEnv(ENV_KEYS.FIREBASE.APP_ID)
  };
}

export function buildGeminiConfigFromEnv(): GeminiConfig {
  return {
    apiKey: readEnv(ENV_KEYS.GEMINI.API_KEY),
    model: readEnv(ENV_KEYS.GEMINI.MODEL, 'gemini-pro')
  };
}
