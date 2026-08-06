"use client";

import { useHarmoniumEngine } from "../hooks/useHarmoniumEngine";
import { HarmoniumKeyboard } from "./HarmoniumKeyboard";
import { HarmoniumControls } from "./HarmoniumControls";
import { Button } from "@/components/ui/Button";
import { RecordingControls, useRecordingController } from "./RecordingControls";
import { ActiveNoteDisplay } from "./ActiveNoteDisplay";

export function HarmoniumView() {
  const { handleNoteOn, handleNoteOff } = useHarmoniumEngine();
  const recordingController = useRecordingController();

  return (
    <div className="flex w-full flex-col gap-3 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#111827]">Harmonium</h1>
          <p className="text-xs text-[#6b7280]">A S D F G H J - white keys, W E T Y U - black</p>
        </div>
        {recordingController.isRecording ? (
          <Button variant="danger" size="sm" onClick={recordingController.handleStop}>
            <span className="h-2 w-2 rounded-full bg-[#fecaca] animate-pulse" />
            Stop recording
          </Button>
        ) : (
          <Button
            variant="surface"
            size="sm"
            onClick={recordingController.handleStart}
            disabled={recordingController.isStarting}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
            {recordingController.isStarting ? "Starting…" : "Record"}
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded border border-[#d1d5db] bg-white">
        <div className="flex items-center justify-end p-2 pb-0">
          <ActiveNoteDisplay />
        </div>
        <div className="p-2 pb-0">
          <HarmoniumKeyboard onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
        </div>
      </div>

      <HarmoniumControls />
      <RecordingControls controller={recordingController} />
    </div>
  );
}
