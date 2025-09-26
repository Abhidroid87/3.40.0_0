import { buildFirebaseConfigFromEnv, buildGeminiConfigFromEnv } from '../../../shared/utils/env';
import type { FirebaseConfig } from '../../../shared/firebase';
import type { GeminiConfig } from '../../../shared/ai/gemini';

export interface EnvironmentConfig {
  firebase: FirebaseConfig;
  ai: GeminiConfig;
}

const firebase = buildFirebaseConfigFromEnv();
const ai = buildGeminiConfigFromEnv();

const env: EnvironmentConfig = {
  firebase,
  ai
};

export default env;