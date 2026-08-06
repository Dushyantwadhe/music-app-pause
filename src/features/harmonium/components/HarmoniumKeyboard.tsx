"use client";

import { generateKeys } from "../data/keys";
import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import { cn } from "@/lib/cn";
import { sargamForNote } from "../utils/sargam";

interface KeyboardProps {
  onNoteOn:  (note: string, velocity?: number, source?: string) => void;
  onNoteOff: (note: string, source?: string) => void;
}

export function HarmoniumKeyboard({ onNoteOn, onNoteOff }: KeyboardProps) {
  const { octave, activeNotes, rootNote } = useHarmoniumStore();
  // Always show 3 octaves centred around the selected octave
  const startOct = Math.max(1, octave - 1);
  const keys  = generateKeys(startOct, 3);
  const whites = keys.filter((k) => !k.isBlack);
  const blacks = keys.filter((k) => k.isBlack);

  const whiteWidth = 100 / whites.length; // % width per white key

  // Map white key notes → their display index (for black key positioning)
  const whiteIndexMap = new Map<string, number>();
  whites.forEach((k, i) => whiteIndexMap.set(k.note, i));

  /**
   * Position a black key relative to its preceding white key.
   * Black keys sit 60% into the width of their preceding white key.
   */
  function blackLeft(key: typeof blacks[0]): string {
    // All whites that come before this black key (lower octave OR same octave with smaller semitone)
    const preceding = whites.filter((w) =>
      w.octave < key.octave ||
      (w.octave === key.octave && w.semitone < key.semitone)
    );
    const lastWhite = preceding[preceding.length - 1];
    const idx = lastWhite ? (whiteIndexMap.get(lastWhite.note) ?? 0) : 0;
    // Centre the black key over the boundary between lastWhite and next white
    return `${idx * whiteWidth + whiteWidth * 0.62}%`;
  }

  function pointerHandlers(note: string) {
    return {
      onPointerDown: (e: React.PointerEvent) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        onNoteOn(note, 1, `pointer:${e.pointerId}`);
      },
      onPointerUp: (e: React.PointerEvent) => onNoteOff(note, `pointer:${e.pointerId}`),
      onPointerCancel: (e: React.PointerEvent) => onNoteOff(note, `pointer:${e.pointerId}`),
      onLostPointerCapture: (e: React.PointerEvent) => onNoteOff(note, `pointer:${e.pointerId}`),
    };
  }

  return (
    <div
      className="relative w-full select-none touch-none overflow-x-auto"
      aria-label="Harmonium keyboard"
      role="group"
    >
      <div
        className="relative flex"
        style={{ minWidth: `${whites.length * 30}px`, height: 120 }}
      >
        {/* White keys */}
        {whites.map((key) => {
          const active = activeNotes.has(key.note);
          return (
            <button
              key={key.note}
              type="button"
              className={cn(
                "piano-white-key flex-1 flex flex-col justify-end items-center pb-2",
                active && "active"
              )}
              style={{ height: 120 }}
              aria-label={`${sargamForNote(key.note, rootNote)} octave ${key.octave}`}
              {...pointerHandlers(key.note)}
            >
              <span
                className={cn(
                  "text-[9px] font-semibold pointer-events-none",
                  active ? "text-[#92400e]" : "text-[#64748B]"
                )}
              >
                {sargamForNote(key.note, rootNote)}
              </span>
            </button>
          );
        })}

        {/* Black keys — absolutely positioned */}
        {blacks.map((key) => {
          const active = activeNotes.has(key.note);
          return (
            <button
              key={key.note}
              type="button"
              className={cn("piano-black-key", active && "active")}
              style={{
                left:   blackLeft(key),
                width:  `${whiteWidth * 0.58}%`,
                height: 72,
                top:    0,
              }}
              aria-label={`${key.label} octave ${key.octave}`}
              {...pointerHandlers(key.note)}
            />
          );
        })}
      </div>
    </div>
  );
}
