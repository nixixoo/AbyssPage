declare const process: any;

export const firebaseConfig = {
  apiKey: process.env['FIREBASE_API_KEY'] || "fake-api-key-for-development",
  authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || "fake-domain.firebaseapp.com",
  projectId: process.env['FIREBASE_PROJECT_ID'] || "fake-project-id",
  storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || "fake-bucket.appspot.com",
  messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || "123456789",
  appId: process.env['FIREBASE_APP_ID'] || "1:123:web:fake"
};

export const production = false;