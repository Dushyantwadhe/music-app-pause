"use client";

import { useTablaStore } from "@/store/useTablaStore";
import { TAAL_LIST } from "../data/taals";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TaalName } from "@/types";

interface TaalSelectorProps {
  onStop: () => void;
}

export function TaalSelector({ onStop }: TaalSelectorProps) {
  const { selectedTaal, setTaal, favoriteTaals, toggleFavorite } = useTablaStore();

  function handleSelect(name: TaalName) {
    onStop();
    setTaal(name);
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
                ? "border-[#93c5fd] bg-[#eff6ff] text-[#1d4ed8]"
                : "border-[#d1d5db] bg-white text-[#111827] hover:bg-[#f9fafb]"
            )}
            aria-pressed={active}
          >
            <div>
              <p className={cn("text-sm font-semibold", active && "text-[#1d4ed8]")}>
                {taal.name}
              </p>
              <p className="mt-0.5 text-xs text-[#6b7280]">{taal.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(taal.name); }}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              className={cn("text-lg shrink-0", fav ? "text-[#1d4ed8]" : "text-[#6b7280]")}
            >
              {fav ? "★" : "☆"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
