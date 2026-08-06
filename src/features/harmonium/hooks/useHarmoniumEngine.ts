"use client";

import { useEffect, useRef, useCallback } from "react";
import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import {
  playNote,
  stopNote,
} from "../engine/audioEngine";
import { KEY_MAP } from "../data/keys";

const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;

export function useHarmoniumEngine() {
  const {
    volume,
    sustain,
    octave,
    transpose,
    addActiveNote,
    removeActiveNote,
    isRecording,
    addRecordedNote,
  } = useHarmoniumStore();

  const pressedKeys       = useRef<Set<string>>(new Set());
  const noteStartTimes    = useRef<Map<string, number>>(new Map());

  const handleNoteOn = useCallback((note: string) => {
    if (pressedKeys.current.has(note)) return;
    pressedKeys.current.add(note);
    noteStartTimes.current.set(note, Date.now());
    playNote(note, volume, sustain, transpose);
    addActiveNote(note);
  }, [volume, sustain, transpose, addActiveNote]);

  const handleNoteOff = useCallback((note: string) => {
    if (!pressedKeys.current.has(note)) return;
    pressedKeys.current.delete(note);
    stopNote(note);
    removeActiveNote(note);
    if (isRecording) {
      const start = noteStartTimes.current.get(note) ?? Date.now();
      addRecordedNote(note, Date.now() - start);
    }
    noteStartTimes.current.delete(note);
  }, [removeActiveNote, isRecording, addRecordedNote]);

  // Keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement) return;
      const semi = KEY_MAP[e.key.toLowerCase()];
      if (semi === undefined) return;
      const noteOct      = semi >= 12 ? octave + 1 : octave;
      const semitoneInOct = semi % 12;
      const note = `${NOTE_NAMES[semitoneInOct]}${noteOct}`;
      handleNoteOn(note);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const semi = KEY_MAP[e.key.toLowerCase()];
      if (semi === undefined) return;
      const noteOct       = semi >= 12 ? octave + 1 : octave;
      const semitoneInOct = semi % 12;
      const note = `${NOTE_NAMES[semitoneInOct]}${noteOct}`;
      handleNoteOff(note);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
    };
  }, [octave, handleNoteOn, handleNoteOff]);

  return { handleNoteOn, handleNoteOff };
}

