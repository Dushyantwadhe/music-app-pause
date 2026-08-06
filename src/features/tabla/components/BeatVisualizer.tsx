"use client";

import { useTablaStore } from "@/store/useTablaStore";
import { resolveTablaVariant, TAALS } from "../data/taals";
import { cn } from "@/lib/cn";

export function BeatVisualizer() {
  const { currentBeat, isPlaying, selectedTaal, patternLayer, stylePackId, variantId } = useTablaStore();
  const taal = TAALS[selectedTaal];
  if (!taal) return null;

  const resolved = resolveTablaVariant(selectedTaal, patternLayer, variantId, stylePackId);
  const activePattern = resolved.variant?.pattern?.length ? resolved.variant.pattern : taal.pattern;

  // Group beats by vibhag and compute Sam / Tali / Khali markers
  let beatOffset = 0;
  let taliCount  = 1; // Tali starts at 2 (Sam = X, then Tali 2, 3…)

  const vibhags = taal.vibhags.map((count, vi) => {
    const beats   = activePattern.slice(beatOffset, beatOffset + count);
    beatOffset   += count;
    const isSam   = beats[0]?.isSam ?? false;
    const isKhali = beats[0]?.isKhali ?? false;

    let marker: string;
    if (vi === 0) {
      marker = "X"; // Sam is always first vibhag, shown as X
    } else if (isKhali) {
      marker = "0"; // Khali = empty wave
    } else {
      taliCount++;
      marker = String(taliCount); // Tali 2, 3, 4…
    }

    return { beats, isSam, isKhali, vi, marker };
  });

  return (
    <div className="flex flex-col gap-3" aria-label={`${selectedTaal} beat pattern`}>
      <div className="flex items-start gap-3 flex-wrap">
        {vibhags.map(({ beats, isSam, isKhali, vi, marker }) => (
          <div key={vi} className="flex flex-col items-start gap-1">
            {/* Vibhag marker: X (Sam) / 0 (Khali) / number (Tali) */}
            <span
              className={cn(
                "text-[11px] font-bold tracking-widest",
                isSam && !isKhali && "text-[#1d4ed8]",
                isKhali && !isSam && "text-[#6b7280]",
                isSam && isKhali && "text-[#1d4ed8]/60",
                !isSam && !isKhali && "text-[#6b7280]"
              )}
            >
              {marker}
            </span>

            {/* Beat cells */}
            <div className="flex gap-1.5">
              {beats.map((beat) => {
                const isActive = isPlaying && currentBeat === beat.index;
                return (
                  <div
                    key={beat.index}
                    className={cn(
                      "flex flex-col items-center gap-0.5",
                      isActive && "beat-active"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold",
                        "border-2 transition-all duration-75 select-none",
                        isActive &&
                          "bg-[#dbeafe] text-[#1d4ed8] border-[#93c5fd] scale-105",
                        !isActive && beat.isSam && !beat.isKhali &&
                          "bg-[#eff6ff] text-[#1d4ed8] border-[#93c5fd]",
                        !isActive && beat.isSam && beat.isKhali &&
                          "bg-[#eff6ff] text-[#1d4ed8]/60 border-[#bfdbfe]",
                        !isActive && !beat.isSam && beat.isKhali &&
                          "bg-[#f9fafb] text-[#6b7280] border-[#d1d5db]",
                        !isActive && !beat.isSam && !beat.isKhali &&
                          "bg-white text-[#374151] border-[#d1d5db]"
                      )}
                    >
                      {beat.syllable}
                    </div>
                    <span className="text-[9px] font-mono text-[#6b7280]">
                      {beat.index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap pt-1">
        <span className="flex items-center gap-1 text-[9px] text-[#6b7280]">
          <span className="font-bold text-[#1d4ed8]">X</span> Sam (first beat)
        </span>
        <span className="flex items-center gap-1 text-[9px] text-[#6b7280]">
          <span className="font-bold text-[#6b7280]">2,3...</span> Tali (strong beat)
        </span>
        <span className="flex items-center gap-1 text-[9px] text-[#6b7280]">
          <span className="font-bold">0</span> Khali (empty beat)
        </span>
      </div>
    </div>
  );
}
