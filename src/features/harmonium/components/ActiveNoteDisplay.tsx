"use client";

import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import { sargamForNote } from "../utils/sargam";

export function ActiveNoteDisplay() {
  const { activeNotes, rootNote } = useHarmoniumStore();

  const notes = Array.from(activeNotes);

  return (
    <div className="flex items-center gap-2 min-h-8 flex-wrap">
      {notes.length === 0 ? (
        <span className="text-xs italic text-[#6b7280]">Play a key...</span>
      ) : (
        notes.map((note) => {
          const noteName = sargamForNote(note, rootNote);
          return (
            <span
              key={note}
              className="rounded border border-[#d1d5db] bg-white px-3 py-1 text-sm font-semibold text-[#111827]"
            >
              {noteName}
            </span>
          );
        })
      )}
    </div>
  );
}
