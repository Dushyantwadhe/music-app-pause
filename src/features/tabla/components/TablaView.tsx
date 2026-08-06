"use client";

import { useEffect } from "react";
import { useTablaStore } from "@/store/useTablaStore";
import { useTablaEngine } from "../hooks/useTablaEngine";
import { BeatVisualizer } from "./BeatVisualizer";
import { TaalSelector } from "./TaalSelector";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Badge, Card, SectionHeader } from "@/components/ui/Card";
import { getCoreVariantsForTaal, getStylePacksForTaal, THAAT_LIST } from "../data/taals";

export function TablaView() {
  const {
    bpm, setBpm,
    pitch, setPitch,
    isPlaying, isLooping, toggleLoop,
    mode, setMode,
    countInBeats, setCountInBeats,
    patternLayer, setPatternLayer,
    stylePackId, setStylePackId,
    variantId, setVariantId,
    thaatContext, setThaatContext,
    isCountingIn, countInRemaining,
    presetSlots, savePresetSlot, loadPresetSlot,
    selectedTaal,
  } = useTablaStore();

  const { play, pause, stop, taal, activeVariant, activeStylePack } = useTablaEngine();
  const coreVariants = getCoreVariantsForTaal(selectedTaal);
  const stylePacks = getStylePacksForTaal(selectedTaal);
  const selectedPack = stylePacks.find((pack) => pack.id === stylePackId) ?? stylePacks[0] ?? null;
  const visibleVariants = patternLayer === "style-pack"
    ? (selectedPack?.variants ?? [])
    : coreVariants;

  useEffect(() => {
    if (patternLayer === "style-pack" && !selectedPack) {
      setPatternLayer("core");
      if (coreVariants[0]) setVariantId(coreVariants[0].id);
      return;
    }

    if (patternLayer === "style-pack" && selectedPack && stylePackId !== selectedPack.id) {
      setStylePackId(selectedPack.id);
      if (selectedPack.variants[0]) setVariantId(selectedPack.variants[0].id);
      return;
    }

    if (!visibleVariants.some((variant) => variant.id === variantId)) {
      const fallback = visibleVariants[0];
      if (fallback) setVariantId(fallback.id);
    }
  }, [
    coreVariants,
    patternLayer,
    selectedPack,
    setPatternLayer,
    setStylePackId,
    setVariantId,
    stylePackId,
    variantId,
    visibleVariants,
  ]);

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
            {activeVariant && (
              <p className="mt-0.5 text-[11px] text-[#6b7280]">
                Active Pattern: {activeVariant.name} ({activeVariant.kind})
              </p>
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
          {isCountingIn && (
            <Badge variant="muted">Count-in: {countInRemaining}</Badge>
          )}
        </div>
      </Card>

      <Card className="p-3">
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Pattern Layer
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={patternLayer === "core" ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setPatternLayer("core");
                  setStylePackId(null);
                  if (coreVariants[0]) setVariantId(coreVariants[0].id);
                }}
              >
                Core Theka
              </Button>
              <Button
                variant={patternLayer === "style-pack" ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setPatternLayer("style-pack");
                  const nextPack = stylePacks[0] ?? null;
                  setStylePackId(nextPack?.id ?? null);
                  if (nextPack?.variants[0]) setVariantId(nextPack.variants[0].id);
                }}
                disabled={stylePacks.length === 0}
              >
                Style Pack
              </Button>
            </div>
            {patternLayer === "style-pack" && (
              <div className="mt-1.5">
                <p className="text-[11px] text-[#6b7280]">{selectedPack?.description || "No style pack available for this taal yet."}</p>
                {selectedPack && (
                  <select
                    value={selectedPack.id}
                    onChange={(event) => {
                      const nextPack = stylePacks.find((pack) => pack.id === event.target.value) ?? null;
                      setStylePackId(nextPack?.id ?? null);
                      if (nextPack?.variants[0]) setVariantId(nextPack.variants[0].id);
                    }}
                    className="mt-1 w-full rounded border border-[#d1d5db] bg-white px-2 py-1 text-xs text-[#111827]"
                  >
                    {stylePacks.map((pack) => (
                      <option key={pack.id} value={pack.id}>{pack.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Beat Variants
            </p>
            <div className="flex flex-wrap gap-1.5">
              {visibleVariants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={variant.id === variantId ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setVariantId(variant.id)}
                >
                  {variant.name}
                </Button>
              ))}
            </div>
            {activeStylePack && (
              <p className="mt-1 text-[11px] text-[#6b7280]">Source: {activeStylePack.name} ({activeStylePack.source})</p>
            )}
            {activeVariant && (
              <p className="mt-1 text-[11px] text-[#6b7280]">{activeVariant.description}</p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Thaat Context
            </p>
            <select
              value={thaatContext ?? ""}
              onChange={(event) => setThaatContext((event.target.value || null) as typeof thaatContext)}
              className="w-full rounded border border-[#d1d5db] bg-white px-2 py-1 text-xs text-[#111827]"
            >
              <option value="">Not set</option>
              {THAAT_LIST.map((thaat) => (
                <option key={thaat} value={thaat}>{thaat}</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[#6b7280]">Context only for raga mapping. Does not alter rhythm engine.</p>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Mode
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={mode === "tabla" ? "primary" : "outline"}
                size="sm"
                onClick={() => setMode("tabla")}
              >
                Tabla
              </Button>
              <Button
                variant={mode === "metronome" ? "primary" : "outline"}
                size="sm"
                onClick={() => setMode("metronome")}
              >
                Metronome
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Count-in
            </p>
            <div className="flex flex-wrap gap-1.5">
              {([0, 2, 4, 8] as const).map((beats) => (
                <Button
                  key={beats}
                  variant={countInBeats === beats ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCountInBeats(beats)}
                >
                  {beats === 0 ? "Off" : `${beats} Beats`}
                </Button>
              ))}
            </div>
          </div>

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

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[#6b7280]">
              Preset Slots
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              {[0, 1, 2].map((slot) => {
                const preset = presetSlots[slot];
                return (
                  <div key={slot} className="rounded border border-[#d1d5db] p-1.5">
                    <p className="text-[11px] font-semibold text-[#111827]">
                      {preset?.name || `Preset ${slot + 1}`}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#6b7280]">
                      {preset ? `${preset.taalName} • ${preset.bpm} BPM` : "Empty slot"}
                    </p>
                    <div className="mt-1.5 flex gap-1.5">
                      <Button size="sm" variant="outline" onClick={() => savePresetSlot(slot as 0 | 1 | 2)}>
                        Save
                      </Button>
                      <Button size="sm" onClick={() => loadPresetSlot(slot as 0 | 1 | 2)} disabled={!preset}>
                        Load
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <div className="pt-0.5">
        <SectionHeader title="Select Taal" />
        <TaalSelector onStop={stop} onAutoPlay={play} />
      </div>
    </div>
  );
}
