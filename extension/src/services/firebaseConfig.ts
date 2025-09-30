import env from '../config/environment';
import { initializeFirebase } from '../../../shared/firebase/index.ts';
import type { FirebaseServices } from '../../../shared/firebase/index.ts';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { validateFirebaseConfig, debugFirebaseConfig } from '../utils/configValidator';

const missingConfigError = new Error('Missing Firebase configuration. Ensure .env values are set.');

let firebaseServices: FirebaseServices | null = null;
let initializationError: Error | null = null;

// Debug config in development
if (import.meta.env.DEV) {
  debugFirebaseConfig(env.firebase);
}

const validationResult = validateFirebaseConfig(env.firebase);

if (validationResult.isValid) {
  try {
    firebaseServices = initializeFirebase(env.firebase);
  } catch (error) {
    initializationError = error instanceof Error ? error : new Error(String(error));
    console.error('Failed to initialize Firebase:', {
      error: initializationError,
      config: {
        ...env.firebase,
        apiKey: '****',
        appId: '****'
      }
    });
  }
} else {
  initializationError = missingConfigError;
  console.warn(
    'Firebase configuration validation failed:\n' +
    validationResult.missingKeys.map(key => `- Missing ${key}`).join('\n') + '\n' +
    validationResult.emptyKeys.map(key => `- Empty ${key}`).join('\n') +
    '\nAuth and sync features will be disabled until valid credentials are provided.'
  );
}

export const firebaseStatus = {
	ready: Boolean(firebaseServices),
	error: initializationError,
	missingConfig: initializationError === missingConfigError
};

export const auth: Auth | null = firebaseServices?.auth ?? null;
export const db: Firestore | null = firebaseServices?.db ?? null;

const app: FirebaseApp | null = firebaseServices?.app ?? null;

export default app;