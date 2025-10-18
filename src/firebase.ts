// src/firebase.ts
import { initializeApp } from "firebase/app";

// ⚠️ Importa funciones y el tipo User en líneas separadas (evita el bug del parser)
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import type { User } from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

// 🔒 Reemplaza por tus claves reales de Firebase (esto es de ejemplo)
const firebaseConfig = {
  apiKey: "FAKE-apiKey-1234567890abcdefghij",
  authDomain: "adventureworks-demo.firebaseapp.com",
  projectId: "adventureworks-demo",
  storageBucket: "adventureworks-demo.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:aaaaaaaaaaaaaaaaaaaaaa",
};

// Init
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Helpers de Auth
export async function signInWithGoogle() {
  const res = await signInWithPopup(auth, googleProvider);
  // Crea doc de usuario si no existe
  const ref = doc(db, "users", res.user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: res.user.uid,
      email: res.user.email,
      displayName: res.user.displayName || "",
      photoURL: res.user.photoURL || "",
      provider: "google",
      createdAt: serverTimestamp(),
    });
  }
  return res.user;
}

export async function signUpEmail(email: string, password: string, name?: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    uid: user.uid,
    email,
    displayName: name || "",
    provider: "password",
    createdAt: serverTimestamp(),
  });
  return user;
}

export async function signInEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await signOut(auth);
}

export function onAuth(cb: (u: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
