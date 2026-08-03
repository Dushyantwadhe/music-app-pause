// ─── User & Auth ───────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Settings ──────────────────────────────────────────────────────────────────

export interface UserSettings {
  uid: string;
  theme: "dark" | "light" | "system";
  defaultBPM: number;          // 40–240
  defaultOctave: number;       // 3 | 4 | 5
  defaultVolume: number;       // 0–1
  defaultDrone: "off" | "sa" | "pa" | "sa+pa";
  audioLatencyHint: "interactive" | "balanced" | "playback";
  updatedAt: Date;
}

// ─── Recordings ────────────────────────────────────────────────────────────────

export interface Recording {
  id: string;
  uid: string;
  name: string;
  durationSeconds: number;
  createdAt: Date;
  storageUrl: string | null;  // Firebase Storage path
  isFavorite: boolean;
  notes: string;
  tags: string[];
  instrument: "harmonium" | "tabla" | "other";
  blobUrl?: string;            // local-only, transient
}

// ─── Practice Sessions ─────────────────────────────────────────────────────────

export interface PracticeSession {
  id: string;
  uid: string;
  startedAt: Date;
  endedAt: Date;
  durationMinutes: number;
  instrument: "harmonium" | "tabla" | "mixed";
  taalName?: string;
  bpm?: number;
  notes: string;
}

// ─── Favorites ─────────────────────────────────────────────────────────────────

export interface Favorite {
  id: string;
  uid: string;
  type: "taal" | "recording" | "preset";
  refId: string;
  name: string;
  createdAt: Date;
}

// ─── Taal / Rhythm ─────────────────────────────────────────────────────────────

export type TaalName =
  | "Teentaal"
  | "Dadra"
  | "Keharwa"
  | "Rupak"
  | "Ektaal";

export interface Beat {
  index: number;           // beat position within cycle
  vibhag: number;          // section index
  isSam: boolean;          // first beat of cycle
  isKhali: boolean;        // empty/silent wave beat
  syllable: string;        // e.g. "Dha", "Dhin", "Ti"
  accent: "strong" | "medium" | "weak";
}

export interface Taal {
  name: TaalName;
  beats: number;           // total beats per cycle
  vibhags: number[];       // beat counts per vibhag e.g. [4,4,4] for Teentaal
  pattern: Beat[];
  description: string;
}

// ─── Harmonium ─────────────────────────────────────────────────────────────────

export interface HarmoniumKey {
  note: string;           // e.g. "C4"
  label: string;          // display name Sa, Re, Ga ...
  isBlack: boolean;
  octave: number;
  semitone: number;       // 0–11
}

export type DroneMode = "off" | "sa" | "pa" | "sa+pa";

// ─── Stats ─────────────────────────────────────────────────────────────────────

export interface UserStats {
  practiceMinutes: number;
  totalSessions: number;
  recordingsCount: number;
  favoriteTaals: string[];
}
