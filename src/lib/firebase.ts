import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let isRealFirebase = false;

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== '') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: Pass the firestoreDatabaseId
    isRealFirebase = true;
    console.log('Real Firebase initialized successfully.');
  } catch (err) {
    console.error('Firebase initialization failed, falling back to sandbox auth.', err);
  }
}

export { auth, db, isRealFirebase };
export { GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged };
export type { FirebaseUser };
