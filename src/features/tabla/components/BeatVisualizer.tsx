"use client";

import { useTablaStore } from "@/store/useTablaStore";
import { TAALS } from "../data/taals";
import { cn } from "@/lib/cn";

export function BeatVisualizer() {
  const { currentBeat, isPlaying, selectedTaal } = useTablaStore();
  const taal = TAALS[selectedTaal];
  if (!taal) return null;

  // Group beats by vibhag and compute Sam / Tali / Khali markers
  let beatOffset = 0;
  let taliCount  = 1; // Tali starts at 2 (Sam = X, then Tali 2, 3…)

  const vibhags = taal.vibhags.map((count, vi) => {
    const beats   = taal.pattern.slice(beatOffset, beatOffset + count);
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
                isSam    && !isKhali && "text-[#F59E0B]",
                isKhali  && !isSam   && "text-[#475569]",
                isSam    && isKhali  && "text-[#F59E0B]/60", // Rupak sam
                !isSam   && !isKhali && "text-[#64748B]"
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
                        // Active beat
                        isActive &&
                          "bg-[#F59E0B] text-[#0F172A] border-[#F59E0B] shadow-lg shadow-amber-900/60 scale-110",
                        // Sam (first beat of cycle)
                        !isActive && beat.isSam && !beat.isKhali &&
                          "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/60",
                        // Rupak sam (sam that is also khali)
                        !isActive && beat.isSam && beat.isKhali &&
                          "bg-[#F59E0B]/10 text-[#F59E0B]/60 border-[#F59E0B]/30",
                        // Khali beat
                        !isActive && !beat.isSam && beat.isKhali &&
                          "bg-[#1E293B] text-[#475569] border-[#334155]",
                        // Normal beat
                        !isActive && !beat.isSam && !beat.isKhali &&
                          "bg-[#273548] text-[#94A3B8] border-[#334155]"
                      )}
                    >
                      {beat.syllable}
                    </div>
                    {/* Beat number */}
                    <span className="text-[9px] text-[#475569] font-mono">
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
        <span className="flex items-center gap-1 text-[9px] text-[#475569]">
          <span className="font-bold text-[#F59E0B]">X</span> Sam (first beat)
        </span>
        <span className="flex items-center gap-1 text-[9px] text-[#475569]">
          <span className="font-bold text-[#64748B]">2,3…</span> Tali (strong beat)
        </span>
        <span className="flex items-center gap-1 text-[9px] text-[#475569]">
          <span className="font-bold">0</span> Khali (empty beat)
        </span>
      </div>
    </div>
  );
}
