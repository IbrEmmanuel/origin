import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Firebase web config is public by design (restricted in Firebase Console).
 * Prefer VITE_FIREBASE_* so environments can override without code edits.
 * Fallbacks preserve the existing production project.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB36ai39QRo9P27ZDH1qjeTal-T7ozKu2o',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'originelectric-c8236.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'originelectric-c8236',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'originelectric-c8236.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '666942140438',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || '1:666942140438:web:4bb19af5a190d9ef188537',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-H5MDX54MFM'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, firebaseConfig };
