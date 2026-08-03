"use client";

import { useHarmoniumEngine } from "../hooks/useHarmoniumEngine";
import { HarmoniumKeyboard } from "./HarmoniumKeyboard";
import { HarmoniumControls } from "./HarmoniumControls";
import { RecordingControls } from "./RecordingControls";
import { ActiveNoteDisplay } from "./ActiveNoteDisplay";

export function HarmoniumView() {
  const { handleNoteOn, handleNoteOff } = useHarmoniumEngine();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#F8FAFC] tracking-tight">Harmonium</h1>
          <p className="text-xs text-[#64748B]">A S D F G H J — white keys · W E T Y U — black</p>
        </div>
        <ActiveNoteDisplay />
      </div>

      {/* Keyboard */}
      <div
        className="rounded-2xl overflow-hidden border border-[#334155]"
        style={{ background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)" }}
      >
        <div className="p-3 pb-0">
          <HarmoniumKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
        </div>
      </div>

      {/* Controls */}
      <HarmoniumControls />

      {/* Recording */}
      <RecordingControls />

      {/* Future placeholders */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-dashed border-[#334155] p-4 flex flex-col items-center justify-center gap-1 opacity-40">
          <span className="text-xs text-[#64748B] font-medium">MIDI Support</span>
          <span className="text-[10px] text-[#475569]">Coming soon</span>
        </div>
        <div className="rounded-xl border border-dashed border-[#334155] p-4 flex flex-col items-center justify-center gap-1 opacity-40">
          <span className="text-xs text-[#64748B] font-medium">AI Pitch Detection</span>
          <span className="text-[10px] text-[#475569]">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
