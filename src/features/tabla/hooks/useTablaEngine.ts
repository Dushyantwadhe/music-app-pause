"use client";

import { useEffect, useRef } from "react";
import { useTablaStore } from "@/store/useTablaStore";
import { resolveTablaVariant, TAALS } from "../data/taals";

export function useTablaEngine() {
  const {
    selectedTaal,
    bpm,
    countInBeats,
    patternLayer,
    stylePackId,
    variantId,
    setPlaying,
    setCurrentBeat,
    setCountInState,
  } = useTablaStore();

  const taal = TAALS[selectedTaal];
  const resolved = resolveTablaVariant(selectedTaal, patternLayer, variantId, stylePackId);
  const countInTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearCountInTimer() {
    if (!countInTimerRef.current) return;
    clearInterval(countInTimerRef.current);
    countInTimerRef.current = null;
  }

  function play() {
    clearCountInTimer();
    setCurrentBeat(0);

    if (countInBeats === 0) {
      setCountInState(false, 0);
      setPlaying(true);
      return;
    }

    const intervalMs = Math.max(120, Math.round((60 / bpm) * 1000));
    let remaining = countInBeats;

    setPlaying(false);
    setCountInState(true, remaining);
    countInTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearCountInTimer();
        setCountInState(false, 0);
        setCurrentBeat(0);
        setPlaying(true);
        return;
      }
      setCountInState(true, remaining);
    }, intervalMs);
  }

  function pause() {
    clearCountInTimer();
    setCountInState(false, 0);
    setPlaying(false);
  }

  const stop  = () => {
    clearCountInTimer();
    setCountInState(false, 0);
    setPlaying(false);
    setCurrentBeat(0);
  };

  useEffect(() => () => clearCountInTimer(), []);

  return { play, pause, stop, taal, activeVariant: resolved.variant, activeStylePack: resolved.stylePack };
}
