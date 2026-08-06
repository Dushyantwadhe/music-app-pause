"use client";

import { useHarmoniumEngine } from "../hooks/useHarmoniumEngine";
import { HarmoniumKeyboard } from "./HarmoniumKeyboard";
import { HarmoniumControls } from "./HarmoniumControls";
import { RecordingControls } from "./RecordingControls";
import { ActiveNoteDisplay } from "./ActiveNoteDisplay";

export function HarmoniumView() {
  const { handleNoteOn, handleNoteOff } = useHarmoniumEngine();

  return (
    <div className="flex w-full flex-col gap-3 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#111827]">Harmonium</h1>
          <p className="text-xs text-[#6b7280]">A S D F G H J - white keys, W E T Y U - black</p>
        </div>
        <ActiveNoteDisplay />
      </div>

      <div className="overflow-hidden rounded border border-[#d1d5db] bg-white">
        <div className="p-2 pb-0">
          <HarmoniumKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
        </div>
      </div>

      <HarmoniumControls />
      <RecordingControls />
    </div>
  );
}
