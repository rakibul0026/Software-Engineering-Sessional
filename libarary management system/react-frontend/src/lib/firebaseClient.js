import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let firebaseApp = null;
let firebaseAuth = null;
let firebaseDatabase = null;

if (hasFirebaseConfig) {
  firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  firebaseDatabase = getDatabase(firebaseApp);
}

export { firebaseApp, firebaseAuth, firebaseDatabase, hasFirebaseConfig };
