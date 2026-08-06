"use client";

import { useTablaStore } from "@/store/useTablaStore";
import { useTablaEngine } from "../hooks/useTablaEngine";
import { BeatVisualizer } from "./BeatVisualizer";
import { TaalSelector } from "./TaalSelector";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";

export function TablaView() {
  const {
    bpm, setBpm,
    pitch, setPitch,
    isPlaying, isLooping, toggleLoop,
    isMetronomeMode, toggleMetronome,
    selectedTaal,
  } = useTablaStore();

  const { play, pause, stop, taal } = useTablaEngine();

  return (
    <div className="flex w-full flex-col gap-2 p-1.5">
      <div>
        <h1 className="text-base font-bold text-[#111827]">Tabla</h1>
        <p className="text-[11px] text-[#6b7280]">Rhythm companion for riyaaz</p>
      </div>

      <Card glow={isPlaying} className="p-3">
        <div className="mb-1.5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">Current Taal</p>
            <h2 className="text-lg font-bold text-[#111827]">{selectedTaal}</h2>
            {taal && (
              <p className="mt-0.5 text-[11px] text-[#6b7280]">{taal.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xl font-mono font-bold text-[#111827]">{bpm}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#6b7280]">BPM</p>
          </div>
        </div>

        <div className="overflow-x-auto py-1">
          <BeatVisualizer />
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {!isPlaying ? (
            <Button onClick={play} size="lg" className="min-w-[100px]">
              ▶ Play
            </Button>
          ) : (
            <>
              <Button onClick={pause} variant="surface" size="lg">
                ⏸ Pause
              </Button>
              <Button onClick={stop} variant="outline" size="md">
                ⏹ Stop
              </Button>
            </>
          )}
          <Button
            variant={isLooping ? "primary" : "ghost"}
            size="md"
            onClick={toggleLoop}
            aria-pressed={isLooping}
          >
            ↺ Loop
          </Button>
          <Button
            variant={isMetronomeMode ? "primary" : "ghost"}
            size="md"
            onClick={toggleMetronome}
            aria-pressed={isMetronomeMode}
          >
            Metronome
          </Button>
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex flex-col gap-3">
          <Slider
            label="BPM"
            value={bpm}
            min={40}
            max={240}
            onChange={setBpm}
            formatValue={(v) => `${v} BPM`}
          />
          <Slider
            label="Pitch"
            value={pitch}
            min={-6}
            max={6}
            onChange={setPitch}
            formatValue={(v) => (v === 0 ? "0" : v > 0 ? `+${v}` : `${v}`)}
          />
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Tempo Presets
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[40, 60, 80, 100, 120, 160].map((preset) => (
                <Button
                  key={preset}
                  variant={bpm === preset ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setBpm(preset)}
                >
                  {preset}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="pt-0.5">
        <SectionHeader title="Select Taal" />
        <TaalSelector onStop={stop} />
      </div>
    </div>
  );
}
