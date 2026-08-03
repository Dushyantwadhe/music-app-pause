import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, UserSettings, UserStats } from "@/types";

interface ProfileState {
  user: UserProfile | null;
  settings: UserSettings;
  stats: UserStats;
  isLoading: boolean;

  setUser: (u: UserProfile | null) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  updateStats: (patch: Partial<UserStats>) => void;
  setLoading: (v: boolean) => void;
  signOut: () => void;
}

const defaultSettings: UserSettings = {
  uid: "",
  theme: "dark",
  defaultBPM: 80,
  defaultOctave: 4,
  defaultVolume: 0.8,
  defaultDrone: "off",
  audioLatencyHint: "interactive",
  updatedAt: new Date(),
};

const defaultStats: UserStats = {
  practiceMinutes: 0,
  totalSessions: 0,
  recordingsCount: 0,
  favoriteTaals: [],
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: null,
      settings: defaultSettings,
      stats: defaultStats,
      isLoading: false,

      setUser: (u) => set({ user: u }),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch, updatedAt: new Date() } })),
      updateStats: (patch) =>
        set((s) => ({ stats: { ...s.stats, ...patch } })),
      setLoading: (v) => set({ isLoading: v }),
      signOut: () => set({ user: null }),
    }),
    {
      name: "profile-store",
      partialize: (s) => ({ settings: s.settings, stats: s.stats }),
    }
  )
);
