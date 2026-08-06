"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { useTanpuraStore } from "@/store/useTanpuraStore";
import type { RootNote } from "@/types";

const ROOT_NOTES: RootNote[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function TanpuraView() {
  const { mode, rootNote, octave, volume, setMode, setRootNote, setOctave, setVolume } = useTanpuraStore();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
      <div>
        <h1 className="text-lg font-bold text-[#111827]">Tanpura</h1>
        <p className="text-xs text-[#6b7280]">Your tonal foundation for any practice.</p>
      </div>
      <Card className="flex flex-col gap-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280]">Drone</p>
          <div className="flex flex-wrap gap-2">
            {(["off", "sa", "sa+pa"] as const).map((option) => (
              <Button key={option} size="sm" variant={mode === option ? "primary" : "outline"} onClick={() => setMode(option)}>
                {option === "off" ? "Off" : option === "sa" ? "Sa" : "Sa + Pa"}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#6b7280]">Root Sa</p>
            <select value={rootNote} onChange={(event) => setRootNote(event.target.value as RootNote)} className="w-full rounded border border-[#d1d5db] bg-white px-2 py-1 text-xs text-[#111827]">
              {ROOT_NOTES.map((note) => <option key={note} value={note}>{note}</option>)}
            </select>
          </div>
          <Slider label="Octave" value={octave} min={2} max={5} onChange={setOctave} formatValue={(value) => `Oct ${value}`} />
        </div>
        <Slider label="Volume" value={Math.round(volume * 100)} min={0} max={100} onChange={(value) => setVolume(value / 100)} formatValue={(value) => `${value}%`} />
      </Card>
    </div>
  );
}
