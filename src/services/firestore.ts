"use client";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseApp } from "./firebase";
import type { Recording, PracticeSession, UserSettings } from "@/types";

function getDb() {
  return getFirestore(getFirebaseApp());
}

// ── Users ────────────────────────────────────────────────────────────────────

export async function saveUserSettings(uid: string, settings: Partial<UserSettings>) {
  const db = getDb();
  await setDoc(doc(db, "users", uid, "settings", "preferences"), {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserSettings(uid: string): Promise<Partial<UserSettings> | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, "users", uid, "settings", "preferences"));
  return snap.exists() ? (snap.data() as Partial<UserSettings>) : null;
}

// ── Recordings ────────────────────────────────────────────────────────────────

export async function saveRecording(rec: Omit<Recording, "blobUrl">) {
  const db = getDb();
  await setDoc(doc(db, "recordings", rec.id), {
    ...rec,
    createdAt: serverTimestamp(),
  });
}

export async function getUserRecordings(uid: string): Promise<Recording[]> {
  const db = getDb();
  const q = query(collection(db, "recordings"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Recording);
}

export async function deleteRecordingFromDb(id: string) {
  const db = getDb();
  await deleteDoc(doc(db, "recordings", id));
}

// ── Practice Sessions ─────────────────────────────────────────────────────────

export async function savePracticeSession(session: PracticeSession) {
  const db = getDb();
  await setDoc(doc(db, "practiceSessions", session.id), {
    ...session,
    startedAt: serverTimestamp(),
  });
}

export async function getUserSessions(uid: string): Promise<PracticeSession[]> {
  const db = getDb();
  const q = query(collection(db, "practiceSessions"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PracticeSession);
}
