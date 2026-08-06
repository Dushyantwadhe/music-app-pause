import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DroneMode, HarmoniumSessionConfig } from "@/types";

interface HarmoniumState {
  volume: number;
  sustain: number;
  octave: number;
  transpose: number;
  drone: DroneMode;
  activeNotes: Set<string>;
  isRecording: boolean;
  recordedNotes: Array<{ note: string; time: number; duration: number }>;
  recordingStartTime: number | null;

  setVolume: (v: number) => void;
  setSustain: (v: number) => void;
  setOctave: (v: number) => void;
  setTranspose: (v: number) => void;
  setDrone: (d: DroneMode) => void;
  applyConfig: (config: HarmoniumSessionConfig) => void;
  addActiveNote: (note: string) => void;
  removeActiveNote: (note: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
  addRecordedNote: (note: string, duration: number) => void;
  clearRecording: () => void;
}

export const useHarmoniumStore = create<HarmoniumState>()(
  persist(
    (set, get) => ({
      volume: 0.8,
      sustain: 0.6,
      octave: 4,
      transpose: 0,
      drone: "off",
      activeNotes: new Set(),
      isRecording: false,
      recordedNotes: [],
      recordingStartTime: null,

      setVolume: (v) => set({ volume: v }),
      setSustain: (v) => set({ sustain: v }),
      setOctave: (v) => set({ octave: v }),
      setTranspose: (v) => set({ transpose: v }),
      setDrone: (d) => set({ drone: d }),
      applyConfig: (config) =>
        set({
          volume: config.volume,
          sustain: config.sustain,
          octave: config.octave,
          transpose: config.transpose,
          drone: config.autoEnableDrone ? config.drone : "off",
        }),

      addActiveNote: (note) =>
        set((s) => ({ activeNotes: new Set([...s.activeNotes, note]) })),
      removeActiveNote: (note) =>
        set((s) => {
          const next = new Set(s.activeNotes);
          next.delete(note);
          return { activeNotes: next };
        }),

      startRecording: () =>
        set({ isRecording: true, recordedNotes: [], recordingStartTime: Date.now() }),
      stopRecording: () =>
        set({ isRecording: false, recordingStartTime: null }),
      addRecordedNote: (note, duration) => {
        const start = get().recordingStartTime;
        if (!start) return;
        const time = Date.now() - start;
        set((s) => ({ recordedNotes: [...s.recordedNotes, { note, time, duration }] }));
      },
      clearRecording: () => set({ recordedNotes: [], recordingStartTime: null }),
    }),
    {
      name: "harmonium-settings",
      partialize: (s) => ({
        volume: s.volume,
        sustain: s.sustain,
        octave: s.octave,
        transpose: s.transpose,
        drone: s.drone,
      }),
    }
  )
);
