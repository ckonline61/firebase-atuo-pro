// Firebase Configuration - Auto Pro
// Config loaded from .env file

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFwqovevqq4aXIBZ3vi-IK-RO0YRmzRr4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "auto-pro-5a1ec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "auto-pro-5a1ec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "auto-pro-5a1ec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "652783899103",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:652783899103:web:aed46f9d6c08245ce6f46a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D092WBYKS5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
