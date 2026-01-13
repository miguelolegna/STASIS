// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

declare const __firebase_config: string;
declare const __app_id: string;

const getEnvConfig = () => {
  try {
    const meta = (import.meta as any).env;
    if (meta && meta.VITE_FIREBASE_API_KEY) {
      return {
        config: {
          apiKey: meta.VITE_FIREBASE_API_KEY,
          authDomain: meta.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: meta.VITE_FIREBASE_PROJECT_ID,
          storageBucket: meta.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: meta.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: meta.VITE_FIREBASE_APP_ID
        },
        appId: meta.VITE_APP_ID || 'auditor-financeiro-pro'
      };
    }
  } catch (e) {}

  const canvasConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
  const canvasAppId = typeof __app_id !== 'undefined' ? __app_id : 'auditor-financeiro-pro';

  return { config: canvasConfig, appId: canvasAppId };
};

const env = getEnvConfig();

export const firebaseApp = env.config ? initializeApp(env.config) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const APP_ID = env.appId;