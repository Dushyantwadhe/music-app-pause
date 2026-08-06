"use client";

import { useHarmoniumStore } from "@/store/useHarmoniumStore";

const NOTE_LABELS: Record<string, string> = {
  C:"Sa", "C#":"Re♭", D:"Re", "D#":"Ga♭", E:"Ga",
  F:"Ma", "F#":"Ma#", G:"Pa", "G#":"Dha♭", A:"Dha",
  "A#":"Ni♭", B:"Ni",
};

export function ActiveNoteDisplay() {
  const { activeNotes } = useHarmoniumStore();

  const notes = Array.from(activeNotes);

  return (
    <div className="flex items-center gap-2 min-h-8 flex-wrap">
      {notes.length === 0 ? (
        <span className="text-xs italic text-[#6b7280]">Play a key...</span>
      ) : (
        notes.map((note) => {
          const match = note.match(/^([A-G]#?)(\d)$/);
          const noteName = match ? NOTE_LABELS[match[1]] ?? match[1] : note;
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
