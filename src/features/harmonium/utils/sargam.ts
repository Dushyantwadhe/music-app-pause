import type { RootNote } from "@/types";

const NOTE_TO_SEMITONE: Record<RootNote, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

const SARGAM_BY_DEGREE = [
  "Sa",
  "Re(k)",
  "Re",
  "Ga(k)",
  "Ga",
  "Ma",
  "Ma(t)",
  "Pa",
  "Dha(k)",
  "Dha",
  "Ni(k)",
  "Ni",
] as const;

export function rootSemitone(rootNote: RootNote): number {
  return NOTE_TO_SEMITONE[rootNote];
}

export function parseNote(note: string): { noteName: RootNote; octave: number } | null {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return null;
  const noteName = match[1] as RootNote;
  const octave = Number.parseInt(match[2], 10);
  if (Number.isNaN(octave)) return null;
  return { noteName, octave };
}

export function sargamForNote(note: string, rootNote: RootNote): string {
  const parsed = parseNote(note);
  if (!parsed) return note;
  const semitone = rootSemitone(parsed.noteName);
  const degree = (semitone - rootSemitone(rootNote) + 12) % 12;
  return SARGAM_BY_DEGREE[degree];
}
