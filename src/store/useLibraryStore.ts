import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recording, PracticeSession } from "@/types";

interface LibraryState {
  recordings: Recording[];
  sessions: PracticeSession[];
  searchQuery: string;
  filterMode: "all" | "favorites" | "recent";
  playingId: string | null;

  addRecording: (r: Recording) => void;
  updateRecording: (id: string, patch: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addSession: (s: PracticeSession) => void;
  setSearchQuery: (q: string) => void;
  setFilterMode: (m: "all" | "favorites" | "recent") => void;
  setPlayingId: (id: string | null) => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      recordings: [],
      sessions: [],
      searchQuery: "",
      filterMode: "all",
      playingId: null,

      addRecording: (r) => set((s) => ({ recordings: [r, ...s.recordings] })),
      updateRecording: (id, patch) =>
        set((s) => ({
          recordings: s.recordings.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      deleteRecording: (id) =>
        set((s) => ({ recordings: s.recordings.filter((r) => r.id !== id) })),
      toggleFavorite: (id) =>
        set((s) => ({
          recordings: s.recordings.map((r) =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
          ),
        })),
      addSession: (s) => set((st) => ({ sessions: [s, ...st.sessions] })),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setFilterMode: (m) => set({ filterMode: m }),
      setPlayingId: (id) => set({ playingId: id }),
    }),
    {
      name: "library-store",
      partialize: (s) => ({ recordings: s.recordings, sessions: s.sessions }),
    }
  )
);
