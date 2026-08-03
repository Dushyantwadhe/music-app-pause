"use client";

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getFirebaseApp } from "./firebase";
import { useProfileStore } from "@/store/useProfileStore";
import type { UserProfile } from "@/types";

function getAuthInstance() {
  return getAuth(getFirebaseApp());
}

export async function signInWithGoogle(): Promise<UserProfile | null> {
  const auth = getAuthInstance();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    const profile: UserProfile = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName ?? "Musician",
      email: firebaseUser.email ?? "",
      photoURL: firebaseUser.photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    useProfileStore.getState().setUser(profile);
    return profile;
  } catch (err) {
    console.error("Google sign-in failed:", err);
    return null;
  }
}

export async function signOut(): Promise<void> {
  const auth = getAuthInstance();
  await firebaseSignOut(auth);
  useProfileStore.getState().signOut();
}

export function onAuthChange(callback: (user: UserProfile | null) => void): () => void {
  const auth = getAuthInstance();
  return auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName ?? "Musician",
        email: firebaseUser.email ?? "",
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      callback(null);
    }
  });
}
