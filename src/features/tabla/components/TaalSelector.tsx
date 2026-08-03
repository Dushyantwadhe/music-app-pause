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
              "w-full text-left rounded-xl p-3 border transition-all duration-150",
              "flex items-center justify-between group cursor-pointer",
              active
                ? "bg-[#F59E0B]/10 border-[#F59E0B] text-[#F8FAFC]"
                : "bg-[#1E293B] border-[#334155] text-[#94A3B8] hover:border-[#475569]"
            )}
            aria-pressed={active}
          >
            <div>
              <p className={cn("text-sm font-semibold", active && "text-[#F59E0B]")}>
                {taal.name}
              </p>
              <p className="text-xs text-[#475569] mt-0.5">{taal.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(taal.name); }}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              className={cn("text-lg shrink-0", fav ? "text-[#F59E0B]" : "text-[#334155] hover:text-[#64748B]")}
            >
              {fav ? "★" : "☆"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
