# Manage Mobile Workspace

React Native (Expo) client that mirrors the Manage Chrome extension and consumes the shared Firebase/Gemini utilities.

## 🚀 Getting Started

- Install prerequisites: Node.js 18+, npm or yarn, and optionally the Expo CLI (`npm install -g @expo/cli`).
- Install dependencies and scaffold the environment file:

```
cd mobile
npm install
cp .env.example .env
```

Populate `.env` with the same Firebase and Gemini credentials used by the Chrome extension.

## Development Workflow

```
npm start            # Launch Metro bundler
npm run android      # Open Android emulator / connected device
npm run ios          # Open iOS simulator (macOS only)
npm run web          # Experimental web build
```

`app.config.js` loads `.env`, exposes the values through `Constants.expoConfig.extra`, and `src/config/environment.ts` bridges them into the shared helpers.

## Building

```
npm run build:android
npm run build:ios
```

For production builds consider configuring Expo Application Services (EAS).

## 🔄 Sync & Firebase

- `storageService` maintains local data using AsyncStorage.
- `syncService` merges incoming transfers and exposes `pushSnapshotToCloud` to persist snapshots in Firestore once authentication is in place.
- Firebase is initialised via `shared/firebase` (`firebaseService.ts` simply re-exports the shared instance).

## 🤖 Gemini Stubs

- `shared/ai/gemini` provides the Gemini client used by `src/services/aiService.ts`.
- Helper functions `generateAiSuggestion` and `summarizeText` are ready for UI wiring once a Gemini key is configured.

## Deep Linking

- Custom scheme: `manageapp://`
- Universal link base: `https://manage-dashboard.com`
- Validate locally with `npx uri-scheme open manageapp://transfer --android` (or `--ios`).

## Project Structure

```
mobile/
├── App.tsx                 # Entry point with navigation + env bootstrap
├── assets/                 # Icons & splash art
├── android/ ios/           # Native stubs (generated on eject)
├── src/
│   ├── config/
│   ├── screens/
│   ├── services/
│   └── types/              # Re-exports from @shared/types
├── babel.config.js         # Module alias for @shared
├── metro.config.js         # Watches ../shared for live updates
└── tsconfig.json           # TS paths for @shared
```

## Troubleshooting

- **Shared modules not found** – Restart Metro after editing `shared/*` or extending watch folders.
- **Firebase init errors** – Verify `.env` values and confirm the Firebase project allows web/Expo clients.
- **Gemini auth errors** – Re-check the API key; the shared client throws a descriptive error if missing.

## Next Steps

- Connect authenticated sync flows to `pushSnapshotToCloud`.
- Surface AI helpers inside dashboard widgets.
- Add automated testing and EAS build profiles as the project matures.