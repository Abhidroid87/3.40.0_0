import type { FirebaseConfig } from '../../../shared/firebase';
import type { GeminiConfig } from '../../../shared/ai/gemini';

// These values will be replaced at build time by Vite
declare const __FIREBASE_CONFIG__: string;
declare const __GEMINI_CONFIG__: string;
declare const __API_CONFIG__: string;

export interface EnvironmentConfig {
  firebase: FirebaseConfig;
  ai: GeminiConfig;
  api: {
    baseUrl: string;
  };
}

// Parse the stringified JSON configs
const firebaseConfig = JSON.parse(__FIREBASE_CONFIG__);
const geminiConfig = JSON.parse(__GEMINI_CONFIG__);
const apiConfig = JSON.parse(__API_CONFIG__);

// Export configuration that's safe for extension context
const env: EnvironmentConfig = {
  firebase: {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId
  },
  ai: {
    apiKey: geminiConfig.apiKey,
    model: geminiConfig.model || 'gemini-pro'
  },
  api: {
    baseUrl: apiConfig.baseUrl || 'http://localhost:4000/graphql'
  }
};

// Debug configuration
function debugConfig() {
  try {
    // Debug parsed configs
    console.debug('Raw Configs:', {
      firebase: typeof __FIREBASE_CONFIG__ === 'string' ? 'Valid JSON string' : 'Invalid format',
      gemini: typeof __GEMINI_CONFIG__ === 'string' ? 'Valid JSON string' : 'Invalid format',
      api: typeof __API_CONFIG__ === 'string' ? 'Valid JSON string' : 'Invalid format'
    });

    // Debug processed environment
    console.debug('Processed Environment:', {
      firebase: {
        apiKey: env.firebase.apiKey ? '****' : 'missing',
        authDomain: env.firebase.authDomain || 'missing',
        projectId: env.firebase.projectId || 'missing',
        storageBucket: env.firebase.storageBucket || 'missing',
        messagingSenderId: env.firebase.messagingSenderId || 'missing',
        appId: env.firebase.appId ? '****' : 'missing'
      },
      ai: {
        apiKey: env.ai.apiKey ? '****' : 'missing',
        model: env.ai.model
      },
      api: env.api
    });

    // Validate Firebase config
    const missingKeys = Object.entries(env.firebase)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingKeys.length > 0) {
      console.warn('Missing Firebase configuration values:', missingKeys);
    }
  } catch (error) {
    console.error('Error in environment configuration:', error);
  }
}

// Run debug logging
debugConfig();

export default env;