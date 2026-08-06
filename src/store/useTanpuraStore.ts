import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DroneMode, RootNote } from "@/types";

type TanpuraMode = Exclude<DroneMode, "pa">;

interface TanpuraState {
  mode: TanpuraMode;
  rootNote: RootNote;
  octave: number;
  volume: number;
  setMode: (mode: TanpuraMode) => void;
  setRootNote: (note: RootNote) => void;
  setOctave: (octave: number) => void;
  setVolume: (volume: number) => void;
}

export const useTanpuraStore = create<TanpuraState>()(
  persist(
    (set) => ({
      mode: "off",
      rootNote: "C",
      octave: 3,
      volume: 0.65,
      setMode: (mode) => set({ mode }),
      setRootNote: (rootNote) => set({ rootNote }),
      setOctave: (octave) => set({ octave: Math.max(2, Math.min(5, octave)) }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    }),
    { name: "tanpura-settings" }
  )
);
