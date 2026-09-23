import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import bundledFirebaseConfig from '../../firebase-applet-config.json';

// Support Vite environment variables with graceful fallback to bundled configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || bundledFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || bundledFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || bundledFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || bundledFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || bundledFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || bundledFirebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || bundledFirebaseConfig.firestoreDatabaseId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with the provisioned database ID
const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

// Primary owner email from environment variable or project context
export const OWNER_EMAIL = import.meta.env.VITE_NOVORA_OWNER_EMAIL || 'worldsunnyday88@gmail.com';

// Connection validation
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connection: Client currently offline or initial handshake pending.');
    }
  }
}

if (typeof window !== 'undefined') {
  testFirestoreConnection();
}
