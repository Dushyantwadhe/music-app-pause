import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaalName } from "@/types";

interface TablaState {
  selectedTaal: TaalName;
  bpm: number;
  pitch: number;
  isPlaying: boolean;
  currentBeat: number;
  isLooping: boolean;
  favoriteTaals: TaalName[];
  isMetronomeMode: boolean;

  setTaal: (t: TaalName) => void;
  setBpm: (b: number) => void;
  setPitch: (p: number) => void;
  setPlaying: (v: boolean) => void;
  setCurrentBeat: (b: number) => void;
  toggleLoop: () => void;
  toggleMetronome: () => void;
  toggleFavorite: (t: TaalName) => void;
  reset: () => void;
}

export const useTablaStore = create<TablaState>()(
  persist(
    (set, get) => ({
      selectedTaal: "Teentaal",
      bpm: 80,
      pitch: 0,
      isPlaying: false,
      currentBeat: 0,
      isLooping: true,
      favoriteTaals: [],
      isMetronomeMode: false,

      setTaal: (t) => set({ selectedTaal: t, currentBeat: 0, isPlaying: false }),
      setBpm: (b) => set({ bpm: Math.max(40, Math.min(240, b)) }),
      setPitch: (p) => set({ pitch: p }),
      setPlaying: (v) => set({ isPlaying: v }),
      setCurrentBeat: (b) => set({ currentBeat: b }),
      toggleLoop: () => set((s) => ({ isLooping: !s.isLooping })),
      toggleMetronome: () => set((s) => ({ isMetronomeMode: !s.isMetronomeMode })),
      toggleFavorite: (t) =>
        set((s) => ({
          favoriteTaals: s.favoriteTaals.includes(t)
            ? s.favoriteTaals.filter((x) => x !== t)
            : [...s.favoriteTaals, t],
        })),
      reset: () => set({ isPlaying: false, currentBeat: 0 }),
    }),
    {
      name: "tabla-settings",
      partialize: (s) => ({
        selectedTaal: s.selectedTaal,
        bpm: s.bpm,
        pitch: s.pitch,
        isLooping: s.isLooping,
        favoriteTaals: s.favoriteTaals,
        isMetronomeMode: s.isMetronomeMode,
      }),
    }
  )
);
