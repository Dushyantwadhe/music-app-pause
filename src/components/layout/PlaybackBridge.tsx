"use client";

import { useEffect } from "react";
import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import { useTablaStore } from "@/store/useTablaStore";
import { TAALS } from "@/features/tabla/data/taals";
import { setMasterVolume, startDrone, stopDrone } from "@/features/harmonium/engine/audioEngine";
import { startRhythm, stopRhythm, updateBpm } from "@/features/tabla/engine/rhythmEngine";

export function PlaybackBridge() {
  const harmoniumVolume = useHarmoniumStore((state) => state.volume);
  const harmoniumOctave = useHarmoniumStore((state) => state.octave);
  const harmoniumTranspose = useHarmoniumStore((state) => state.transpose);
  const harmoniumDrone = useHarmoniumStore((state) => state.drone);

  const tablaSelectedTaal = useTablaStore((state) => state.selectedTaal);
  const tablaBpm = useTablaStore((state) => state.bpm);
  const tablaPitch = useTablaStore((state) => state.pitch);
  const tablaIsPlaying = useTablaStore((state) => state.isPlaying);
  const tablaIsMetronomeMode = useTablaStore((state) => state.isMetronomeMode);

  useEffect(() => {
    setMasterVolume(harmoniumVolume);
  }, [harmoniumVolume]);

  useEffect(() => {
    if (harmoniumDrone === "off") {
      stopDrone();
      return;
    }

    startDrone(harmoniumDrone, harmoniumOctave, harmoniumVolume, harmoniumTranspose);
    return () => stopDrone();
  }, [harmoniumDrone, harmoniumOctave, harmoniumTranspose, harmoniumVolume]);

  useEffect(() => {
    if (!tablaIsPlaying) {
      stopRhythm();
      useTablaStore.getState().setCurrentBeat(0);
      return;
    }

    const taal = TAALS[tablaSelectedTaal];
    if (!taal) return;

    startRhythm({
      pattern: taal.pattern.map((beat) => ({
        syllable: beat.syllable,
        isKhali: beat.isKhali,
      })),
      bpm: tablaBpm,
      pitch: tablaPitch,
      volume: 0.9,
      isMetronome: tablaIsMetronomeMode,
      onBeat: (beatIndex) => useTablaStore.getState().setCurrentBeat(beatIndex),
    });

    return () => stopRhythm();
  }, [tablaBpm, tablaIsMetronomeMode, tablaIsPlaying, tablaPitch, tablaSelectedTaal]);

  useEffect(() => {
    if (tablaIsPlaying) {
      updateBpm(tablaBpm);
    }
  }, [tablaBpm, tablaIsPlaying]);

  return null;
}