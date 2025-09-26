const path = require('path');
const { config: loadEnv } = require('dotenv');

loadEnv({ path: path.resolve(__dirname, '.env'), override: false });

const config = {
  expo: {
    name: 'Manage - Personal Dashboard',
    slug: 'manage-dashboard',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#3b82f6'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.manage.dashboard',
      associatedDomains: ['applinks:manage-dashboard.com']
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#3b82f6'
      },
      package: 'com.manage.dashboard',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'manage-dashboard.com'
            }
          ],
          category: ['BROWSABLE', 'DEFAULT']
        }
      ]
    },
    web: {
      bundler: 'metro',
      favicon: './assets/favicon.png'
    },
    scheme: 'manageapp',
    plugins: ['expo-linking'],
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ?? '',
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ?? '',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? '',
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ?? '',
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ?? '',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
      GEMINI_MODEL: process.env.GEMINI_MODEL ?? 'gemini-pro'
    }
  }
};

module.exports = config;
