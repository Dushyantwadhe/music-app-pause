"use client";

import { useTablaStore } from "@/store/useTablaStore";
import { TAALS } from "../data/taals";

export function useTablaEngine() {
  const {
    selectedTaal,
    setPlaying,
    setCurrentBeat,
  } = useTablaStore();

  const taal = TAALS[selectedTaal];

  const play  = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const stop  = () => {
    setPlaying(false);
    setCurrentBeat(0);
  };

  return { play, pause, stop, taal };
}
