// @ts-ignore
const processEnv = typeof process !== 'undefined' ? process.env : {};

export const firebaseConfig = {
  apiKey: processEnv['FIREBASE_API_KEY'] || '',
  authDomain: processEnv['FIREBASE_AUTH_DOMAIN'] || '',
  projectId: processEnv['FIREBASE_PROJECT_ID'] || '',
  storageBucket: processEnv['FIREBASE_STORAGE_BUCKET'] || '',
  messagingSenderId: processEnv['FIREBASE_MESSAGING_SENDER_ID'] || '',
  appId: processEnv['FIREBASE_APP_ID'] || ''
};