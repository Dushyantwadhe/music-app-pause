"use client";

import { useEffect, useRef, useCallback } from "react";
import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import {
  playNote,
  stopNote,
  stopAllNotes,
} from "../engine/audioEngine";
import { KEY_MAP } from "../data/keys";

const NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"] as const;

export function useHarmoniumEngine() {
  const {
    volume,
    sustain,
    octave,
    transpose,
    rootNote,
    tuningMode,
    toneMode,
    bellowsExpression,
    addActiveNote,
    removeActiveNote,
    isRecording,
    addRecordedNote,
  } = useHarmoniumStore();

  const pressedKeys       = useRef<Set<string>>(new Set());
  const noteStartTimes    = useRef<Map<string, number>>(new Map());
  const keyboardNoteMap   = useRef<Map<string, string>>(new Map());

  const panicStopAll = useCallback(() => {
    if (pressedKeys.current.size === 0) {
      stopAllNotes();
      return;
    }

    for (const note of pressedKeys.current) {
      stopNote(note);
      removeActiveNote(note);
    }

    pressedKeys.current.clear();
    noteStartTimes.current.clear();
    keyboardNoteMap.current.clear();
  }, [removeActiveNote]);

  const handleNoteOn = useCallback((note: string, velocity = 1) => {
    if (pressedKeys.current.has(note)) return;
    pressedKeys.current.add(note);
    noteStartTimes.current.set(note, Date.now());
    playNote(note, volume, sustain, transpose, rootNote, tuningMode, toneMode, bellowsExpression, velocity);
    addActiveNote(note);
  }, [addActiveNote, bellowsExpression, rootNote, sustain, toneMode, transpose, tuningMode, volume]);

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
      if (keyboardNoteMap.current.has(e.key.toLowerCase())) return;
      const semi = KEY_MAP[e.key.toLowerCase()];
      if (semi === undefined) return;
      const noteOct      = semi >= 12 ? octave + 1 : octave;
      const semitoneInOct = semi % 12;
      const note = `${NOTE_NAMES[semitoneInOct]}${noteOct}`;
      keyboardNoteMap.current.set(e.key.toLowerCase(), note);
      handleNoteOn(note, 1);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const lowered = e.key.toLowerCase();
      const note = keyboardNoteMap.current.get(lowered);
      if (!note) return;
      keyboardNoteMap.current.delete(lowered);
      handleNoteOff(note);
    };

    const onWindowBlur = () => {
      panicStopAll();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        panicStopAll();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      panicStopAll();
    };
  }, [octave, handleNoteOn, handleNoteOff, panicStopAll]);

  useEffect(() => {
    if (!("requestMIDIAccess" in navigator)) return;

    let access: MIDIAccess | null = null;
    const listeners = new Map<MIDIInput, (event: MIDIMessageEvent) => void>();

    const midiToNote = (noteNumber: number) => {
      const semitone = noteNumber % 12;
      const noteOctave = Math.floor(noteNumber / 12) - 1;
      return `${NOTE_NAMES[semitone]}${noteOctave}`;
    };

    const detachListeners = () => {
      listeners.forEach((listener, input) => {
        input.removeEventListener("midimessage", listener);
      });
      listeners.clear();
    };

    const attachListeners = () => {
      if (!access) return;
      detachListeners();

      access.inputs.forEach((input) => {
        const listener = (event: MIDIMessageEvent) => {
          const data = event.data;
          if (!data || data.length < 3) return;

          const status = data[0] & 0xf0;
          const noteNumber = data[1];
          const velocity = data[2] / 127;
          const note = midiToNote(noteNumber);

          if (status === 0x90 && velocity > 0) {
            handleNoteOn(note, velocity);
          } else if (status === 0x80 || (status === 0x90 && velocity === 0)) {
            handleNoteOff(note);
          }
        };

        input.addEventListener("midimessage", listener);
        listeners.set(input, listener);
      });
    };

    navigator.requestMIDIAccess()
      .then((midiAccess) => {
        access = midiAccess;
        attachListeners();
        access.addEventListener("statechange", attachListeners);
      })
      .catch(() => {
        // Ignore MIDI init errors to keep keyboard interaction uninterrupted.
      });

    return () => {
      if (access) {
        access.removeEventListener("statechange", attachListeners);
      }
      detachListeners();
      panicStopAll();
    };
  }, [handleNoteOff, handleNoteOn, panicStopAll]);

  return { handleNoteOn, handleNoteOff };
}

