import type { FirebaseConfig } from '../../../shared/firebase';

export interface ValidationResult {
  isValid: boolean;
  missingKeys: string[];
  emptyKeys: string[];
}

export function validateFirebaseConfig(config: Partial<FirebaseConfig>): ValidationResult {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ] as const;

  const missingKeys = requiredKeys.filter(key => !(key in config));
  const emptyKeys = requiredKeys.filter(key => 
    key in config && (!config[key] || config[key]?.trim().length === 0)
  );

  return {
    isValid: missingKeys.length === 0 && emptyKeys.length === 0,
    missingKeys,
    emptyKeys
  };
}

export function getConfigErrorMessage(result: ValidationResult): string {
  const parts: string[] = [];
  
  if (result.missingKeys.length > 0) {
    parts.push(`Missing required Firebase keys: ${result.missingKeys.join(', ')}`);
  }
  
  if (result.emptyKeys.length > 0) {
    parts.push(`Empty or invalid Firebase keys: ${result.emptyKeys.join(', ')}`);
  }

  return parts.join('\n');
}

export function debugFirebaseConfig(config: Partial<FirebaseConfig>): void {
  console.group('Firebase Config Debug');
  
  const validation = validateFirebaseConfig(config);
  console.log('Validation result:', validation);
  
  if (!validation.isValid) {
    console.warn('Configuration Error:', getConfigErrorMessage(validation));
  }

  console.log('Config values:');
  Object.entries(config).forEach(([key, value]) => {
    const isSecret = key === 'apiKey' || key === 'appId';
    console.log(`${key}: ${isSecret ? '****' : value}`);
  });
  
  console.groupEnd();
}