"use client";

import { useEffect, useCallback } from "react";
import { useTablaStore } from "@/store/useTablaStore";
import { TAALS } from "../data/taals";
import {
  startRhythm,
  stopRhythm,
  updateBpm,
} from "../engine/rhythmEngine";

export function useTablaEngine() {
  const {
    selectedTaal,
    bpm,
    pitch,
    isPlaying,
    isLooping,
    isMetronomeMode,
    setPlaying,
    setCurrentBeat,
    setBpm,
  } = useTablaStore();

  const taal = TAALS[selectedTaal];

  const handleBeat = useCallback((beatIndex: number) => {
    setCurrentBeat(beatIndex);
  }, [setCurrentBeat]);

  // Start / stop based on isPlaying
  useEffect(() => {
    if (isPlaying && taal) {
      startRhythm({
        pattern: taal.pattern.map((b) => ({
          syllable: b.syllable,
          isKhali: b.isKhali,
        })),
        bpm,
        pitch,
        volume: 0.9,
        isMetronome: isMetronomeMode,
        onBeat: handleBeat,
      });
    } else {
      stopRhythm();
      setCurrentBeat(0);
    }
    return () => { stopRhythm(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, selectedTaal, isMetronomeMode, pitch]);

  // BPM live update
  useEffect(() => {
    if (isPlaying) updateBpm(bpm);
  }, [bpm, isPlaying]);

  const play  = () => setPlaying(true);
  const pause = () => { stopRhythm(); setPlaying(false); };
  const stop  = () => { stopRhythm(); setPlaying(false); setCurrentBeat(0); };

  void isLooping; // handled by engine restart on taal change

  return { play, pause, stop, taal };
}
