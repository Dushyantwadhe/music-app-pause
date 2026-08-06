"use client";

import { useTablaStore } from "@/store/useTablaStore";
import { TAAL_LIST } from "../data/taals";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TaalName } from "@/types";

interface TaalSelectorProps {
  onStop: () => void;
  onAutoPlay: () => void;
}

export function TaalSelector({ onStop, onAutoPlay }: TaalSelectorProps) {
  const { selectedTaal, setTaal, favoriteTaals, toggleFavorite } = useTablaStore();

  function handleSelect(name: TaalName) {
    onStop();
    setTaal(name);
    onAutoPlay();
  }

  return (
    <div className="flex flex-col gap-2">
      {TAAL_LIST.map((taal) => {
        const active = selectedTaal === taal.name;
        const fav = favoriteTaals.includes(taal.name);
        return (
          // Use div+role instead of <button> so the inner favourite <button> doesn't nest
          <div
            key={taal.name}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(taal.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(taal.name);
              }
            }}
            className={cn(
              "w-full cursor-pointer rounded border p-3 text-left transition-colors",
              "flex items-center justify-between group cursor-pointer",
              active
                ? "border-[#d9c8ae] bg-[#f3ebdd] text-[#8a5a2b]"
                : "border-[#e8e1d4] bg-[#fdfbf6] text-[#111827] hover:bg-[#f7f0e2]"
            )}
            aria-pressed={active}
          >
            <div>
              <p className={cn("text-sm font-semibold", active && "text-[#8a5a2b]")}>
                {taal.name}
              </p>
              <p className="mt-0.5 text-xs text-[#6b7280]">{taal.description}</p>
              <p className="mt-0.5 text-[11px] text-[#6b7280]">
                {taal.beats} matras • {taal.vibhags.join("+")} vibhag split
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(taal.name); }}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              className={cn("text-lg shrink-0", fav ? "text-[#8a5a2b]" : "text-[#6b7280]")}
            >
              {fav ? "★" : "☆"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
