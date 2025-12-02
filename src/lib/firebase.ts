import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp, query, where, orderBy, onSnapshot, type Firestore, Timestamp, doc, getDoc, setDoc, updateDoc, runTransaction, increment } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, provider);
}

export async function signOutUser() {
  return await signOut(auth);
}

export { onAuthStateChanged, type User, addDoc, collection, serverTimestamp, query, where, orderBy, onSnapshot, Timestamp, doc, getDoc, setDoc, updateDoc, runTransaction, increment, uploadBytes, getDownloadURL, storageRef };


