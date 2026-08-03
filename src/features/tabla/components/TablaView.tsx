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
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#F8FAFC] tracking-tight">Tabla</h1>
        <p className="text-xs text-[#64748B]">Rhythm companion for riyaaz</p>
      </div>

      {/* Current taal card */}
      <Card glow={isPlaying}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] text-[#64748B] uppercase tracking-widest">Current Taal</p>
            <h2 className="text-2xl font-bold text-[#F59E0B]">{selectedTaal}</h2>
            {taal && (
              <p className="text-xs text-[#64748B] mt-0.5">{taal.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-bold text-[#F8FAFC]">{bpm}</p>
            <p className="text-[10px] text-[#64748B] uppercase tracking-wider">BPM</p>
          </div>
        </div>

        {/* Beat visualizer */}
        <div className="overflow-x-auto py-2">
          <BeatVisualizer />
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
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

      {/* Controls */}
      <Card>
        <div className="flex flex-col gap-4">
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
          {/* BPM presets */}
          <div>
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
              Tempo Presets
            </p>
            <div className="flex gap-2 flex-wrap">
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

      {/* Taal selector */}
      <div>
        <SectionHeader title="Select Taal" />
        <TaalSelector onStop={stop} />
      </div>
    </div>
  );
}
