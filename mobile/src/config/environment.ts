import Constants from 'expo-constants';
import { initializeFirebase } from '@shared/firebase';
import { createGeminiClient } from '@shared/ai/gemini';
import { buildFirebaseConfigFromEnv, buildGeminiConfigFromEnv, ENV_KEYS } from '@shared/utils/env';

const extra = Constants.expoConfig?.extra ?? {};

// Bridge Expo config values into the shared environment helper
if (typeof globalThis !== 'undefined') {
  globalThis.__APP_ENV__ = {
    ...(globalThis.__APP_ENV__ ?? {}),
    [ENV_KEYS.FIREBASE.API_KEY]: extra.FIREBASE_API_KEY ?? '',
    [ENV_KEYS.FIREBASE.AUTH_DOMAIN]: extra.FIREBASE_AUTH_DOMAIN ?? '',
    [ENV_KEYS.FIREBASE.PROJECT_ID]: extra.FIREBASE_PROJECT_ID ?? '',
    [ENV_KEYS.FIREBASE.STORAGE_BUCKET]: extra.FIREBASE_STORAGE_BUCKET ?? '',
    [ENV_KEYS.FIREBASE.MESSAGING_SENDER_ID]: extra.FIREBASE_MESSAGING_SENDER_ID ?? '',
    [ENV_KEYS.FIREBASE.APP_ID]: extra.FIREBASE_APP_ID ?? '',
    [ENV_KEYS.GEMINI.API_KEY]: extra.GEMINI_API_KEY ?? '',
    [ENV_KEYS.GEMINI.MODEL]: extra.GEMINI_MODEL ?? 'gemini-pro'
  };
}

const firebaseConfig = buildFirebaseConfigFromEnv();
const geminiConfig = buildGeminiConfigFromEnv();

export const firebase = initializeFirebase(firebaseConfig);
export const geminiClient = createGeminiClient(geminiConfig);

export const environment = {
  firebase: firebaseConfig,
  ai: geminiConfig
};

type EnvironmentShape = typeof environment;
export type { EnvironmentShape as EnvironmentConfig };
