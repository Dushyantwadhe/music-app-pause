"use client";

import { useHarmoniumStore } from "@/store/useHarmoniumStore";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DroneMode } from "@/types";

export function HarmoniumControls() {
  const {
    volume, setVolume,
    sustain, setSustain,
    octave, setOctave,
    transpose, setTranspose,
    drone, setDrone,
  } = useHarmoniumStore();

  const droneOptions: { value: DroneMode; label: string }[] = [
    { value: "off",   label: "Off" },
    { value: "sa",    label: "Sa" },
    { value: "pa",    label: "Pa" },
    { value: "sa+pa", label: "Sa+Pa" },
  ];

  return (
    <Card className="flex flex-col gap-4">
      {/* Sliders row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Slider
          label="Volume"
          value={Math.round(volume * 100)}
          min={0}
          max={100}
          onChange={(v) => setVolume(v / 100)}
          formatValue={(v) => `${v}%`}
        />
        <Slider
          label="Sustain"
          value={Math.round(sustain * 100)}
          min={0}
          max={100}
          onChange={(v) => setSustain(v / 100)}
          formatValue={(v) => `${v}%`}
        />
        <Slider
          label="Octave"
          value={octave}
          min={2}
          max={6}
          onChange={setOctave}
          formatValue={(v) => `Oct ${v}`}
        />
        <Slider
          label="Transpose"
          value={transpose}
          min={-6}
          max={6}
          onChange={setTranspose}
          formatValue={(v) => (v === 0 ? "0" : v > 0 ? `+${v}` : `${v}`)}
        />
      </div>

      {/* Drone selector */}
      <div>
        <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider mb-2">
          Drone
        </p>
        <div className="flex gap-2 flex-wrap">
          {droneOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={drone === opt.value ? "primary" : "outline"}
              size="sm"
              onClick={() => setDrone(opt.value)}
              aria-pressed={drone === opt.value}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
